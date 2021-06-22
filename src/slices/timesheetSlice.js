import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CONSTANT from "../configs/CONSTANT";
import moment from "moment";
import { saveTimeClock, listAllTimesheetStaffInShop, editTimesheetStaff, addTimesheetStaff, loadTimesheetReport, editTimesheetDoc, fetchTimesheetDashboard, listRoster, saveRosterApi, editRosterApi, deleteRoster, ListPaidType, SavePaidType, EditPaidType, duplicateRosterBasedOnToday, duplicateRoster } from "../services/timesheetApi";
import { notification } from "antd";
import { history } from "../components/MyRouter";
import _ from "lodash";
import config from "../configs/index";
import { message, dateToMoment, getRounding2 } from "../lib/index";
import { Modal } from "antd";
const { confirm } = Modal;

const initialState = {
  timesheetStaffs: [],
  timesheetDocs: [],
  showAddLeaveModal: false,
  dashboardData: [],
  rosterList: [],
  paidTypeList: [],
};

export const getCurrentActivatedStaff = (timesheetStaffs) => {
  return timesheetStaffs.find(staff => staff.isActive);
};

const validateStaffIsValid = (clocks, breaks, leaves) => {
  if (clocks.length === 0) return new Error("No Clock action found");
  if (clocks.length > 1) return new Error("Found more than one Clock action");
  const clock = clocks[0];
  const start = clock.approve_start_time;
  const end = clock.approve_end_time;
  for (const breakRecord of breaks) {
    const { approve_start_time, approve_end_time } = breakRecord;
    // if (approve_end_time.isSameOrBefore(approve_start_time)) return new Error("Break start time must be earlier than end time")
    if (approve_end_time.isBefore(approve_start_time)) return new Error("Break start time must be earlier than end time");
    if (start.isAfter(approve_start_time)) return new Error("Break start must be later than clock start");
    if (end.isBefore(approve_end_time)) return new Error("Break end must be earlier than clock end");
  }
  for (const leave of leaves) {
    const { approve_start_time, approve_end_time } = leave;
    if (approve_end_time.isBefore(approve_start_time)) return new Error("Leave start time must be earlier than end time");
    // if (approve_end_time.isSameOrBefore(approve_start_time)) return new Error("Leave start time must be earlier than end time")
    if (start.isAfter(approve_start_time)) return new Error("Leave start must be later than clock start");
    if (end.isBefore(approve_end_time)) return new Error("Leave end must be earlier than clock end");
  }
  return true;
};

//Return all invalid staff_id and error
export const validateTimesheetDoc = (timesheetDocs) => {
  if (timesheetDocs.length === 0) return [];
  const sortedTimesheetDoc = timesheetDocs.slice().sort((a, b) => a.staff_id - b.staff_id).map(doc => {
    doc.approve_start_time.set("second", 0);
    doc.approve_end_time.set("second", 0);
    return doc;
  });

  let docByStaffObj = {};
  let currentStaffId = -1;

  for (let i = 0; i < sortedTimesheetDoc.length; i++ ) {
    const doc = sortedTimesheetDoc[i];
    if (doc.staff_id === currentStaffId) {
      docByStaffObj[doc.staff_name].push(doc);
    } else {
      docByStaffObj[doc.staff_name] = [doc];
      currentStaffId = doc.staff_id;
    }
  }

  let invalidStaffs = [];
  for(let staff in docByStaffObj) {
    const currentStaffId = docByStaffObj[staff][0].staff_id;
    const clocks = docByStaffObj[staff].filter(item => item.job_code === config.TIMESHEET.CLOCK);
    const breaks = docByStaffObj[staff].filter(item => item.job_code === config.TIMESHEET.BREAK || item.job_code === config.TIMESHEET.UNPAIDBREAK);
    const leaves = docByStaffObj[staff].filter(item => item.job_code === config.TIMESHEET.LEAVE);
    const res = validateStaffIsValid(clocks, breaks, leaves);
    if (res instanceof Error) {
      invalidStaffs.push({staffId: currentStaffId, error: res});
    }
  }
  return invalidStaffs;
};

//Below validate add action form submit
export const validateAddAction = (staffId, actionObj, timesheetDocs) => {
  const existingTimesheet = timesheetDocs.filter(doc => doc.staff_id == staffId);
  const clocks = existingTimesheet.filter(doc => doc.job_code === config.TIMESHEET.CLOCK);
  const breaks = existingTimesheet.filter(doc => doc.job_code === config.TIMESHEET.BREAK || doc.job_code === config.TIMESHEET.UNPAIDBREAK);
  const leaves = existingTimesheet.filter(doc => doc.job_code === config.TIMESHEET.LEAVE);
  const { job_code } = actionObj;
  const { TIMESHEET } = config;
  const { approve_start_time, approve_end_time } = actionObj;
  const actionStart = dateToMoment(approve_start_time);
  const actionEnd = dateToMoment(approve_end_time);

  if (actionStart.isAfter(actionEnd)) throw new Error("Start time must be earlier than end time!");
  if (job_code === TIMESHEET.CLOCK) {
    if (clocks.length > 0) throw new Error("Clock action already exists!");
  } else if (job_code === TIMESHEET.BREAK || job_code === TIMESHEET.LEAVE) {
    // Compare with existing Clock record. Assume only one clock record exist
    if (clocks.length > 0) {
      const clock = clocks[0];
      const { approve_start_time: clockStart, approve_end_time: clockEnd } = clock;
      if (actionStart.isBefore(clockStart)) throw new Error(`The ${job_code} start time must be later than clock start time`);
      if (actionEnd.isAfter(clockEnd)) throw new Error(`The ${job_code} end time must be earlier than clock end time`);
    }
    // Compare with existing Break records
    if (breaks.length > 0) {
      for(let breakRecord of breaks) {
        const { approve_start_time: breakStart, approve_end_time: breakEnd } = breakRecord;
        if (actionStart.isSameOrAfter(breakStart) && actionStart.isSameOrBefore(breakEnd)) throw new Error(`This ${job_code} start time is in range of existing break record`);
        if (actionEnd.isSameOrAfter(breakStart) && actionEnd.isSameOrBefore(breakEnd)) throw new Error(`This ${job_code} start time is in range of existing break record`);
        if (actionStart.isBefore(breakStart) && actionEnd.isAfter(breakEnd)) throw new Error(`This ${job_code} has conflict with another existing break record`);
      }
    }
    // Compare with existing Leave records
    if (leaves.length > 0) {
      for (let leave of leaves) {
        const { approve_start_time: leaveStart, approve_end_time: leaveEnd } = leave;
        if (actionStart.isSameOrAfter(leaveStart) && actionStart.isSameOrBefore(leaveEnd)) throw new Error(`This ${job_code} start time is in range of existing leave record`);
        if (actionEnd.isSameOrAfter(leaveStart) && actionEnd.isSameOrBefore(leaveEnd)) throw new Error(`This ${job_code} end time is in range of existing leave record`);
        if (actionStart.isBefore(leaveStart) && actionEnd.isAfter(leaveEnd)) throw new Error(`This ${job_code} has conflict with another existing leave record`);
      }
    }
  } else {
    throw new Error("Unknown job action");
  }
};

export const calculateSumHoursByStaffId = (id, timesheetDocs) => {
  const clockRecord = timesheetDocs.find(doc => doc.staff_id === id && doc.job_code === config.TIMESHEET.CLOCK);
  const unpaidActionRecords = timesheetDocs.filter(doc => doc.staff_id === id && (doc.job_code === config.TIMESHEET.LEAVE || doc.job_code === config.TIMESHEET.UNPAIDBREAK));
  const unpaidHours = unpaidActionRecords.length === 0 ? 0 : unpaidActionRecords.reduce((acc, cur) => cur.approve_hours + acc, 0);
  return clockRecord ? getRounding2(clockRecord.approve_hours - unpaidHours) : "";
};

export const clockAction = createAsyncThunk("timesheet/clockAction", async ({ jobCode, statusCode }, { getState, dispatch, rejectWithValue }) => {
  try {
    const { Auth, Timesheet } = getState();
    const { shop } = Auth;
    const { timesheetStaffs } = Timesheet;
    const staff = getCurrentActivatedStaff(timesheetStaffs);
    const res = await saveTimeClock({
      staff_id: staff.id,
      staff_name: staff.uname,
      job_status: statusCode,
      job_code: jobCode,
      branch_code: "", //Ignore this for now according to api document
      store_code: shop.shop_name,
    });
    if (res.error) throw res.error;
    const updatedStaff = res.data;
    dispatch(updateStaff({staff: updatedStaff}));
    return res;
  } catch (e) {
    message.error(e.message);
    return rejectWithValue(e.message);
  }
});

export const clockIn = createAsyncThunk("timesheet/clockIn", async (data, { getState, dispatch, rejectWithValue }) => {
  return await dispatch(clockAction({jobCode: config.TIMESHEET.CLOCK, statusCode: 0}));
});

export const clockOut = createAsyncThunk("timesheet/clockOut", async (data, { getState, dispatch, rejectWithValue }) => {
  return await dispatch(clockAction({jobCode: config.TIMESHEET.CLOCK, statusCode: 1}));
});

export const breakOn = createAsyncThunk("timesheet/breakOn", async (data, { getState, dispatch, rejectWithValue }) => {
  console.log({jobCode: config.TIMESHEET.BREAK, statusCode: 0});
  return await dispatch(clockAction({jobCode: config.TIMESHEET.BREAK, statusCode: 0}));
});

export const breakOff = createAsyncThunk("timesheet/breakOff", async (data, { getState, dispatch, rejectWithValue }) => {
  return await dispatch(clockAction({jobCode: config.TIMESHEET.BREAK, statusCode: 1}));
});

export const unpaidBreakOn = createAsyncThunk("timesheet/unpaidBreakOn", async (data, { getState, dispatch, rejectWithValue }) => {
  return await dispatch(clockAction({jobCode: config.TIMESHEET.UNPAIDBREAK, statusCode: 0}));
});

export const unpaidBreakOff = createAsyncThunk("timesheet/unpaidBreakOff", async (data, { getState, dispatch, rejectWithValue }) => {
  return await dispatch(clockAction({jobCode: config.TIMESHEET.UNPAIDBREAK, statusCode: 1}));
});

export const fetchTimesheetStaffs = createAsyncThunk("timesheet/fetchTimesheetStaffs", async ({ shop }, { getState, dispatch, rejectWithValue }) => {
  try {
    const shopName = shop ? shop.shop_name : null;
    const res = await listAllTimesheetStaffInShop(shopName);
    if (res.error) throw res.error;
    if (res.data) {
       return res.data.map(staff => {
          return {
            ...staff,
            isActive: false,
          };
        });
    }
  } catch (e) {
    message.error(e.message);
    return rejectWithValue(e.message);
  }
});

export const saveTimesheetStaffToServer = createAsyncThunk("timesheet/saveTimesheetStaffToServer", async ({ staff }, { getState, dispatch, rejectWithValue }) => {
  try {
    staff["realname"] = staff.uname;
    if (!staff.id && staff.hasOwnProperty("id")) {
      delete staff.id;
    }
    const res = staff.id ? await editTimesheetStaff(staff) : await addTimesheetStaff(staff);
    if (res.error) throw res.error;
    return res;
  } catch (e) {
    message.error(e.message);
    return rejectWithValue(e.message);
  }
});


export const loadTimesheetDocs = createAsyncThunk("timesheet/loadTimesheetDocs", async ({ selectedDate }, { getState, dispatch, rejectWithValue }) => {
  try {
    const { Auth, Timesheet } = getState();
    const { shop } = Auth;
    const dateStr = selectedDate.format("YYYY-MM-DD");
    const res = await loadTimesheetReport(dateStr, shop.shop_name);
    if (res.error) throw res.error;
    if (res.data) {
      dispatch(saveTimesheetDocs(res.data));
    } else {
      dispatch(clearTimesheetDocs());
    }
  } catch (e) {
    message.error(e.message);
    return rejectWithValue(e.message);
  }
});

export const updateStartTime = createAsyncThunk("timesheet/updateStartTime", async ({ index, time }, { getState, dispatch, rejectWithValue }) => {
  try {
    if (time !== null) {
      const { Timesheet } = getState();
      const { timesheetDocs } = Timesheet;
      let singleDoc = _.cloneDeep(timesheetDocs)[index];
      singleDoc.approve_start_time = time;
      await dispatch(saveSingleDocToServer({index, singleDoc}));
    }
  } catch (e) {
    message.error(e.message);
    return rejectWithValue(e.message);
  }
});

export const updateEndTime = createAsyncThunk("timesheet/updateEndTime", async ({ index, time }, { getState, dispatch, rejectWithValue }) => {
  try {
    if (time !== null) {
      const { Timesheet } = getState();
      const { timesheetDocs } = Timesheet;
      let singleDoc = _.cloneDeep(timesheetDocs)[index];
      singleDoc.approve_end_time = time;
      await dispatch(saveSingleDocToServer({index, singleDoc}));
    }
  } catch (e) {
    message.error(e.message);
    return rejectWithValue(e.message);
  }
});

export const saveSingleDocToServer = createAsyncThunk("timesheet/saveSingleDocToServer", async ({ index, singleDoc }, { getState, dispatch, rejectWithValue }) => {
  try {
    const data = {
      id: singleDoc.id,
      approve_start_time: singleDoc.approve_start_time.format("YYYY-MM-DD HH:mm:ss"),
      approve_end_time: singleDoc.approve_end_time.format("YYYY-MM-DD HH:mm:ss"),
    };
    const res = await editTimesheetDoc(data);
    if (res.error) throw res.error;
    if (res.data) {
      const newDoc = {
        ...res.data,
        approve_start_time: dateToMoment(res.data.approve_start_time),
        approve_end_time: dateToMoment(res.data.approve_end_time),
        origin_start_time: dateToMoment(res.data.origin_start_time),
        origin_end_time: dateToMoment(res.data.origin_end_time),
        isVisible: singleDoc.isVisible
      };
      return {index, newDoc};
      // dispatch(spliceTimesheetDocs({index, newDoc}));
    }
  } catch (e) {
    message.error(e.message);
    return rejectWithValue(e.message);
  }
});


export const fetchDashboardData = createAsyncThunk("timesheet/fetchDashboardData", async ({ filterAllShop }, { getState, dispatch, rejectWithValue }) => {
  try {
    const { Auth } = getState();
    const { shop } = Auth;
    // setPageLoading(true)
    const res = await fetchTimesheetDashboard(filterAllShop ? "" : shop.shop_name);
    if (res.error) throw res.error;
    return res;
  } catch (e) {
    message.error(e.message);
    return rejectWithValue(e.message);
  }
});


export const fetchRosterList = createAsyncThunk("timesheet/fetchRosterList", async ({ from, to }, { getState, dispatch, rejectWithValue }) => {
  try {
    // setPageLoading(true)
    const res = await listRoster(from, to);
    if (res.error) throw res.error;
    return res;
  } catch (e) {
    message.error(e.message);
    return rejectWithValue(e.message);
  }
});

export const saveRoster = createAsyncThunk("timesheet/saveRoster", async ({ roster }, { getState, dispatch, rejectWithValue }) => {
  try {
    // setPageLoading(true)
    if (roster.end_time.isSameOrBefore(roster.start_time)) throw new Error("End time must be later than start time");
    const formatData = {
      ...roster,
      start_time: roster.start_time.format("HH:mm:ss"),
      end_time: roster.end_time.format("HH:mm:ss"),
      schedule_date: roster.schedule_date.format("YYYY-MM-DD"),
      branch_code: roster.store_code
    };
    let res;
    if (formatData.id === "") {
      delete formatData["id"];
      res = await saveRosterApi(formatData);
    } else {
      res = await editRosterApi(formatData);
    }
    if (res.error) throw res.error;
  } catch (e) {
    message.error(e.message);
    return rejectWithValue(e.message);
  }
});

export const delRoster = createAsyncThunk("timesheet/delRoster", async ({ id }, { getState, dispatch, rejectWithValue }) => {
  try {
    // setPageLoading(true)
    const res = await deleteRoster(id);
    if (res.error) throw res.error;
  } catch (e) {
    message.error(e.message);
    return rejectWithValue(e.message);
  }
});


export const fetchPaidTypeList = createAsyncThunk("timesheet/fetchPaidTypeList", async (data, { getState, dispatch, rejectWithValue }) => {
  try {
    // setPageLoading(true)
    const res = await ListPaidType();
    if (res.error) throw res.error;
    return res;
  } catch (e) {
    message.error(e.message);
    return rejectWithValue(e.message);
  }
});

export const savePaidType = createAsyncThunk("timesheet/savePaidType", async ({ obj }, { getState, dispatch, rejectWithValue }) => {
  try {
    // setPageLoading(true)
    let res;
    if (obj.id === "") {
      delete obj["id"];
      res = await SavePaidType(obj);
    } else {
      res = await EditPaidType(obj);
    }
    if (res.error) throw res.error;
    return await dispatch(fetchPaidTypeList());
  } catch (e) {
    message.error(e.message);
    return rejectWithValue(e.message);
  }
});

//Duplicate roster based on current date
export const simpleDuplicateRoster = createAsyncThunk("timesheet/simpleDuplicateRoster", async ({ isOverWriting }, { getState, dispatch, rejectWithValue }) => {
  try {
    const { Auth } = getState();
    const { shop } = Auth;
    // setPageLoading(true)
    const res = await duplicateRosterBasedOnToday(shop.shop_name, isOverWriting ? 1 : 0);
    if (res.code === 3000) {  //Alert existing record if user want to overwrite
      confirm({
        title: "Overwrite existing roster ?",
        okText: "Yes",
        cancelText: "No",
        content: "You have roster already. By clicking yes, your existing roster will be overwritten.",
        onOk: async () => {
          await dispatch(simpleDuplicateRoster({isOverWriting: true}));
        }
      });
    } else if (res.error) {
      throw res.error;
    }
  } catch (e) {
    message.error(e.message);
    return rejectWithValue(e.message);
  }
});

//Duplicate roster by giving date
export const generalDuplicateRoster = createAsyncThunk("timesheet/generalDuplicateRoster", async ({ data, reFetchRosterHandler }, { getState, dispatch, rejectWithValue }) => {
  try {
    const res = await duplicateRoster(data);
    if (res.code === 3000) {  //Alert existing record if user want to overwrite
      confirm({
        title: "Overwrite existing roster ?",
        okText: "Yes",
        cancelText: "No",
        content: "You have roster already. By clicking yes, your existing roster will be overwritten.",
        onOk: async () => {
          const overWritingData = {...data, is_overwrite: 1};
          await dispatch(generalDuplicateRoster({data:overWritingData, reFetchRosterHandler}));
          await reFetchRosterHandler();
        }
      });
    } else if (res.error) {
      throw res.error;
    }
    await reFetchRosterHandler();
  } catch (e) {
    message.error(e.message);
    return rejectWithValue(e.message);
  }
});



const TimesheetSlice = createSlice({
  name: "timesheet",
  initialState,
  reducers: {
    updateStaff(state, action) {
      const { staff } = action.payload;
      const index = state.timesheetStaffs.findIndex(item => item.id == staff.id);
      const newStaff = _.cloneDeep(staff);
      newStaff.typedPassword = "";
      newStaff.isActive = true;
      if (index !== -1) {
        state.timesheetStaffs.splice(index, 1, _.cloneDeep(newStaff));
      }
    },
    activatedStaff(state, action) {
      const staffId = action.payload;
      state.timesheetStaffs = state.timesheetStaffs.map(item => {
        item.isActive = item.id == staffId;
        return item;
      });
    },
    inactiveStaff(state) {
      state.timesheetStaffs = state.timesheetStaffs.map(item => {
        item.isActive = false;
        return item;
      });
    },
    saveTimesheetDocs(state, action) {
      state.timesheetDocs = action.payload.map(doc => {
        doc.approve_start_time = dateToMoment(doc.approve_start_time);
        doc.approve_end_time = dateToMoment(doc.approve_end_time);
        doc.origin_start_time = dateToMoment(doc.origin_start_time);
        doc.origin_end_time = dateToMoment(doc.origin_end_time);
        doc.isVisible = true;
        return doc;
      });
    },
    clearTimesheetDocs(state) {
      state.timesheetDocs = [];
    },
    invisibleDoc(state, action) {
      const staffId = action.payload;
      state.timesheetDocs = state.timesheetDocs.map(doc => {
        doc.isVisible = doc.staff_id === staffId;
        return doc;
      });
    },
    visibleDoc(state, action) {
      state.timesheetDocs = state.timesheetDocs.map(doc => {
        doc.isVisible = true;
        return doc;
      });
    },
    setShowAddLeaveModal(state, action) {
      state.showAddLeaveModal = action.payload;
    },
    clearDashboardData(state, action) {
      state.dashboardData = [];
    }
  },
  extraReducers: {
    [fetchTimesheetStaffs.fulfilled]: (state, action) => {
      state.timesheetStaffs = action.payload;
    },
    [saveSingleDocToServer.fulfilled]: (state, action) => {
      if (action.payload) {
        const {index, newDoc} = action.payload;
        state.timesheetDocs.splice(index, 1, newDoc );
      }
    },
    [fetchDashboardData.fulfilled]: (state, action) => {
      const { data } = action.payload;
      if (data) {
        state.dashboardData = data.map(data => {
          data.jobs = data.jobs === null ? [] : data.jobs;
          data.work_hours = getRounding2(data.work_hours);
          data.break_hours = getRounding2(data.break_hours);
          data.clock_hours = getRounding2(data.clock_hours);
          return data;
        });
      } else {
        state.dashboardData = [];
      }
    },
    [fetchRosterList.fulfilled]: (state, action) => {
      const { data } = action.payload;
      if (data) {
        state.rosterList = data.map(item => {
          delete item["branch_code"];
          return item;
        });
      } else {
        this.rosterList = [];
      }
    },
    [fetchPaidTypeList.fulfilled]: (state, action) => {
      const { data } = action.payload;
      if (data) {
        state.paidTypeList = data.sort((a, b) => a.multiple_confident - b.multiple_confident);
      } else {
        state.paidTypeList = [];
      }
    }
  }
});

export const { updateStaff, activatedStaff, inactiveStaff, saveTimesheetDocs, setShowAddLeaveModal, visibleDoc, invisibleDoc, clearTimesheetDocs, clearDashboardData } = TimesheetSlice.actions;

export const selectTimesheetStaffs = (state) => state.Timesheet.timesheetStaffs;
export const selectTimesheetDocs = (state) => state.Timesheet.timesheetDocs;
export const selectTimesheetIsPosted = (state) => !!state.Timesheet.timesheetDocs.find(doc => doc.approve_status === 2);
export const selectHasInvisibleLine = (state) => state.Timesheet.timesheetDocs.find(doc => !doc.isVisible);
export const selectDefaultStaffName = (state) => {
  let defaultStaffName = "";
  if (selectHasInvisibleLine(state)) {
    const defaultStaff = state.Timesheet.timesheetDocs.find(doc => doc.isVisible);
    defaultStaffName = defaultStaff.staff_name;
  }
  return defaultStaffName;
};
export const selectShowAddLeaveModal = (state) => state.Timesheet.showAddLeaveModal;
export const selectDashboardData = (state) => state.Timesheet.dashboardData;



export default TimesheetSlice.reducer;