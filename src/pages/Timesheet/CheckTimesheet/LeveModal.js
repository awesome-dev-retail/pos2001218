import React, { useEffect, useState } from "react";
import {Button, Col, Spin, Modal, Row, Select, TimePicker} from "antd";
import { listAllTimesheetStaffInCompany, addTimesheetAction } from "../../../services/timesheetApi";
// import {formatCashierLine, message} from "../../../lib/index";
// import PageLoading from "../../../components/PageLoading/index";
import config from "../../../configs/index";
import _ from "lodash";
import { Form } from "@ant-design/compatible";
import { useSelector, useDispatch, useStore } from "react-redux";
import { selectShop, selectShops } from "../../../slices/authSlice";
import { fetchShopList } from "../../../slices/authSlice";
import { message } from "../../../lib";
import {
  selectDefaultStaffName,
  selectShowAddLeaveModal,
  selectTimesheetDocs,
  setShowAddLeaveModal,
  validateAddAction,
  loadTimesheetDocs
} from "../../../slices/timesheetSlice";

const { Option } = Select;

const LeaveModal = (props) => {
  const defaultStaffName = useSelector(state => selectDefaultStaffName(state));
  const timesheetDocs = useSelector(state => selectTimesheetDocs(state));
  const showAddLeaveModal = useSelector(state => selectShowAddLeaveModal(state));
  const shop = useSelector((state) => selectShop(state));
  const shopList = useSelector(state => selectShops(state));
  const dispatch = useDispatch();

  const [ staffList, setStaffList ] = useState([]);
  // eslint-disable-next-line react/prop-types
  const { getFieldDecorator, setFieldsValue } = props.form;
  const timeFormat = "HH:mm";
  const layout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18}
  };

  const fetchStaffList = async () => {
    try {
      const res = await listAllTimesheetStaffInCompany();
      if (res.error) throw res.error;
      if (res.data && res.data.length > 0) {
        setStaffList(_.cloneDeep(res.data));
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  useEffect(() => {
    fetchStaffList();
    dispatch(fetchShopList());
  }, []);

  useEffect(() => {
    setFieldsValue({store_code: shop.shop_name, job_code: config.TIMESHEET.LEAVE, staff_name: defaultStaffName});
  }, []);



  const handleActionSubmit = (e) => {
    e.preventDefault();
    // eslint-disable-next-line react/prop-types
    props.form.validateFields(async (err, formData) => {
      if (!err) {
        try {
          // setPageLoading(true);
          // eslint-disable-next-line react/prop-types
          const { summaryDate } = props;
          const staff = staffList.find(staff => staff.uname === formData.staff_name);
          const staff_id = staff.id;
          const startTimeStr = formData.approve_start_time.set("second",0).format("HH:mm:ss");
          const endTimeStr = formData.approve_end_time.set("second",0).format("HH:mm:ss");
          // eslint-disable-next-line react/prop-types
          const dateStr = summaryDate.format("YYYY-MM-DD");
          const approve_end_time = `${dateStr} ${endTimeStr}`;
          const approve_start_time = `${dateStr} ${startTimeStr}`;
          const action = {
            ...formData,
            staff_id,
            // job_code: "LEAVE",
            // eslint-disable-next-line react/prop-types
            summary_date: summaryDate.format("YYYY-MM-DD"),
            approve_end_time,
            approve_start_time,
          };

          validateAddAction(staff_id, action, timesheetDocs);
          const res = await addTimesheetAction(action);
          if (res.error) throw res.error;
          await dispatch(loadTimesheetDocs({selectedDate: summaryDate}));
          dispatch(setShowAddLeaveModal(false));
        } catch (e) {
          message.error(e.message);
        } finally {
          // setPageLoading(false);
        }

      }
    });
  };

  return (
      <Modal
          title="Add Leave"
          visible={showAddLeaveModal}
          onCancel={() => dispatch(setShowAddLeaveModal(false))}
          footer={null}
          width={400}
          destroyOnClose={true}
          className="bizex-timesheet-add-leave-modal"
      >
        {/*<PageLoading loading={pageLoading} />*/}
        <Form {...layout} layout="inline" onSubmit={(e)=>handleActionSubmit(e)}>
          <Form.Item label="Staff" className="staff-details-form-item">
            {getFieldDecorator("staff_name", {
              rules: [{ required: true, message: "Please select staff" }],
            })(
                <Select>
                  {
                    staffList &&
                    staffList.map((staff, index) => {
                      return(
                          <Option value={staff.uname} key={index}>{staff.uname}</Option>
                      );
                    })
                  }
                </Select>,
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
          <Form.Item label="Action" className="staff-details-form-item">
            {getFieldDecorator("job_code", {
              rules: [{ required: true, message: "Please select action" }],
            })(
                <Select>
                  <Option value={config.TIMESHEET.CLOCK}>{config.TIMESHEET.VIEW_NAME.CLOCK}</Option>
                  <Option value={config.TIMESHEET.BREAK}>{config.TIMESHEET.VIEW_NAME.BREAK}</Option>
                  <Option value={config.TIMESHEET.LEAVE}>{config.TIMESHEET.VIEW_NAME.LEAVE}</Option>
                </Select>,
            )}
          </Form.Item>
          <Form.Item label="From" className="staff-details-form-item">
            {getFieldDecorator("approve_start_time",{rules:[{ required: true, message:"Start time is required!"}]})(
                <TimePicker
                    className="check-timesheet-leave-time-picker"
                    // value={doc.approve_start_time}
                    format={timeFormat}
                    minuteStep={10}
                    allowClear={false}
                />
            )}
          </Form.Item>
          <Form.Item label="To" className="staff-details-form-item">
            {getFieldDecorator("approve_end_time",{rules:[{ required: true, message:"End time is required!"}]})(
                <TimePicker
                    className="check-timesheet-leave-time-picker"
                    // value={doc.approve_start_time}
                    format={timeFormat}
                    minuteStep={10}
                    allowClear={false}
                />
            )}
          </Form.Item>
          <Row className="staff-details-btn-group-container">
            <Col span={12}>
              <Button
                  // loading={pageLoading}
                  onClick={() => dispatch(setShowAddLeaveModal(false))}
                  className="secondary-button">
                Cancel
              </Button>
            </Col>
            <Col span={12}>
              <Button
                  // loading={pageLoading}
                  htmlType="submit"
                  className="primary-button ">
                Confirm
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
  );
};

export default Form.create()(LeaveModal);
