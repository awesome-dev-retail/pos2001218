import React, { useEffect } from "react";
import { Form, Input, Modal, Select } from "antd";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";
import { saveDish, fetchDishListInShop } from "../../slices/dishSlice";
import { fetchDishListInMenu } from "../../slices/dishSlice";
import { selectMenuList } from "../../slices/menuSlice";
import { fetchStockListInShop, selectStockList, getSelectedExtras, selectExtras } from "../../slices/stockSlice";
import { selectCurrentUser } from "../../slices/authSlice";

import "./index.scss";

const { Option } = Select;
const Index = (props) => {
  // console.log("props", props);
  const dispatch = useDispatch();
  const MenuListFromSlice = useSelector((state) => selectMenuList(state));
  const currentUser = useSelector((state) => selectCurrentUser(state));
  const stockList = useSelector((state) => selectStockList(state)) || [];
  const selectedExtras = useSelector((state) => selectExtras(state)) || [];

  const [form] = Form.useForm();
  const hideModal = () => {
    form.validateFields().then((res) => {
      // console.log(res);
      props.hideModel(false);
    });
  };

  useEffect(() => {
    dispatch(fetchStockListInShop(currentUser.userinfo.cid));
  }, []);

  useEffect(() => {
    if (props.dish) {
      form.setFieldsValue({ name: props.dish.description });
      form.setFieldsValue({ menuId: props.dish.class_id });
      form.setFieldsValue({ price: props.dish.unit_price });
    } else {
      form.setFieldsValue({ name: "" });
      form.setFieldsValue({ menuId: "" });
      form.setFieldsValue({ price: "" });
    }
  }, [props]);

  const addDish = () => {
    form.validateFields().then(async (res) => {
      // console.log("addDish---------------------", res);
      form.resetFields();
      props.hideModel(false);
      const dishObj = {
        id: props.dish && props.dish.id ? props.dish.id : 0, // [not required for creating]
        cid: currentUser.userinfo.cid, // [required] int
        class_id: res.menuId * 1, // [required] int
        dish_code: Date.now() + "",
        description: res.name, // [required] string
        unit_price: res.price * 1, // [required] int
        UOM: "EACH",
      };
      if (res.extrasName && res.extrasPrice) {
        dishObj.extras = [];
        dishObj.extras.push({
          // id: 1, // [empty for creating]
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

  // const children = [];
  // for (let i = 10; i < 36; i++) {
  //   children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
  // }

  const children = stockList.map((i) => <Option key={i.id}>{i.inventory_id}</Option>);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    dispatch(getSelectedExtras(value));
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
          {/* <Form.Item label="Extras" colon={false} name="extras">
            <Select mode="multiple" allowClear style={{ width: "100%" }} placeholder="Please select extras" defaultValue={[]} onChange={handleChange}>
              {children}
            </Select>
          </Form.Item> */}
          <Form.Item label="Extras Name" colon={false} name="extrasName" rules={[{ required: false }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Extras Price($)" colon={false} name="extrasPrice" rules={[{ required: false }]}>
            <Input />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

Index.propTypes = {
  hideModel: PropTypes.func.isRequired,
  showMoreTypeSetup: PropTypes.func,
  // showMoreTypeSetup: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  dish: PropTypes.object.isRequired,
};

export default Index;
