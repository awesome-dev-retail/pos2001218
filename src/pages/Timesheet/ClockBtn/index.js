import React, { useState, useRef } from "react";
import { Button, Drawer, Input } from "antd";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import { message, sleep } from "../../../lib/index";
import config from "../../../configs/index";
import {
  clockIn,
  clockOut,
  breakOn,
  breakOff,
  unpaidBreakOff,
  unpaidBreakOn,
  getCurrentActivatedStaff,
  selectTimesheetStaffs,
} from "../../../slices/timesheetSlice";
import { ClockCircleOutlined } from "@ant-design/icons";
import { setPageLoading } from "../../../slices/publicComponentSlice";

import  { timesheetStaffLogin } from "../../../services/timesheetApi";

//According to the document, status code
// -1 means end completed
// 0 means starting
// 1 means ending

export default function ClockBtn(props) {
  const timesheetStaffs = useSelector(state => selectTimesheetStaffs(state));

  const dispatch = useDispatch();
  // eslint-disable-next-line react/prop-types
  const { timeclock } = props.staff;
  // eslint-disable-next-line react/prop-types
  const { clock_status, break_status, unpaidbreak_status } = timeclock;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [psd, setPsd] = useState("");
  const psdInputRef = useRef();
  const [currentAction, setCurrentAction] = useState({});

  const handleClockInBtnClick = async () => {
    return clock_status === -1 || clock_status === 1 ? await dispatch(clockIn()) : await dispatch(clockOut());
  };

  const handleBreakBtnClick = async () => {
    return !break_status ? await dispatch(breakOff()) : await dispatch(breakOn());
  };

  const handleLeaveBtnClick = async () => {
    return !unpaidbreak_status ? await dispatch(unpaidBreakOff()) : await dispatch(unpaidBreakOn());
  };

  const action = {
    clock: {
      name: config.TIMESHEET.CLOCK,
      warningMsg: <p>Are you going to <strong>{clock_status === 0 ? `${config.TIMESHEET.VIEW_NAME.CLOCK} OUT` : `${config.TIMESHEET.VIEW_NAME.CLOCK} IN`}</strong></p>,
      handler: handleClockInBtnClick,
    },
    break: {
      name: config.TIMESHEET.BREAK,
      warningMsg: <p>Are you going to <strong>{break_status === 0 ? `${config.TIMESHEET.VIEW_NAME.BREAK} OFF` :  `${config.TIMESHEET.VIEW_NAME.BREAK} ON`}</strong></p>,
      handler: handleBreakBtnClick,
    },
    leave: {
      name: config.TIMESHEET.LEAVE,
      warningMsg: <p>Are you going to <strong>{unpaidbreak_status === 0 ? `${config.TIMESHEET.VIEW_NAME.UNPAIDBREAK} OFF` :  `${config.TIMESHEET.VIEW_NAME.UNPAIDBREAK} ON`}</strong></p>,
      handler: handleLeaveBtnClick,
    }
  };

  const handleActionBtnClick = async (action) => {
    setCurrentAction(action);
    await sleep(100);
    setDrawerOpen(true);
    await sleep(300);
    psdInputRef.current && psdInputRef.current.focus();
  };

  const handleStaffPsdSubmit = async () => {
    try {
      dispatch(setPageLoading(true));
      const activatedStaff = getCurrentActivatedStaff(timesheetStaffs);
      const staff = {
        uname: activatedStaff.uname,
        typedPassword: psd
      };
      const apiStaffObj = {
        uname: staff.uname,
        passwd: staff.typedPassword
      };
      const res = await timesheetStaffLogin(apiStaffObj);
      if (res.erorr) throw res.error;
      if(res.code === 200) {
        // Login success
        await currentAction.handler();
        setCurrentAction({});
        setDrawerOpen(false);
      } else {
        // Login failed
        message.error(`Failed to login: ${res.msg}`);
      }
      setPsd("");
    } catch (e) {
      message.error(e.message);
    } finally {
      dispatch(setPageLoading(false));
    }
  };

  const clockBtnIsDisabled = () => {
    if (clock_status === 1) return true;
    return false;
  };

  const breakBtnIsDisabled = () => {
    if (clock_status === -1 || clock_status === 1) return true;
    if (unpaidbreak_status === 0) return true;
    return false;
  };

  const leaveBtnIsDisabled = () => {
    if (clock_status === -1 || clock_status === 1) return true;
    if (break_status === 0) return true;
    return false  ;
  };

  return (
      <div className="clock-btn-container">
        <div className="clock-drawer-container">
          <Button
              className={`pull-left block-btn ${clock_status === 0 ? "primary-button" : "third-button"}`}
              onClick={async () => {await handleActionBtnClick(action.clock);}}
              disabled={clockBtnIsDisabled()}
          >
            {
              <span className={`icon-container ${clock_status === 0 ? "spinning-clock" : ""}`}>
              <ClockCircleOutlined
                  spin={clock_status === 0}
              />
            </span>
            }
            {config.TIMESHEET.VIEW_NAME.CLOCK}
          </Button>

          <Button
              className={`clock-btn-group pull-left ${break_status === 0 ? "secondary-button" : "third-button"}`}
              onClick={async () => {await handleActionBtnClick(action.break);}}
              disabled={breakBtnIsDisabled()}
          >
          <span className="icon-container">
            <ClockCircleOutlined
                className={clock_status === 0 && break_status === 0 ? "spinning-clock" : ""}
                spin={clock_status === 0 && break_status === 0}
            />
          </span>
            {config.TIMESHEET.VIEW_NAME.BREAK}
          </Button>

          <Button
              className={`clock-btn-group pull-right ${unpaidbreak_status === 0 ? "secondary-button" : "third-button"}`}
              onClick={async () => {await handleActionBtnClick(action.leave);}}
              disabled={leaveBtnIsDisabled()}
          >
          <span className="icon-container">
            <ClockCircleOutlined
                className={clock_status === 0 && unpaidbreak_status === 0 ? "spinning-clock" : ""}
                spin={clock_status === 0 && unpaidbreak_status === 0} />
          </span>
            {config.TIMESHEET.VIEW_NAME.UNPAIDBREAK}
          </Button>

          <Drawer
              placement="right"
              closable={true}
              onClose={() => { setDrawerOpen(false);}}
              visible={drawerOpen}
              getContainer={false}
              height={75}
              width="100%"
              style={{ position: "absolute"}}
          >
            <div>
              {currentAction.warningMsg}
              <Input type="password"
                     className="primary-input"
                     name="bizex-pos-timesheet-staff-password"
                     value={psd}
                     ref={psdInputRef}
                     onChange={e => setPsd(e.target.value)}
                     placeholder="Password"
                     autoComplete="bizex-pos-timesheet-staff-password"
                     onPressEnter={() => handleStaffPsdSubmit()}
                     onFocus={(e) => e.target.select()}
              />
            </div>
          </Drawer>
        </div>
      </div>
  );
}