import React, { useEffect } from "react";
import { Form, Input, Modal, Select } from "antd";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { saveTable, fetchTableListInShop, fetchTableListInArea } from "../../slices/tableSlice";
import { selectAreaList } from "../../slices/tableSlice";
// import { saveTable, fetchTableListInShop, fetchTableListInArea } from "../../slices/tableSlice";
import { selectCurrentUser } from "../../slices/authSlice";
import "./index.scss";

const { Option } = Select;

const Index = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const areaCategoryFromSlice = useSelector((state) => state.Area.area) || [];
  const currentUser = useSelector((state) => selectCurrentUser(state));
  // const areaCategoryName = areaCategoryFromSlice.map((item) => item.area_name);
  // console.log("areaCategoryName", areaCategoryName);
  // console.log("areaCategoryFromSlice", areaCategoryFromSlice);
  const hideModal = () => {
    form.resetFields();
    props.hideModel(false);
  };

  const onFinish = () => {
    return;
  };

  useEffect(() => {
    if (props.tableObj) {
      form.setFieldsValue({ tableName: props.tableObj.table_name });
      form.setFieldsValue({ areaId: props.tableObj.area_id });
      form.setFieldsValue({ capacity: props.tableObj.capacity });
    } else {
      form.setFieldsValue({ tableName: "" });
      form.setFieldsValue({ areaId: "" });
      form.setFieldsValue({ capacity: "" });
    }
  }, [props]);

  const addTable = () => {
    form.validateFields().then(async (res) => {
      // console.log("addTable---------------------", res);
      form.resetFields();
      props.hideModel(false);
      const tableObj = {
        id: props.tableObj && props.tableObj.id ? props.tableObj.id : 0, // [not required for creating]
        // id: 5,
        // id: props.tableObj.id ? props.tableObj.id : null,
        cid: currentUser.userinfo.cid, // [required] int
        shop_id: 1, // [required] int
        area_id: res.areaId,
        // area_id: 71,
        table_name: res.tableName, // [required] string
        capacity: res.capacity * 1, // [required] int
        status: "Available",
        active: true, // [not required for creating]
        // description: "The Hall Area",
      };
      // console.log("tableObj", tableObj);
      await dispatch(saveTable(tableObj));
      // dispatch(fetchTableListInShop(1));
      dispatch(fetchTableListInArea({ shopId: 1, areaId: res.areaId }));
    });
  };

  return (
    <Modal
      className="add-table-container"
      width={500}
      title="Add Table"
      destroyOnClose={true}
      visible={props.visible}
      // onOk={hideModal}
      onCancel={hideModal}
      footer={[
        <div className="model-btn" key="btn" onClick={addTable}>
          Save
        </div>,
        // <div className="model-btn" key="btn1" onClick={hideModal}>
        //   保存并继续添加
        // </div>,
      ]}>
      <Form form={form} name="basic" initialValues={{ remember: true }} onFinish={onFinish}>
        <Form.Item colon={false} label="Table Name" name="tableName" rules={[{ required: true, message: "Please input table ID or name!" }]}>
          <Input placeholder="please input table ID or name, eg：A01" defaultValue={props.tableObj.id ? props.tableObj.table_name : ""} />
        </Form.Item>
        <Form.Item colon={false} label="Area" name="areaId" rules={[{ required: true, message: "Please input area!" }]}>
          <Select placeholder="">
            {/* <Select placeholder="去设置"> */}
            {areaCategoryFromSlice.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.area_name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item colon={false} label="Capacity" name="capacity" rules={[{ required: true, message: "Please input capacity!" }]}>
          <Input placeholder="Please input capacity" initialValues={props.tableObj.id ? props.tableObj.capacity : ""} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

Index.propTypes = {
  hideModel: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  // // areaId: PropTypes.number.isRequired,
  // id: PropTypes.number,
  // name: PropTypes.string,
  // capacity: PropTypes.number,
  // // isUpdate: PropTypes.bool.isRequired,
  tableObj: PropTypes.object.isRequired,
};

export default Index;
