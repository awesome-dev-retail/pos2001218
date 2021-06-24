import React from "react";
import Logo from "../../assets/images/Bizex_FinalLogo.png";
import logoAbbey from "../../assets/images/logo-Abbey.png";
import {useSelector, useStore} from "react-redux";
import {selectCurrentUser} from "../../slices/authSlice";
import "./index.scss";
import { Row, Col } from "antd";
import { history } from "../../components/MyRouter";

import { ClockCircleOutlined } from "@ant-design/icons";
import CONSTANT from "../../configs/CONSTANT";

const TopNavBar = props => {
  const currentUser = useSelector((state) => selectCurrentUser(state));
  const store = useStore();

  const handleClockClick = () => {
    history.push(CONSTANT.ROUTES.TIMESHEET);
  };

  const handleDevBtnClick = () => {
    console.log(store.getState());
  };

  const handleBizexLogoClick = () => {
    history.push(CONSTANT.ROUTES.HOME);
  };


  return (
      <header className="header">
        <Row className="top-bar-container">
          <Col xxl={8} xl={8} lg={12} md={0} sm={0} xs={0}>
            <div className="bizex-logo-container">
              <a onClick={handleBizexLogoClick}>
                <img className="bizex-logo-img"  src={Logo} alt="logo" />
                <span className="bizex-logo-txt">- BizCafe</span>
              </a>
            </div>
          </Col>
          <Col xxl={4} xl={4} lg={0} md={0} sm={0} xs={0}>
            <div className="client-logo-container">
              <img className="client-logo-img" src={logoAbbey} alt="logo" />
            </div>
          </Col>
          <Col xxl={6} xl={6} lg={6} md={12} sm={24} xs={24}>
            <div className="app-menu-container">
              <a className="app-menu-item" onClick={handleClockClick}><ClockCircleOutlined className="clock-icon" />Timesheet</a>
            </div>
          </Col>
          <Col xxl={6} xl={6} lg={6} md={12} sm={0} xs={0}>
            <div className="app-info">
              {/*<a className="app-menu-item" onClick={handleDevBtnClick}>Dev</a>*/}
              <span className="app-menu-item">{`Welcome ${currentUser.userinfo.uname}`}</span>
            </div>
          </Col>

        </Row>
      </header>
  );
};

export default TopNavBar;