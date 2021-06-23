import React, {useState, useEffect} from "react";
import {Row} from "antd";
import {Route} from "react-router-dom";
import { history } from "../../components/MyRouter";
import "./index.scss";
import ClockAction from "./ClockAction";
import CheckTimesheet from "./CheckTimesheet";
import Dashboard from "./Dashboard";
import Roster from "./Roster/index";
import Settings from "./Settings/index";


export default function Timesheet(props) {
  const [currentIndex , setCurrentIndex]=useState("");
  // eslint-disable-next-line react/prop-types
  const { pathname } = props.location;

  const menuItem = [
    {title: "Clock In/Out", key: "clock-action"},
    {title: "Timesheet", key: "check"},
    {title: "Dashboard", key: "dashboard"},
    {title: "Roster", key: "roster"},
    {title: "Settings", key: "settings"}
    // {title: "Clock Dev", key: "clock-action-back-up"},
  ];

  useEffect(() => {
    // const { pathname } = props.location
    if (pathname === "/timesheet/clock-action" || pathname === "/timesheet") {
      setCurrentIndex("clock-action");
    } else if (pathname === "/timesheet/check") {
      setCurrentIndex("check");
    } else if (pathname === "/timesheet/dashboard") {
      setCurrentIndex("dashboard");
    } else if (pathname === "/timesheet/roster") {
      setCurrentIndex("roster");
    } else if (pathname === "/timesheet/settings") {
      setCurrentIndex("settings");
    // } else if (pathname === "/timesheet/clock-action-back-up") {
    //   setCurrentIndex("clock-action-back-up")
    }
    // console.log(props.location)
  }, []);

  const handleMenuClicked=(key)=>{
    if (key === "clock-action") {
      history.push("/timesheet/clock-action");
    } else if (key === "check") {
      history.push("/timesheet/check");
    } else if (key === "dashboard") {
      history.push("/timesheet/dashboard");
    } else if (key === "roster") {
      history.push("/timesheet/roster");
    } else if (key === "settings") {
      history.push("/timesheet/settings");
    // } else if (key === "clock-action-back-up") {
    //   history.push("/timesheet/clock-action-back-up")
    } else{
      console.log("Invalid key:", key);
    }
    setCurrentIndex(key);
  };

  return (
      <div className="clock-page-container">
        <div className="clock-menu-container">
          {
            menuItem.map(item => {
              return (
                  <span key={item.key} className={currentIndex === item.key ? "clock-menu-item-selected" : "clock-menu-item"} onClick={() => handleMenuClicked(item.key)}>
                    {item.title}
                  </span>
              );
            })
          }
        </div>
        <div className={pathname === "/timesheet/roster" ? "" : "clock-sub-content-container primary-boarder"}>
          <Route exact path={"/timesheet/"} component={ClockAction} />
          <Route path={"/timesheet/clock-action"} component={ClockAction} />
          <Route path={"/timesheet/check"} component={CheckTimesheet} />
          <Route path={"/timesheet/dashboard"} component={Dashboard} />
          {/*<Route path={"/timesheet/clock-action-back-up"} component={ClockActionBackUp} />*/}
          <Route path={"/timesheet/roster"} component={Roster} />
          <Route path={"/timesheet/settings"} component={Settings} />
        </div>
      </div>
  );
}