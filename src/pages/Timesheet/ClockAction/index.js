import React, { useEffect, useState } from "react";
import { useSelector, useDispatch, useStore } from "react-redux";
import "./index.scss";
import { Row, Col, Input, Button, Modal, Select, Radio } from "antd";
import { message, dateToMoment } from "../../../lib";
import ClockBtn from "../ClockBtn/index";
import { Form } from "@ant-design/compatible";
import { fetchShopList, selectShop, selectShops } from "../../../slices/authSlice";
import {
  fetchTimesheetStaffs,
  activatedStaff,
  saveTimesheetStaffToServer,
  selectTimesheetStaffs
} from "../../../slices/timesheetSlice";
import { EditOutlined } from "@ant-design/icons";
import { setPageLoading } from "../../../slices/publicComponentSlice";


const { Option } = Select;

const ClockAction = (props) => {
  const timesheetStaffs = useSelector(state => selectTimesheetStaffs(state));
  const shopList = useSelector(state => selectShops(state));
  const shop = useSelector((state) => selectShop(state));
  const dispatch = useDispatch();
  const [showStaffDetails, setShowStaffDetails] = useState(false);
  const [filterAllShop, setFilterAllShop] = useState(false);

  const today = dateToMoment(new Date()).format("DD/MM/YYYY");
  const layout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18}
  };
  // eslint-disable-next-line react/prop-types
  const { getFieldDecorator, setFieldsValue } = props.form;

  useEffect(() => {
    dispatch(fetchShopList());
    dispatch(fetchTimesheetStaffs({shop}));
  }, []);

  const handleStaffCardOnClick = (e, staff) => {
    e.preventDefault();
    dispatch(activatedStaff(staff.id));
  };

  const handleAddStaffSubmit = (e) => {
    e.preventDefault();
    // eslint-disable-next-line react/prop-types
    props.form.validateFields(async (err, staff) => {
      if (!err) {
        try {
          dispatch(setPageLoading(true));
          await dispatch(saveTimesheetStaffToServer({staff}));
          setShowStaffDetails(false);
          setFieldsValue({id:"", passwd:"", email:"", phone:"", uname:"", store_code:""});
          await dispatch(fetchTimesheetStaffs(filterAllShop ? {} : {shop}));
        } catch (e) {
          message.error(e.message);
        } finally {
          dispatch(setPageLoading(false));
        }
      }
    });
  };

  const handleEditStaffIconClick = staff => {
    const fields = {
      id: staff.id,
      passwd:staff.passwd,
      email:staff.email,
      phone:staff.phone,
      uname:staff.uname,
      store_code: staff.store_code
    };
    setShowStaffDetails(true);
    setFieldsValue(fields);
  };

  // const handleStaffCardFlipIconClick = staff => {
  //   inactiveStaff(staff.id)
  // }

  const handleAddStaffBtnClick = () => {
    setShowStaffDetails(true);
    setFieldsValue({id:"", passwd:"", email:"", phone:"", uname:"", store_code:shop.shop_name});
  };

  const handleShopFilterOnChange = async e => {
    const selectedShopFilter = e.target.value;
    if (selectedShopFilter === "current") {
      await dispatch(fetchTimesheetStaffs({shop}));//Fetch current shop
      setFilterAllShop(false);
    } else if (selectedShopFilter === "all") {
      await dispatch(fetchTimesheetStaffs({})); // Fetch all
      setFilterAllShop(true);
    } else {
      message.error("Unknown selected shop filter type");
    }
  };


  return(
      <div className="timesheet-action-page-container">
        <h2>
          Clock Action {today}
          <Radio.Group className="timesheet-shop-filter-toggle" defaultValue="current" buttonStyle="solid" onChange={handleShopFilterOnChange}>
            <Radio.Button value="current">
              {shop.shop_name}
            </Radio.Button>
            <Radio.Button value="all">
              All Shops
            </Radio.Button>
          </Radio.Group>
          <Button className="third-button pull-right" onClick={handleAddStaffBtnClick}>Add Staff</Button>
        </h2>
        <div className="timesheet-action-content-container">
          {
            timesheetStaffs && timesheetStaffs.map(staff => {
            return (
                <a key={staff.id} className={"staff-card-container "} onClick={e => handleStaffCardOnClick(e, staff)}>

                    <div className={staff.isActive ? "staff-card-back" : "staff-card-front"}>
                      {
                        staff.isActive ?
                            <>
                              <EditOutlined className="staff-card-edit-icon" onClick={() => handleEditStaffIconClick(staff)}/>
                              <p><span>Staff Name:</span><span>{staff.uname}</span></p>
                              <ClockBtn staff={staff}/>
                            </>
                            :
                            <>
                              <p><span>Staff Name:</span><span>{staff.uname}</span></p>
                              <p><span>Email:</span><span>{staff.email}</span></p>
                              <p><span>Phone:</span><span>{staff.phone}</span></p>
                              <p><span>Branch:</span><span>{staff.store_code}</span></p>

                            </>
                      }
                    </div>
                </a>
            );
          })}
        </div>

        <Modal
            title="Staff Details"
            visible={showStaffDetails}
            onCancel={() => setShowStaffDetails(false)}
            footer={null}
            width={400}
            className="bizex-timesheet-add-staff-modal"
        >
          <Form {...layout} layout="inline" onSubmit={e => handleAddStaffSubmit(e)}>
            <Form.Item label="ID" className="staff-details-form-item" style={{display: "none"}}>
              {getFieldDecorator("id")(
                  <Input disabled={true} autoComplete="off"/>
              )}
            </Form.Item>
            <Form.Item label="Name" className="staff-details-form-item">
              {getFieldDecorator("uname",{rules:[{ required: true, message:"Name is required!"}]})(
                  <Input placeholder="Staff Name" autoComplete="off" onFocus={(e) => e.target.select()}/>
              )}
            </Form.Item>
            <Form.Item label="Password" className="staff-details-form-item">
              {getFieldDecorator("passwd",{rules:[{ required: true, message:"Password is required!"}]})(
                  <Input type="password" placeholder="Password" autoComplete="off" onFocus={(e) => e.target.select()}/>
              )}
            </Form.Item>
            <Form.Item label="Email" className="staff-details-form-item">
              {getFieldDecorator("email",{rules:[{ type:"email", message:"Invalid Email!"}]})(
                  <Input placeholder="Email" autoComplete="off" onFocus={(e) => e.target.select()}/>
              )}
            </Form.Item>
            <Form.Item label="Phone" className="staff-details-form-item">
              {getFieldDecorator("phone")(
                  <Input placeholder="Phone" autoComplete="off" onFocus={(e) => e.target.select()}/>
              )}
            </Form.Item>
            <Form.Item label="Shop" className="staff-details-form-item">
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
            <Row className="staff-details-btn-group-container">
              <Col span={12}>
                <Button
                    onClick={() => setShowStaffDetails(false)}
                    className="secondary-button">
                  Cancel
                </Button>
              </Col>
              <Col span={12}>
                <Button onClick={handleAddStaffSubmit}
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

export default Form.create()(ClockAction);