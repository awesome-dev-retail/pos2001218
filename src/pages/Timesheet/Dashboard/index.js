import React, { useState, useEffect } from "react";
import "./index.scss";
import { dateToMoment, message } from "../../../lib";
import { Radio, Tooltip } from "antd";
import config from "../../../configs/index";

import { useSelector, useDispatch, useStore } from "react-redux";
import { selectShop } from "../../../slices/authSlice";
import { selectDashboardData, fetchDashboardData, clearDashboardData } from "../../../slices/timesheetSlice";
import { ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";


const Dashboard = (props) => {
  const dashboardData = useSelector(state => selectDashboardData(state));
  const dispatch = useDispatch();
  const shop = useSelector((state) => selectShop(state));

  const today = dateToMoment(new Date());
  const [filterAllShop, setFilterAllShop] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboardData({filterAllShop}));
  },[]);

  const handleShopFilterOnChange = async e => {
    const selectedShopFilter = e.target.value;
    dispatch(clearDashboardData());
    if (selectedShopFilter === "current") {
      setFilterAllShop(false);
      await dispatch(fetchDashboardData({filterAllShop: false}));
    } else if (selectedShopFilter === "all") {
      setFilterAllShop(true);
      await dispatch(fetchDashboardData({filterAllShop: true}));
    } else {
      message.error("Unknown selected shop filter type");
    }
  };

  return (
      <div className="timesheet-dashboard-container">
        <h2>Dashboard {today.format("DD/MM/YYYY HH:mm")}
          <Radio.Group className="dashboard-shop-filter-toggle" defaultValue="current" buttonStyle="solid" onChange={handleShopFilterOnChange}>
            <Radio.Button value="current">
              {shop.shop_name}
            </Radio.Button>
            <Radio.Button value="all">
              All Shops
            </Radio.Button>
          </Radio.Group>
        </h2>

        <div className="timesheet-dashboard-card-container">
          {
            dashboardData.map((staff, index) => {
              return (
                  <div className="dashboard-card" key={index}>
                    <h3 className="dashboard-staff-name">{staff.staff_name}</h3>
                    <p>
                      <span className="card-subtitle">Status:</span>
                      {
                        staff.jobs.map((job, jobIndex) => {
                          return(
                              <span key={jobIndex} className={"clock-icon-container card-sub-value " + (job.job_code === config.TIMESHEET.CLOCK ? "pink-clock " : job.job_code === config.TIMESHEET.BREAK ? "blue-clock " : "green-clock ")}>
                                <ClockCircleOutlined type="clock-circle"
                                      className={(job.job_status === 0 ? "spinning-clock" : "") + " clock-icon"} />
                              </span>
                          );
                        })
                      }
                      {
                        staff.jobs.length === 0 &&
                        <span className={"clock-icon card-sub-value grey-out"}>
                                <CloseCircleOutlined  type="close-circle" />
                        </span>
                      }
                    </p>
                    <p>
                      <span className="card-subtitle">Clock:</span>
                      <span className="card-sub-value">{staff.clock_hours}</span>
                    </p>
                    <p>
                      <span className="card-subtitle">Break:</span>
                      <span className="card-sub-value">{staff.break_hours}</span>
                    </p>
                    <p>
                      <span className="card-subtitle">Working Hours:</span>
                      <span className="card-sub-value">{staff.work_hours}</span>
                    </p>

                  </div>
              );
            })
          }
        </div>
        <div className="tips-container">
          <h3>
            <em>
              {config.TIMESHEET.VIEW_NAME.CLOCK} :
              <div className="pink-block block"></div>
              {config.TIMESHEET.VIEW_NAME.BREAK} :
              <div className="blue-block block"></div>
              {config.TIMESHEET.VIEW_NAME.UNPAIDBREAK} :
              <div className="green-block block"></div>
              <span className="spinning-tips">
                Spinning : Action is started
              </span>
              <span className="spinning-tips">
                Stable : Action is completed
              </span>
            </em>
          </h3>
        </div>
      </div>
  );
};

export default Dashboard;