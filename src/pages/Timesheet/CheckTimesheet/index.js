import React, { useEffect, useState } from "react";
import "./index.scss";
import { DatePicker, Button, TimePicker, Tooltip }  from "antd";
import moment from "moment";
import { message, getRounding2, wordsToCamelCase } from "../../../lib/index";
import LeaveModal from "./LeveModal";
import { postTimesheet, deleteTimesheetLine } from "../../../services/timesheetApi";
import config from "../../../configs/index";
import { Form } from "@ant-design/compatible";
import { useSelector, useDispatch, useStore } from "react-redux";
import {selectShop} from "../../../slices/authSlice";
import { selectTimesheetDocs, selectShowAddLeaveModal, saveTimesheetDocs, selectTimesheetIsPosted, validateTimesheetDoc, loadTimesheetDocs, selectHasInvisibleLine, visibleDoc, invisibleDoc, clearTimesheetDocs, updateStartTime, updateEndTime, setShowAddLeaveModal, calculateSumHoursByStaffId } from "../../../slices/timesheetSlice";
import { EditOutlined, ExclamationCircleOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { setPageLoading } from "../../../slices/publicComponentSlice";


const CheckTimesheet = (props) => {
  const yesterday = moment().subtract(1, "days");
  const shop = useSelector((state) => selectShop(state));
  const timesheetDocs = useSelector(state => selectTimesheetDocs(state));
  const dispatch = useDispatch();
  const showAddLeaveModal = useSelector(state => selectShowAddLeaveModal(state));
  const timesheetIsPosted = useSelector(state => selectTimesheetIsPosted(state));
  const hasInVisibleLine = useSelector(state => selectHasInvisibleLine(state));

  const [selectedDate, setSelectedDate] = useState(yesterday);
  const [hasLoadedData, setHasLoadedData] = useState(false);
  const timeFormat = "HH:mm";
  const invalidStaffs = validateTimesheetDoc(timesheetDocs);

  const toggleStaffClickView = (staffId) => {
    hasInVisibleLine ? dispatch(visibleDoc()) : dispatch(invisibleDoc(staffId));
  };

  useEffect(() => {
    return dispatch(clearTimesheetDocs);
  },[]);

  const handleDateChange = date => {
    dispatch(clearTimesheetDocs());
    setSelectedDate(date);
  };

  const disabledDate = current => {
    return current > yesterday.endOf("day");
  };

  const handleLoadBtnClick = async () => {
    try {
      dispatch(setPageLoading(true));
      await dispatch(loadTimesheetDocs({selectedDate}));
      setHasLoadedData(true);
    } catch (e) {
      message.error(e.message);
    } finally {
      dispatch(setPageLoading(false));
    }
  };

  const handleDeleteClick = async (e, doc) => {
    try {
      e.preventDefault();
      dispatch(setPageLoading(true));
      const res = await deleteTimesheetLine(doc.id);
      if (res.error) throw res.error;
      await handleLoadBtnClick();
    } catch (e) {
      message.error(e.message);
    } finally {
      dispatch(setPageLoading(false));
    }

  };

  const handleLeaveBtnClick = () => {
    dispatch(setShowAddLeaveModal(true));
  };

  const handleStaffOnClick = (e, doc) => {
    e.preventDefault();
    toggleStaffClickView(doc.staff_id);
  };

  const getUniqueStaffName = (name, index) => {
    if (index === 0 ) {
      return name;
    } else {
      const previousName = timesheetDocs[index - 1].staff_name;
      return previousName === name ? "" : name;
    }
  };

  const handlePostBtnClick = async () => {
    try {
      dispatch(setPageLoading(true));
      const dateStr = selectedDate.format("YYYY-MM-DD");
      const res = await postTimesheet(dateStr, shop.shop_name);
      if (res.error)  throw res.error;
      if (res.data) {
        dispatch(saveTimesheetDocs(res.data));
        message.success("Timesheet posted success");
      }
    } catch (e) {
      message.error(e.message);
    } finally {
      dispatch(setPageLoading(false));
    }
  };

  // const handleDevBtnClick = () => {
  //   console.log(_.cloneDeep(timesheetDocs));
  // };

  return (
      <div className="check-timesheet-container">
        <h2>
          Check Timesheet
          <DatePicker
              className="check-timesheet-date-picker"
              value={selectedDate}
              allowClear={false}
              onChange={handleDateChange}
              disabledDate={disabledDate}
          />
          {wordsToCamelCase(shop.shop_name)}
          <Button
              className="third-button load-btn"
              disabled={!selectedDate}
              onClick={handleLoadBtnClick}
          >Load Timesheet</Button>
          {/*<Button onClick={handleDevBtnClick}>Dev</Button>*/}
        </h2>

        {
          timesheetIsPosted &&
          <div className="posted-container">
            <span>posted</span>
          </div>
        }

        <div className="check-timesheet-data-table-container">
          {
            hasInVisibleLine &&
            <p className="tips-paragraph">Tips: Click staff name to see all records</p>
          }
          {
            // timesheetDocs.length > 0 &&
              <>
                <table className="check-timesheet-data-table">
                  <thead>
                  <tr>
                    {/*<th>#</th>*/}
                    <th>
                      <Tooltip title="Click staff name to focus">
                      Staff
                        <QuestionCircleOutlined type="question-circle" style={{marginLeft: 10}}/>
                      </Tooltip>
                    </th>
                    <th>Action</th>
                    <th>Actual Start</th>
                    <th>Actual End</th>
                    <th>
                      Approve Start
                      {
                        !timesheetIsPosted &&
                        <EditOutlined className="check-timesheet-time-edit-icon" type="edit"/>
                      }
                    </th>
                    <th>
                      Approve End
                      {
                        !timesheetIsPosted &&
                        <EditOutlined className="check-timesheet-time-edit-icon" type="edit"/>
                      }
                    </th>
                    <th>Actual Hours</th>
                    <th>Approve Hours</th>
                    <th>Sum Hours</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    timesheetDocs.map((doc, index) => {
                      const invalidStaff = invalidStaffs.find(item => item.staffId === doc.staff_id);
                      const uniqueStaffName = getUniqueStaffName(doc.staff_name, index);
                      const sumHours = doc.job_code === config.TIMESHEET.CLOCK ? calculateSumHoursByStaffId(doc.staff_id, timesheetDocs) : "";
                      return(
                          doc.isVisible ?
                              <tr key={index} className={"check-timesheet-data-table-content-row " + (invalidStaff ? "invalid-timesheet " : "") + (timesheetIsPosted ? "grey-out-row" : "hover-effect")} >
                                {/*<td><span>{doc.id}</span></td>*/}
                                {/*<td><span><a href="#" className="table-staff" onClick={e => handleStaffOnClick(e, doc)}>{doc.staff_name}</a></span></td>*/}
                                <Tooltip title={invalidStaff && invalidStaff.error && invalidStaff.error.message} placement="top">
                                  <td><span><a href="#" className="table-staff" onClick={e => handleStaffOnClick(e, doc)}>
                                    {
                                      uniqueStaffName
                                    }
                                    {
                                      uniqueStaffName && invalidStaff &&
                                      <ExclamationCircleOutlined className="invalid-icon" type="exclamation-circle" />
                                    }
                                  </a></span></td>
                                </Tooltip>
                                <td><span>{doc.job_code}</span></td>
                                <td><span>{doc.source ? "" : doc.origin_start_time.format("HH:mm")}</span></td>
                                <td><span>{doc.source ? "" : doc.origin_end_time.format("HH:mm")}</span></td>
                                <td>
                                  <span>
                                    <TimePicker
                                        className="check-timesheet-data-time-picker"
                                        value={doc.approve_start_time}
                                        format={timeFormat}
                                        minuteStep={10}
                                        allowClear={false}
                                        onChange={async (time) => await dispatch(updateStartTime({index, time}))}
                                        disabled={timesheetIsPosted}
                                    />
                                  </span>
                                </td>
                                <td>
                                  <span>
                                    <TimePicker
                                        className="check-timesheet-data-time-picker"
                                        value={doc.approve_end_time}
                                        format={timeFormat}
                                        allowClear={false}
                                        minuteStep={10}
                                        onChange={async (time) => await dispatch(updateEndTime({index, time}))}
                                        disabled={timesheetIsPosted}
                                    />
                                  </span>
                                </td>
                                <td><span>{getRounding2(doc.origin_hours)}</span></td>
                                <td><span>{getRounding2(doc.approve_hours)}</span></td>
                                <td><span>{sumHours}</span></td>
                                <td>
                                  {
                                    !timesheetIsPosted && doc.source === 1 &&
                                    <a onClick={e => handleDeleteClick(e, doc)} className="delete-icon"><DeleteOutlined type="delete" /></a>
                                  }
                                </td>
                              </tr>
                             : null
                      );
                    })
                  }
                  </tbody>
                </table>
                {
                  !hasInVisibleLine && !timesheetIsPosted && timesheetDocs.length > 0 &&
                    <>
                      <Button onClick={handlePostBtnClick} disabled={invalidStaffs.length > 0} className={(invalidStaffs.length > 0 ? "third-button" : "primary-button") + " check-timesheet-post-btn"}>Post</Button>
                    </>
                }
                {
                  !timesheetIsPosted && hasLoadedData &&
                  <Button className="secondary-button check-timesheet-leave-btn" onClick={handleLeaveBtnClick}>Add</Button>
                }
              </>
          }
        </div>
        {
          showAddLeaveModal && <LeaveModal summaryDate={selectedDate} />
        }
      </div>
  );
};

export default Form.create()(CheckTimesheet);
