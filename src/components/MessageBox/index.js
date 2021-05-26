import React from "react";
import "./index.scss";
import {  Button, Progress } from "antd";
// import Apostrophe from "../../components/Apostrophe";
import { selectMessageBox } from "../../slices/publicComponentSlice";
import { useSelector } from "react-redux";
import {selectDevice, selectShop} from "../../slices/authSlice";

const MessageBox = props => {
  const messageBox = useSelector(state => selectMessageBox(state));
  const shop  = useSelector(state => selectShop(state));
  const device = useSelector(state => selectDevice(state));
  // console.log(messageBox);
  return (
      <div className="component-wrapper">
        {
          messageBox.visible &&
          <div className={`modalWrapper ${messageBox.visible ? "active" : "hide"}`}>
            <div className="antModal">
              <div className="socket-pop-up-status">
                {
                  messageBox.title &&
                  <div className="ant-modal-header new-layout-title">
                    <div className="ant-modal-title">
                      {messageBox.title}
                    </div>
                  </div>
                }

                {
                  messageBox.contentList.length > 0 &&
                  <div className="ant-modal-body new-body-layout">
                    {
                      messageBox.contentList.map((item, index) => (
                          <div className="content-pos-websocket" key={index}>{item}</div>
                      ))
                    }
                    {
                      messageBox.processing &&
                      <div className="connecting">
                        <Progress
                            strokeColor={{
                              from: "#108ee9",
                              to: "#87d068",
                            }}
                            showInfo={false}
                            percent={100}
                            status="active"
                        />
                        <div className="connecting-hints">
                          {/*{messageBox.processing}<Apostrophe />*/}
                        </div>
                      </div>
                    }

                  </div>
                }
                {
                  messageBox.btnList.length > 0 &&
                  <div className="ant-modal-footer new-footer-layout">
                    {
                      messageBox.btnList.map((item, index) => (
                          <Button className={"cancel-socket-btn " + ((index === messageBox.btnList.length - 1) ? "primary-button" : "secondary-button")}
                                  key={item.btn_key}
                                  onClick={(key,val) => item.btn_callback(item.btn_key, item.btn_value, parseInt(shop.id), device.device_id)}>
                            {item.btn_value}
                          </Button>
                      ))
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>
  );
};


export default MessageBox;
