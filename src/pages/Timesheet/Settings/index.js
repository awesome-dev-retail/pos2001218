import React, {useEffect, useState} from "react";
import {Button, Col, Input, InputNumber, Modal, Row, Select} from "antd";
import "./index.scss";
import {message} from "../../../lib";
import _ from "lodash";
import { Form } from "@ant-design/compatible";
import { useSelector, useDispatch, useStore } from "react-redux";
import { savePaidType, selectPaidTypeList, fetchPaidTypeList } from "../../../slices/timesheetSlice";
import { selectShop, selectShops } from "../../../slices/authSlice";
import { fetchShopList } from "../../../slices/authSlice";

const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18}
};

const { Option } = Select;


const Settings = (props) => {
  const paidTypeList = useSelector(state =>  selectPaidTypeList(state));
  const shopList = useSelector(state => selectShops(state));
  const shop = useSelector((state) => selectShop(state));
  const dispatch = useDispatch();

  const [editingPaidType, setEditingPaidType] = useState(false);
  // eslint-disable-next-line react/prop-types
  const { getFieldDecorator, setFieldsValue } = props.form;

  useEffect(() => {
    dispatch(fetchShopList());
    dispatch(fetchPaidTypeList());
  }, []);



  const handleAddPaidTypeClick = () => {
    setEditingPaidType(true);
    setFieldsValue({id:"", paid_code:"", description:"", multiple_confident:1, store_code:shop.shop_name});
  };

  const handleEditPaidTypeClick = record => {
    setEditingPaidType(true);
    const { id, paid_code, description, multiple_confident, store_code }  = record;
    setFieldsValue({id, paid_code, description, multiple_confident, store_code});
  };

  const handleEditingPaidTypeSubmit = e => {
    e.preventDefault();
    // eslint-disable-next-line react/prop-types
    props.form.validateFields(async (err, paidTypeObj) => {
      if (!err) {
        await dispatch(savePaidType({obj: paidTypeObj}));
        setEditingPaidType(false);
        setFieldsValue({id:"", paid_code:"", description:"", multiple_confident:"", store_code:""});
      }
    });
  };

  // const handleDevButtonClick = () => {
  //   console.log(_.cloneDeep(paidTypeList));
  // };

  return (
      <div className="timesheet-settings-page-container">
        <h3>
          Paid Type
          <Button className="third-button pull-right" onClick={handleAddPaidTypeClick}>New +</Button>
        </h3>
        <div className="settings-paid-type-list">
        {
            paidTypeList && paidTypeList.length > 0 &&
                <div className="paid-type-list">
                  {
                    paidTypeList.map((item, index) => {
                      return (
                          <a className="paid-type-item" key={index} onClick={() => {handleEditPaidTypeClick(item);}}>
                            <span>{item.paid_code} - {item.multiple_confident}</span>
                          </a>
                      );
                    })
                  }
                </div>
        }
        </div>
        {/*<button onClick={handleDevButtonClick}>Dev</button>*/}
        <Modal
            title="Paid Type"
            visible={editingPaidType}
            onCancel={() => setEditingPaidType(false)}
            footer={null}
            width={400}
            className="bizex-timesheet-paid-type-modal"
        >
          <Form {...layout} layout="inline" onSubmit={e => handleEditingPaidTypeSubmit(e)}>
            <Form.Item label="ID" className="timesheet-paid-type-editing-form-item" style={{display: "none"}}>
              {getFieldDecorator("id")(
                  <Input disabled={true} autoComplete="off"/>
              )}
            </Form.Item>
            <Form.Item label="Name" className="timesheet-paid-type-editing-form-item">
              {getFieldDecorator("paid_code",{rules:[{ required: true, message:"Name is required!"}]})(
                  <Input placeholder="Type name" autoComplete="off" onFocus={(e) => e.target.select()}/>
              )}
            </Form.Item>
            <Form.Item label="Description" className="timesheet-paid-type-editing-form-item">
              {getFieldDecorator("description")(
                  <Input placeholder="Description" autoComplete="off" onFocus={(e) => e.target.select()}/>
              )}
            </Form.Item>
            <Form.Item label="Shop" className="timesheet-paid-type-editing-form-item">
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
            <Form.Item label="Pay Rate" className="timesheet-paid-type-editing-form-item">
              {getFieldDecorator("multiple_confident", {rules:[{ required: true, message:"Rate is required!"}]})(
                  <InputNumber step={0.5} min={0} placeholder="Eg: 0.5" autoComplete="off" onFocus={(e) => e.target.select()}/>
              )}
            </Form.Item>

            <Row className="staff-details-btn-group-container">
              <Col span={12}>
                <Button
                    onClick={() => setEditingPaidType(false)}
                    className="secondary-button">
                  Cancel
                </Button>
              </Col>
              <Col span={12}>
                <Button onClick={handleEditingPaidTypeSubmit}
                        htmlType="submit"
                        className="primary-button ">
                  Confirm
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>

      </div>
  );
};

export default Form.create()(Settings);