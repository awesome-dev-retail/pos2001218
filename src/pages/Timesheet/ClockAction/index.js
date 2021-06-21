import React, { useEffect, useState } from "react";
// import { observer } from "mobx-react";
// import { useStores } from "../../../hooks/use-stores";
import "./index.scss";
import {Row, Col, Icon, Input, Button, Modal, Select, Radio} from "antd";
import { message, dateToMoment } from "../../../lib";
import _ from "lodash";
// import ClockBtn from "../../Purchase/components/ClockBtn";
import { Form } from "@ant-design/compatible";

const { Option } = Select;

const ClockAction = (props) => {
  // const { timesheetStore, publicComponentStore, authStore } = useStores();
  // const { fetchTimesheetStaffs, timesheetStaffs, activatedStaff, staffTypedPasswordOnchange, inactiveStaff, saveTimesheetStaffToServer, staffLogin, updated_at } = timesheetStore;
  // const { setPageLoading } = publicComponentStore;
  // const { shop, fetchShopList, shopList } = authStore;
  // const [showStaffDetails, setShowStaffDetails] = useState(false);
  // const [filterAllShop, setFilterAllShop] = useState(false);
  //
  const today = dateToMoment(new Date()).format("DD/MM/YYYY");
  // const layout = {
  //   labelCol: {span: 6},
  //   wrapperCol: {span: 18}
  // };
  // const { getFieldDecorator, setFieldsValue } = props.form;
  //
  // useEffect(() => {
  //   fetchShopList();
  //   fetchTimesheetStaffs(shop);
  // }, []);
  //
  // const handleStaffPsdSubmit = async (staff) => {
  //   try {
  //     setPageLoading(true);
  //     await staffLogin(staff);
  //     staff.typedPassword = "";
  //   } catch (e) {
  //     message.error(e.message);
  //   } finally {
  //     setPageLoading(false);
  //   }
  // };
  //
  // const handleStaffCardOnClick = (e, staff) => {
  //   e.preventDefault();
  //   activatedStaff(staff.id);
  // };
  //
  // const handleStaffPasswordChange = (value, staffId) => {
  //   staffTypedPasswordOnchange(value, staffId)
  // };
  //
  // const handleAddStaffSubmit = (e) => {
  //   e.preventDefault();
  //   props.form.validateFields(async (err, staff) => {
  //     if (!err) {
  //       try {
  //         // console.log(staff)
  //         setPageLoading(true);
  //         await saveTimesheetStaffToServer(staff);
  //         setShowStaffDetails(false);
  //         setFieldsValue({id:"", passwd:"", email:"", phone:"", uname:"", store_code:""});
  //         await fetchTimesheetStaffs(filterAllShop ? null : shop);
  //       } catch (e) {
  //         message.error(e.message);
  //       } finally {
  //         setPageLoading(false);
  //       }
  //     }
  //   });
  // };
  //
  // const handleEditStaffIconClick = staff => {
  //   const fields = {
  //     id: staff.id,
  //     passwd:staff.passwd,
  //     email:staff.email,
  //     phone:staff.phone,
  //     uname:staff.uname,
  //     store_code: staff.store_code
  //   };
  //   setShowStaffDetails(true);
  //   setFieldsValue(fields);
  //   // console.log(_.cloneDeep(staff))
  // };
  //
  // // const handleStaffCardFlipIconClick = staff => {
  // //   inactiveStaff(staff.id)
  // // }
  //
  // const handleAddStaffBtnClick = () => {
  //   setShowStaffDetails(true);
  //   setFieldsValue({id:"", passwd:"", email:"", phone:"", uname:"", store_code:shop.shop_name});
  // };
  //
  // const handleShopFilterOnChange = async e => {
  //   const selectedShopFilter = e.target.value;
  //   if (selectedShopFilter === "current") {
  //     await fetchTimesheetStaffs(shop);//Fetch current shop
  //     setFilterAllShop(false);
  //   } else if (selectedShopFilter === "all") {
  //     await fetchTimesheetStaffs(); // Fetch all
  //     setFilterAllShop(true);
  //   } else {
  //     message.error("Unknown selected shop filter type");
  //   }
  // };
  //
  // console.log(_.cloneDeep(timesheetStaffs));

  return(
      <div className="timesheet-action-page-container">
        <h2>
          Clock Action {today}
          {/*<Radio.Group className="timesheet-shop-filter-toggle" defaultValue="current" buttonStyle="solid" onChange={handleShopFilterOnChange}>*/}
          {/*  <Radio.Button value="current">*/}
          {/*    {shop.shop_name}*/}
          {/*  </Radio.Button>*/}
          {/*  <Radio.Button value="all">*/}
          {/*    All Shops*/}
          {/*  </Radio.Button>*/}
          {/*</Radio.Group>*/}
          {/*<Button className="third-button pull-right" onClick={handleAddStaffBtnClick}>Add Staff</Button>*/}
        </h2>
        {/*<div className="timesheet-action-content-container">*/}
        {/*  {*/}
        {/*    timesheetStaffs && timesheetStaffs.map(staff => {*/}
        {/*    return (*/}
        {/*        <a key={staff.id} className={"staff-card-container "} onClick={e => handleStaffCardOnClick(e, staff)}>*/}

        {/*            <div className={staff.isActive ? "staff-card-back" : "staff-card-front"}>*/}
        {/*              {*/}
        {/*                staff.isActive ?*/}
        {/*                    <>*/}
        {/*                      <Icon className="staff-card-edit-icon" type="edit" onClick={() => handleEditStaffIconClick(staff)} />*/}
        {/*                      <p><span>Staff Name:</span><span>{staff.uname}</span></p>*/}
        {/*                      <ClockBtn staff={staff}/>*/}
        {/*                    </>*/}
        {/*                    :*/}
        {/*                    <>*/}
        {/*                      <p><span>Staff Name:</span><span>{staff.uname}</span></p>*/}
        {/*                      <p><span>Email:</span><span>{staff.email}</span></p>*/}
        {/*                      <p><span>Phone:</span><span>{staff.phone}</span></p>*/}
        {/*                      <p><span>Branch:</span><span>{staff.store_code}</span></p>*/}

        {/*                    </>*/}
        {/*              }*/}
        {/*            </div>*/}
        {/*        </a>*/}
        {/*    );*/}
        {/*  })}*/}
        {/*</div>*/}

        {/*<Modal*/}
        {/*    title="Staff Details"*/}
        {/*    visible={showStaffDetails}*/}
        {/*    onCancel={() => setShowStaffDetails(false)}*/}
        {/*    footer={null}*/}
        {/*    width={400}*/}
        {/*>*/}
        {/*  <Form {...layout} layout="inline" onSubmit={e => handleAddStaffSubmit(e)}>*/}
        {/*    <Form.Item label="ID" className="staff-details-form-item" style={{display: "none"}}>*/}
        {/*      {getFieldDecorator("id")(*/}
        {/*          <Input disabled={true} autoComplete="off"/>*/}
        {/*      )}*/}
        {/*    </Form.Item>*/}
        {/*    <Form.Item label="Name" className="staff-details-form-item">*/}
        {/*      {getFieldDecorator("uname",{rules:[{ required: true, message:"Name is required!"}]})(*/}
        {/*          <Input placeholder="Staff Name" autoComplete="off" onFocus={(e) => e.target.select()}/>*/}
        {/*      )}*/}
        {/*    </Form.Item>*/}
        {/*    <Form.Item label="Password" className="staff-details-form-item">*/}
        {/*      {getFieldDecorator("passwd",{rules:[{ required: true, message:"Password is required!"}]})(*/}
        {/*          <Input type="password" placeholder="Password" autoComplete="off" onFocus={(e) => e.target.select()}/>*/}
        {/*      )}*/}
        {/*    </Form.Item>*/}
        {/*    <Form.Item label="Email" className="staff-details-form-item">*/}
        {/*      {getFieldDecorator("email",{rules:[{ type:"email", message:"Invalid Email!"}]})(*/}
        {/*          <Input placeholder="Email" autoComplete="off" onFocus={(e) => e.target.select()}/>*/}
        {/*      )}*/}
        {/*    </Form.Item>*/}
        {/*    <Form.Item label="Phone" className="staff-details-form-item">*/}
        {/*      {getFieldDecorator("phone")(*/}
        {/*          <Input placeholder="Phone" autoComplete="off" onFocus={(e) => e.target.select()}/>*/}
        {/*      )}*/}
        {/*    </Form.Item>*/}
        {/*    <Form.Item label="Shop" className="staff-details-form-item">*/}
        {/*      {getFieldDecorator("store_code", {*/}
        {/*        rules: [{ required: true, message: "Please select default shop" }],*/}
        {/*      })(*/}
        {/*          <Select>*/}
        {/*            {*/}
        {/*              shopList &&*/}
        {/*                  shopList.map((shop, index) => {*/}
        {/*                    return(*/}
        {/*                        <Option value={shop.shop_name} key={index}>{shop.shop_name}</Option>*/}
        {/*                    );*/}
        {/*                  })*/}
        {/*            }*/}
        {/*          </Select>,*/}
        {/*      )}*/}
        {/*    </Form.Item>*/}
        {/*    <Row className="staff-details-btn-group-container">*/}
        {/*      <Col span={12}>*/}
        {/*        <Button*/}
        {/*            onClick={() => setShowStaffDetails(false)}*/}
        {/*            className="secondary-button">*/}
        {/*          Cancel*/}
        {/*        </Button>*/}
        {/*      </Col>*/}
        {/*      <Col span={12}>*/}
        {/*        <Button onClick={handleAddStaffSubmit}*/}
        {/*                htmlType="submit"*/}
        {/*                className="primary-button ">*/}
        {/*          Confirm*/}
        {/*        </Button>*/}
        {/*      </Col>*/}
        {/*    </Row>*/}
        {/*  </Form>*/}
        {/*</Modal>*/}

      </div>
  );
};

export default Form.create()(ClockAction);