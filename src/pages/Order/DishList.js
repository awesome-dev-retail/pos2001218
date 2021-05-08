/* eslint-disable react/prop-types */
import React, { Fragment, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { Badge, Modal, Button } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";

import CacheStorage from "../../lib/cache-storage";

import { fetchDishListInShop, fetchDishListInMenu, deleteDish, setDishObjInOrder, selectDishObjInOrder } from "../../slices/dishSlice";
import { calculateInvoice } from "../../slices/invoiceSlice";

import { selectTable } from "../../slices/tableSlice";

import { selectDishList } from "../../slices/dishSlice";

import { selectMenuId } from "../../slices/menuSlice";

import AddDish from "../../components/AddDish";

function DishList(props) {
  const [showDish, setShowDish] = useState(false);
  const [dishId, setDishId] = useState(0);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [isAdmin, setIsAdmin] = useState(true);

  const { confirm } = Modal;

  const dispatch = useDispatch();
  const dishListFromSlice = useSelector((state) => selectDishList(state)) || [];
  const dishObjInOrder = useSelector((state) => selectDishObjInOrder(state)) || [];

  // console.log("dishListFromSlice", dishListFromSlice);
  const menuIdFromSlice = useSelector((state) => selectMenuId(state));

  const table = useSelector((state) => selectTable(state)) || {};
  console.log("=======================indishlist", table);

  useEffect(() => {
    dispatch(fetchDishListInShop(1));
  }, []);

  const getClass = (type) => {
    return type === "eating" ? "eating" : type === "waitPlanOrder" ? "wait-plan-order" : "empty";
  };

  // const redirectToOrder = () => {
  //   // eslint-disable-next-line react/prop-types
  //   props.history.push("/order");
  // };

  const handleSaveDish = (dishId, description, price) => {
    setShowDish(true);
    setDishId(dishId);
    setDescription(description);
    setPrice(price);
  };

  function showDeleteConfirm(dish) {
    confirm({
      title: "Are you sure to delete this item?",
      icon: <ExclamationCircleOutlined />,
      // content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        await dispatch(deleteDish(dish.id));
        // await dispatch(fetchDishListInShop(1));
        await dispatch(fetchDishListInMenu(dish.class_id));
      },
      onCancel() {
        // console.log("Cancel");
      },
    });
  }

  // const total = useMemo(() => {
  //     let count = dishObjFromSlice.reduce((total, currentValue) => {
  //       return total + currentValue.count || 1;
  //     }, 0);

  //     let price = dishObjFromSlice.reduce((total, currentValue) => {
  //       return total + (currentValue.count || 1) * currentValue.unit_price;
  //     }, 0);

  //     return { count, price: price.toFixed(2) };
  //   }, [JSON.stringify(dishObjFromSlice)]);

  const createInvoice = (table, dishArr) => {
    const grossAmount = dishArr.reduce((total, currentValue) => {
      return total + currentValue.count * currentValue.unit_price;
    }, 0);
    return {
      CID: 1,
      ShopID: 1,
      LaneID: "LE_001",
      TableID: table.id,
      DivideNo: 1,
      MemberID: 0,
      TakeawayID: 0,
      InvoiceDate: new Date(),
      GrossAmount: grossAmount.toFixed(2) * 1,
      NetAmount: (grossAmount * 0.87).toFixed(2) * 1,
      GSTAmount: (grossAmount - grossAmount * 0.87).toFixed(2) * 1,
      UserID: 24,

      Lines: dishArr.map((dish) => ({
        Dish: {
          DishCode: dish.dish_code,
        },
        Quantity: {
          Qty: dish.count,
        },
        UOM: "EACH",
        UnitPrice: dish.unit_price,
        DiscountPercentage: {
          DiscountPercentage: 0,
        },
        DiscountAmount: {
          DiscountAmount: 0,
        },
        Amount: dish.count * dish.unit_price,
        UnitCost: dish.unit_cost,
        ServeNow: true,
        Cooked: false,
        Served: false,
      })),
    };
  };

  const addToOrderList = async (dish) => {
    let index = dishObjInOrder.findIndex((item) => item.id === dish.id);
    let arr = JSON.parse(JSON.stringify(dishObjInOrder));
    let copyDish = JSON.parse(JSON.stringify(dish));
    if (index > -1) {
      arr[index].count = arr[index].count + 1;
    } else {
      copyDish.count = 1;
      arr.push(copyDish);
    }
    const invoice = createInvoice(table, arr);
    console.log("invoice----------------", invoice);
    await dispatch(calculateInvoice(invoice));
    //need get data from returned invoice later on.
    await dispatch(setDishObjInOrder(arr));
  };

  return (
    <Fragment>
      <div className="table-list">
        {dishListFromSlice.map((item) => (
          <div key={item.id} className={`table-item ${getClass(item.status)}`}>
            {/* <div key={item.id} className={`dish-item ${getClass(item.status)}`} onClick={() => setShowDishInfo(true)}> */}
            <div
              onClick={() => {
                addToOrderList(item);
              }}>
              <p className="table-id">{item.description}</p>
              {item.unit_price && <div className="money">${item.unit_price}</div>}
              {/* {item.combination && <div>Share {item.combination} Dishs</div>} */}
              {/* {item.status === "waitPlanOrder" && <div className="wait-plan-order-text">To be ordered</div>}
              <div>
                {item.tag} {item.time && <span>{item.time}</span>}
              </div> */}
            </div>
            <div className="edit-delete">
              {isAdmin && <EditOutlined onClick={(event) => handleSaveDish(item.id, item.description, item.unit_price)} />}
              {isAdmin && <DeleteOutlined onClick={() => showDeleteConfirm(item)} />}
            </div>
          </div>
        ))}
        <div className="table-item add-table" onClick={() => handleSaveDish()}>
          <PlusOutlined />
          <div>Add Dish</div>
        </div>
      </div>
      <AddDish visible={showDish} hideModel={setShowDish} id={dishId} description={description} price={price}></AddDish>
    </Fragment>
  );
}

export default withRouter(DishList);
