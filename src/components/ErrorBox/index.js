import React from "react";
import "./index.scss";
import {  Alert, Button, Progress, message} from "antd";
import { useSelector, useDispatch } from "react-redux";
import {selectErrorBox, resetErrorBox} from "../../slices/publicComponentSlice";


const ErrorBox = props => {
   const errorBox = useSelector(state => selectErrorBox(state));
   const dispatch = useDispatch();
   const handleClose = () => {
      dispatch(resetErrorBox());
   };

   return (
        <div className="component-wrapper">
          {
            errorBox.visible &&
            <div className={`modalWrapper ${errorBox.visible ? "active" : "hide"}`}>
              <div className="antModal">
                <div className="socket-pop-up-status">
                  <div className="ant-alert ant-alert-error">
                    <Alert
                        message={errorBox.title}
                        description={errorBox.content}
                        type="Error"
                        // showIcon={true}
                        // closable={errorBox.closable!=undefined?errorBox.closable:true}
                        // closeText={errorBox.closeText}
                        closable={true}
                        // banner
                        onClose={handleClose}
                    />
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
    );
};

export default ErrorBox;
