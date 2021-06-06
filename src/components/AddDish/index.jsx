import React from "react";
import { Form, Input, Modal, Select } from "antd";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";
import { saveDish, fetchDishListInShop } from "../../slices/dishSlice";
import { fetchDishListInMenu } from "../../slices/dishSlice";
import { selectMenuList } from "../../slices/menuSlice";

import "./index.scss";

const { Option } = Select;
const Index = (props) => {
  const dispatch = useDispatch();
  const MenuListFromSlice = useSelector((state) => selectMenuList(state));

  const [form] = Form.useForm();
  const hideModal = () => {
    form.validateFields().then((res) => {
      console.log(res);
      props.hideModel(false);
    });
  };
  const addDish = () => {
    form.validateFields().then(async (res) => {
      console.log("addDish---------------------", res);
      form.resetFields();
      props.hideModel(false);
      const dishObj = {
        id: props.id, // [not required for creating]
        // id: 5,
        // id: props.id ? props.id : null,
        cid: 1, // [required] int
        class_id: res.menuId * 1, // [required] int
        dish_code: Date.now() + "",
        description: res.name, // [required] string
        unit_price: res.price * 1, // [required] int
        UOM: "EACH",
      };
      if (res.extrasName && res.extrasPrice) {
        dishObj.extras = [];
        dishObj.extras.push({
          id: 1, // [empty for creating]
          cid: 1, // [Required] int
          // dish_code: res.extrasName, // [required] string
          dish_code: Date.now() + "", // [required] string
          inventory_id: res.extrasName, // [required] string, from stock item
          // description: "Add milk",
          inventory_UOM: "EACH", // [required], from stock item's UOM list
          qty: 1, // [required]
          unit_price: res.extrasPrice * 1, // [required]
        });
      }
      // console.log("dishObj", dishObj);
      await dispatch(saveDish(dishObj));
      await dispatch(fetchDishListInMenu(res.menuId));
    });
  };

  return (
    <Modal
      className="add-dishes-container"
      width={600}
      destroyOnClose={true}
      title="Add Dish"
      // title="快速添加菜品"
      visible={props.visible}
      onOk={hideModal}
      onCancel={() => props.hideModel()}
      footer={[
        // <div className="model-btn" key="btn" onClick={hideModal}>
        //   保存
        // </div>,
        <div className="model-btn" key="btn1" onClick={addDish}>
          Save
        </div>,
      ]}>
      <div className="model-content">
        <Form form={form}>
          <Form.Item label="Dish Name" colon={false} name="name" rules={[{ required: true, message: "Please input dish name!" }]}>
            <Input placeholder="please input dish name" />
          </Form.Item>
          <Form.Item label="Dish Category" colon={false} name="menuId" rules={[{ required: true, message: "Please input dish category!" }]}>
            <Select>
              {MenuListFromSlice.map((item) => (
                <Option key={item} value={item.id}>
                  {item.class_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Dish Price($)" colon={false} name="price" rules={[{ required: true, message: "Please input price!" }]}>
            <Input placeholder="Please input price" />
            {/* <Input placeholder="Please input price" suffix="$" /> */}
          </Form.Item>
          {/* <p className="tip" onClick={props.showMoreTypeSetup}>
            More Settings
          </p> */}
          <Form.Item label="Dish Discription" colon={false} name="discription" rules={[{ required: false }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Extras Name" colon={false} name="extrasName" rules={[{ required: false }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Extras Price($)" colon={false} name="extrasPrice" rules={[{ required: false }]}>
            <Input />
            {/* <Input placeholder="Please input price" suffix="$" /> */}
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

Index.propTypes = {
  id: PropTypes.number,
  hideModel: PropTypes.func.isRequired,
  showMoreTypeSetup: PropTypes.func,
  // showMoreTypeSetup: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  description: PropTypes.string,
  price: PropTypes.number,
};

export default Index;
