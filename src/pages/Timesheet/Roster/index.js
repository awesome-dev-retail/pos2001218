import React, { useState, useEffect } from "react";
import "./index.scss";
import { Row, Col, Button, Modal, Input, Select, Empty, TimePicker, Popconfirm } from "antd";
import moment from "moment";
import "react-day-picker/lib/style.css";
import { dateToMoment, getTimeDiffInHour, onlyTimeToMoment, message } from "../../../lib";

import _ from "lodash";
import config from "../../../configs/index";
import WeekPicker from "../WeekPicker";
import { Form } from "@ant-design/compatible";
import { useDispatch, useSelector } from "react-redux";
import { selectShop, selectShops, fetchShopList } from "../../../slices/authSlice";
import {
  fetchRosterList,
  fetchTimesheetStaffs,
  selectTimesheetStaffs,
  fetchPaidTypeList,
  selectPaidTypeList,
  saveRoster, selectRosterList,
  delRoster,
  simpleDuplicateRoster,
  generalDuplicateRoster,
} from "../../../slices/timesheetSlice";
import { CopyOutlined, PlusCircleOutlined, QuestionCircleOutlined, CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";

const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18}
};

const { Option } = Select;

const getLastMomentOfWeek = weeks => {
  return weeks.length > 0 ? dateToMoment(_.cloneDeep(weeks).pop()).set({hour:23, minute:59, second:59}) : moment().set({hour:23, minute:59, second:59});
};

const Roster = (props) => {
  const rosterList = useSelector(state => selectRosterList(state));
  const timesheetStaffs = useSelector(state => selectTimesheetStaffs(state));
  const shop = useSelector((state) => selectShop(state));
  const shopList = useSelector(state => selectShops(state));
  const paidTypeList = useSelector(state => selectPaidTypeList(state));
  const dispatch = useDispatch();

  const [showEditingRosterModal, setShowEditingRosterModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedDuplicateRosterDays, setSelectedDuplicateRosterDays] =  useState([]);
  const timeFormat = "HH:mm";
  const selectWeekLastMoment = getLastMomentOfWeek(selectedDays);
  const selectedWeekIsPasted = moment().isAfter(selectWeekLastMoment);
  const currentSelectedPeriodStr = `${moment(selectedDays[0]).format("LL")} – ${moment(selectedDays[selectedDays.length - 1]).format("LL")}`;
  // eslint-disable-next-line react/prop-types
  const { getFieldDecorator, setFieldsValue, getFieldsValue } = props.form;

  const fetchRoster = async (range) => {
    const from = dateToMoment(range.from).format("YYYY-MM-DD");
    const to = dateToMoment(range.to).format("YYYY-MM-DD");
    return await dispatch(fetchRosterList({from, to}));
  };

  useEffect(() => {
    const initRange = getWeekRange(moment());
    if (initRange) {
      fetchRoster(initRange);
    }
    dispatch(fetchShopList());
    dispatch(fetchTimesheetStaffs({shop: null}));
    dispatch(fetchPaidTypeList());
  }, []);

  const getWeekRange = date => {
    return {
      from: moment(date)
          .startOf("week")
          .toDate(),
      to: moment(date)
          .endOf("week")
          .toDate(),
    };
  };

  // const handleDevBtnClick = () => {
  //   console.log(selectedDays);
  //   console.log(_.cloneDeep(timesheetStaffs));
  //   console.log(_.cloneDeep(paidTypeList));
  //   console.log(_.cloneDeep(rosterList));
  // };

  const reFetchRosterList = async () => {
    if (selectedDays.length > 1) {
      const days = _.cloneDeep(selectedDays);
      const fromStr = days.shift();
      const toStr = days.pop();
      const from = dateToMoment(fromStr).format("YYYY-MM-DD");
      const to = dateToMoment(toStr).format("YYYY-MM-DD");
      await dispatch(fetchRosterList({from, to}));
    }
  };

  const handleAddIconClick = (currentDate) => {
    setShowEditingRosterModal(true);
    const startTime = moment(config.ROSTER.DEFAULT_START_TIME);
    const endTime = moment(config.ROSTER.DEFAULT_END_TIME);
    setFieldsValue({
      id: "",
      staff_id: "",
      schedule_date: dateToMoment(currentDate),
      work_hours: getTimeDiffInHour(startTime, endTime),
      staff_name: "",
      store_code: shop.shop_name,
      job_code: config.TIMESHEET.CLOCK,
      start_time: startTime,
      end_time: endTime,
      paid_type_id: "",
    });
  };

  const handleStaffChange = staff_id => {
    const staff = timesheetStaffs.find(staff => staff.id === staff_id);
    if (staff) {
      setFieldsValue({staff_name: staff.uname,});
    }
  };

  const handleStartTimeChange = startTime => {
    const { end_time } = getFieldsValue(["end_time"]);
    const workHours = getTimeDiffInHour(startTime, end_time);
    setFieldsValue({work_hours: workHours});
  };

  const handleEndTimeChange = endTime => {
    const { start_time } = getFieldsValue(["start_time"]);
    const workHours = getTimeDiffInHour(start_time, endTime);
    setFieldsValue({work_hours: workHours});
  };

  const handleRosterClick = data => {
    if (selectedWeekIsPasted) return;
    const roster = {
      ...data,
      start_time: onlyTimeToMoment(data.start_time),
      end_time: onlyTimeToMoment(data.end_time),
      schedule_date: dateToMoment(data.schedule_date)
    };
    setFieldsValue(roster);
    setShowEditingRosterModal(true);
  };

  const handleRosterDeleteClick = async (e, roster) => {
    e.stopPropagation();
    await dispatch(delRoster({id: roster.id}));
    await reFetchRosterList();
  };

  const handleEditingRosterSubmit = e => {
    e.preventDefault();
    // eslint-disable-next-line react/prop-types
    props.form.validateFields(async (err, form) => {
      if (!err) {
        await dispatch(saveRoster({roster: form}));
        setShowEditingRosterModal(false);
        await reFetchRosterList();
      }
    });
  };

  const handleSimpleDuplicate = async () => {
    await dispatch(simpleDuplicateRoster({isOverWriting: false, reFetchRosterHandler: reFetchRosterList}));
  };

  const handleDuplicateClick = () => {
    setShowDuplicateModal(true);
  };

  const handleDuplicateConfirmed = async () => {
    const selectedDuplicateRosterDaysLastMoment = getLastMomentOfWeek(selectedDuplicateRosterDays);
    const data = {
      store_code: shop.shop_name,
      from_start_date: _.cloneDeep(selectedDuplicateRosterDaysLastMoment).subtract(6, "days").format("YYYY-MM-DD"),
      from_end_date: _.cloneDeep(selectedDuplicateRosterDaysLastMoment).format("YYYY-MM-DD"),
      to_start_date: _.cloneDeep(selectWeekLastMoment).subtract(6, "days").format("YYYY-MM-DD"),
      to_end_date: _.cloneDeep(selectWeekLastMoment).format("YYYY-MM-DD"),
      is_overwrite: 0
    };
    setShowDuplicateModal(false);
    await dispatch(generalDuplicateRoster({data, reFetchRosterHandler: reFetchRosterList}));
  };

  const today = moment();
  const currentWeekPeriod = getWeekRange(today);
  const nextWeekPeriod = getWeekRange(today.add(7, "days"));
  const currentWeekPeriodStr = `${moment(currentWeekPeriod.from).format("LL")} – ${moment(currentWeekPeriod.to).format("LL")}`;
  const nextWeekPeriodStr = `${moment(nextWeekPeriod.from).format("LL")} – ${moment(nextWeekPeriod.to).format("LL")}`;

  return (
      <div className="timesheet-roster-page-container">
        {/*<div className="head-row">*/}
        {/*  <button onClick={handleDevBtnClick}>Dev</button>*/}
        {/*</div>*/}
        <Row>
          <Col xxl={8} xl={8} lg={24} md={24} sm={24} xs={24}>
            <div className="roast-left-component primary-boarder">

              <WeekPicker
                  selectedDays={selectedDays}
                  setSelectedDays={setSelectedDays}
                  onWeekSelectedHandler={fetchRoster}
              />

              <Popconfirm
                  title={`Duplicate this week ( ${currentWeekPeriodStr} ) to next week ( ${nextWeekPeriodStr} ) ?`}
                  icon={<CopyOutlined type="copy" style={{ color: "#4a6282" }} />}
                  onConfirm={handleSimpleDuplicate}
                  okText="Yes"
                  cancelText="No"
                  placement="bottom"
              >
                <Button className="secondary-button duplicate-btn"><CopyOutlined type="copy" />Duplicate</Button>
              </Popconfirm>
            </div>
          </Col>
          <Col xxl={16} xl={16} lg={24} md={24} sm={24} xs={24}>
            <div className="roast-right-component primary-boarder">
              {selectedDays.length === 7 && (
                  <>
                    <h3 className="calendar-footer-sum">
                      {currentSelectedPeriodStr}
                      {
                        !selectedWeekIsPasted &&
                        <a className="duplicate-icon pull-right">
                          <CopyOutlined type="copy" onClick={handleDuplicateClick}/>
                        </a>
                      }
                    </h3>
                    <div className="selected-week-container">
                      <ul>
                        {
                          selectedDays.map((item, index) => {
                            const currentRosters = rosterList.filter(roster =>  roster.schedule_date === dateToMoment(item).format("YYYY-MM-DD"));
                            const isToday = dateToMoment(item).isSame(moment(),"d");
                            return (
                                <li key={index}>
                                  <h3 className={"each-day-header" + (isToday ? " today-header" : "")}>
                                    {dateToMoment(item).format("dddd MMMM Do")}

                                    {
                                      !selectedWeekIsPasted &&
                                      <PlusCircleOutlined onClick={() => handleAddIconClick(item)} type="plus-circle" className="new-btn pull-right"/>
                                    }
                                  </h3>
                                  <div className="day-based-record-container">
                                    {
                                      currentRosters.length > 0 &&
                                          currentRosters.map((roster) => {
                                            const currentPaidType = paidTypeList.find(type => type.id === roster.paid_type_id);
                                            return (
                                                <a className="each-roster-container" key={roster.id} onClick={() => handleRosterClick(roster)}>
                                                  {
                                                    !selectedWeekIsPasted &&
                                                    <Popconfirm
                                                        title="Are you sure to delete this roster?"
                                                        icon={<QuestionCircleOutlined type="question-circle-o" style={{ color: "red" }} />}
                                                        onConfirm={(e) => handleRosterDeleteClick(e, roster)}
                                                        onCancel={e => e.stopPropagation()}
                                                        okText="Yes"
                                                        cancelText="No"
                                                    >
                                                      <CloseCircleOutlined className="del-icon" type="close-circle" onClick={e => e.stopPropagation()} />
                                                    </Popconfirm>
                                                  }
                                                  <p>
                                                    <span>{roster.staff_name}</span>
                                                    <span>{roster.store_code}</span>
                                                  </p>
                                                  <p>
                                                    <span>{onlyTimeToMoment(roster.start_time).format(timeFormat)} - {onlyTimeToMoment(roster.end_time).format(timeFormat)}</span>
                                                    <span>{roster.work_hours} Hours</span>
                                                  </p>
                                                  {/*<p>*/}
                                                  {/*  <span>{roster.job_code}</span>*/}
                                                  {/*  <span>{roster.work_hours} Hours</span>*/}
                                                  {/*</p>*/}
                                                  {
                                                    currentPaidType &&
                                                    <p>
                                                      <span>Pay rate:</span>
                                                      <span>{currentPaidType.paid_code} <CloseOutlined type="close" />{currentPaidType.multiple_confident}</span>
                                                    </p>
                                                  }

                                                </a>
                                                );
                                          })
                                    }
                                    {
                                      currentRosters.length === 0 &&
                                          <Empty />
                                    }
                                  </div>
                                </li>
                            );
                          })
                        }
                      </ul>
                    </div>
                  </>
              )}
            </div>
          </Col>
        </Row>
        <Modal
            className="roster-form-modal-container"
            title="Roster"
            visible={showEditingRosterModal}
            onCancel={() => setShowEditingRosterModal(false)}
            footer={null}
            width={400}
        >
          <Form {...layout} layout="inline" onSubmit={e => handleEditingRosterSubmit(e)}>
            <Form.Item label="ID" className="timesheet-roster-editing-form-item" style={{display: "none"}}>
              {getFieldDecorator("id")(
                  <Input disabled={true} autoComplete="off"/>
              )}
            </Form.Item>
            <Form.Item label="Staff ID" className="timesheet-roster-editing-form-item" style={{display: "none"}}>
              {getFieldDecorator("staff_name")(
                  <Input disabled={true} autoComplete="off"/>
              )}
            </Form.Item>
            <Form.Item label="Schedule Date" className="timesheet-roster-editing-form-item" style={{display: "none"}}>
              {getFieldDecorator("schedule_date")(
                  <Input disabled={true} autoComplete="off"/>
              )}
            </Form.Item>
            <Form.Item label="Work Hours" className="timesheet-roster-editing-form-item" style={{display: "none"}}>
              {getFieldDecorator("work_hours")(
                  <Input disabled={true} autoComplete="off"/>
              )}
            </Form.Item>
            <Form.Item label="Job Code" className="timesheet-roster-editing-form-item" style={{display: "none"}}>
              {getFieldDecorator("job_code")(
                  <Input disabled={true} autoComplete="off"/>
              )}
            </Form.Item>
            <Form.Item label="Staff" className="timesheet-roster-editing-form-item">
              {getFieldDecorator("staff_id", {
                rules: [{ required: true, message: "Please select a staff" }],
              })(
                  <Select onChange={staff => {handleStaffChange(staff);}}>
                    {
                      timesheetStaffs &&
                      timesheetStaffs.map((staff, index) => {
                        return(
                            <Option value={staff.id} key={index}>{staff.uname}</Option>
                        );
                      })
                    }
                  </Select>,
              )}
            </Form.Item>
            <Form.Item label="Shop" className="timesheet-roster-editing-form-item">
              {getFieldDecorator("store_code", {
                rules: [{ required: true, message: "Please select default shop" }],
              })(
                  <Select>
                    {
                      shopList &&
                      shopList.map((shop, index) => {
                        return(
                            <Option value={shop.shop_name} key={index}>{shop.shop_name}</Option>
                        );
                      })
                    }
                  </Select>,
              )}
            </Form.Item>
            {/*<Form.Item label="Job" className="timesheet-roster-editing-form-item">*/}
            {/*  {getFieldDecorator("job_code", {*/}
            {/*    rules: [{ required: true, message: "Please select a job" }],*/}
            {/*  })(*/}
            {/*      <Select>*/}
            {/*        <Option value={config.TIMESHEET.CLOCK}>{config.TIMESHEET.CLOCK}</Option>*/}
            {/*        <Option value={config.TIMESHEET.BREAK}>{config.TIMESHEET.BREAK}</Option>*/}
            {/*        <Option value={config.TIMESHEET.LEAVE}>{config.TIMESHEET.LEAVE}</Option>*/}
            {/*      </Select>,*/}
            {/*  )}*/}
            {/*</Form.Item>*/}
            <Form.Item label="Start" className="timesheet-roster-editing-form-item">
              {getFieldDecorator("start_time",{rules:[{ required: true, message:"Start time is required!"}]})(
                  <TimePicker
                      format={timeFormat}
                      minuteStep={10}
                      allowClear={false}
                      onChange={startTime => handleStartTimeChange(startTime)}
                  />
              )}
            </Form.Item>
            <Form.Item label="End" className="timesheet-roster-editing-form-item">
              {getFieldDecorator("end_time",{rules:[{ required: true, message:"End time is required!"}]})(
                  <TimePicker
                      format={timeFormat}
                      minuteStep={10}
                      allowClear={false}
                      onChange={endTime => handleEndTimeChange(endTime)}
                  />
              )}
            </Form.Item>
            <Form.Item label="Rate" className="timesheet-roster-editing-form-item">
              {getFieldDecorator("paid_type_id", {
                rules: [{ required: true, message: "Please select paid rate" }],
              })(
                  <Select>
                    {
                      paidTypeList &&
                      paidTypeList.map((type, index) => {
                        return(
                            <Option value={type.id} key={index}>{type.paid_code}</Option>
                        );
                      })
                    }
                  </Select>,
              )}
            </Form.Item>

            <Row className="staff-details-btn-group-container">
              <Col span={12}>
                <Button
                    onClick={() => setShowEditingRosterModal(false)}
                    className="secondary-button">
                  Cancel
                </Button>
              </Col>
              <Col span={12}>
                <Button onClick={handleEditingRosterSubmit}
                        htmlType="submit"
                        className="primary-button ">
                  Confirm
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>

        <Modal
            title="Duplicate Roster"
            visible={showDuplicateModal}
            onOk={handleDuplicateConfirmed}
            onCancel={() => setShowDuplicateModal(false)}
            width={400}
            style={{ top: 100 }}
            className="duplicate-roster-modal-container"
            destroyOnClose
        >
          <div className="duplicate-roster-modal-content">
            <WeekPicker
                selectedDays={selectedDuplicateRosterDays}
                setSelectedDays={setSelectedDuplicateRosterDays}
                initialSelected={selectWeekLastMoment}
            />
            <p>From: {`${moment(selectedDuplicateRosterDays[0]).format("LL")} - ${moment(selectedDuplicateRosterDays[selectedDuplicateRosterDays.length - 1]).format("LL")}`}</p>
            <p>{"==>"}</p>
            <p>To: {`${moment(selectedDays[0]).format("LL")} - ${moment(selectedDays[selectedDays.length - 1]).format("LL")}`}</p>
          </div>
        </Modal>

      </div>
  );
};

export default Form.create()(Roster);