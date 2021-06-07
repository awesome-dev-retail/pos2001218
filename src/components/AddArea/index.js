import React, { useState } from "react";
import { Form, Input, Modal } from "antd";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { saveArea, fetchAreaList } from "../../slices/areaSlice";
import { selectAreaId } from "../../slices/areaSlice";
import { fetchTableListInArea, fetchTableListInShop, deleteTable } from "../../slices/tableSlice";

import "./index.scss";

const Index = (props) => {
  const dispatch = useDispatch();
  const areaIdFromSlice = useSelector((state) => selectAreaId(state));
  const [form] = Form.useForm();
  // const [isUpdate, setIsUpdate] = useState(false);

  const hideModal = () => {
    form.resetFields();
    props.hideModel(false);
  };

  const addArea = () => {
    form.validateFields().then(async (res) => {
      // console.log(res);
      form.resetFields();
      props.hideModel(false);
      const areaObj = {
        // id: 1, // [not required for creating]
        id: props.id,
        cid: 1, // [required] int
        shop_id: 1, // [required] int
        area_name: res.areaName, // [required] string
        active: true, // [not required for creating]
        // description: "The Hall Area",
      };
      // console.log(areaObj);
      await dispatch(saveArea(areaObj));
      await dispatch(fetchAreaList(1));
      console.log("---------areaIdFromSlice-----", areaIdFromSlice);
      await dispatch(fetchTableListInArea({ shopId: 1, areaId: props.id }));
      // await dispatch(fetchTableListInArea(areaIdFromSlice));
    });
  };

  return (
    <Modal
      className="area-container"
      width={500}
      title="Add Area"
      destroyOnClose={true}
      visible={props.visible}
      // onOk={addArea}
      // onOk={saveModal}
      onCancel={hideModal}
      footer={[
        <div className="model-btn" key="btn" onClick={addArea}>
          {/* <div className="model-btn" key="btn" onClick={hideModal}> */}
          Save
        </div>,
      ]}>
      <div className="model-content">
        <Form form={form}>
          <Form.Item label="Area Name" colon={false} name="areaName" rules={[{ required: true, message: "Please input area name!" }]}>
            <Input placeholder="eg: hall" defaultValue={props.isUpdate ? props.name : ""} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

Index.propTypes = {
  hideModel: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  isUpdate: PropTypes.bool.isRequired,
};

export default Index;
