/* eslint-disable react/prop-types */
import React, { Fragment, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { Badge, Modal, Button, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";

// import { selectAreaId } from "../../slices/areaSlice";
import { fetchTableListInShop, fetchTableListInArea, saveTable, deleteTable } from "../../slices/tableSlice";
import { selectTableList, setTableList } from "../../slices/tableSlice";

import AddTable from "../../components/AddTable";
import AreaPepleNum from "./AreaPepleNum";

function TableList(props) {
  const [showTable, setShowTable] = useState(false);
  const [table, setTable] = useState({});
  const [isAdmin, setIsAdmin] = useState(true);
  const [showPersonNumPop, setPersonNumPopStatus] = useState(false);
  const { confirm } = Modal;

  const dispatch = useDispatch();
  const tableListFromSlice = useSelector((state) => selectTableList(state)) || [];
  // const areaId = useSelector((state) => selectAreaId(state));
  console.log("tableListFromSlice", tableListFromSlice);

  useEffect(() => {
    dispatch(fetchTableListInShop(1));
  }, []);

  const redirectToOrder = async (tableObj) => {
    const obj = Object.assign({}, tableObj);
    setTable(obj);
    if (obj.status === "Occupied") {
      props.history.push(`/order/table/${obj.id}`);
    } else {
      setPersonNumPopStatus(true);
    }
  };

  const handleSaveTable = (tableObj) => {
    setShowTable(true);
    // const table = { id: table.id, name: table.table_name, capacity: table.capacity };
    const table = Object.assign({}, tableObj);
    setTable(table);
    // setTableId(tableId);
    // setTableName(tableName);
    // setCapacity(capacity);
  };

  function showDeleteConfirm(table, areaId) {
    confirm({
      title: "Are you sure to delete this item?",
      icon: <ExclamationCircleOutlined />,
      // content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        if (table.status === "Occupied") {
          message.error("occupied table cannot be deleted!");
          return;
        }
        await dispatch(deleteTable(table.id));
        await dispatch(fetchTableListInArea({ shopId: 1, areaId }));
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }

  const handleUpdatePersonNum = async (value) => {
    setPersonNumPopStatus(false);
    if (typeof value === "string") {
      let copyTable = JSON.parse(JSON.stringify(table));
      let copyTableListFromSlice = JSON.parse(JSON.stringify(tableListFromSlice));
      copyTable.num = value;
      setTable(copyTable);
      let index = copyTableListFromSlice.findIndex((item) => item.id === copyTable.id);
      copyTableListFromSlice[index].num = value;
      await dispatch(setTableList(copyTableListFromSlice));
    }
  };

  return (
    <Fragment>
      <div className="table-list">
        {tableListFromSlice.map((item) => (
          <div key={item.id} className={`table-item ${item.status}`}>
            <div
              onClick={() => {
                redirectToOrder(item);
              }}>
              <p className="table-id">{item.table_name}</p>
              {item.money && <div className="money">${item.money}</div>}
              {item.combination && <div>Share {item.combination} Tables</div>}
              {/* {item.combination && <div>拼{item.combination}桌</div>} */}
              {item.status === "Available" && <div className="wait-plan-order-text">To be ordered</div>}
              {item.status === "Occupied" && <div className="wait-plan-order-text">Amount:${item.GrossAmount ? item.GrossAmount.toFixed(2) : "0.00"}</div>}
              <div>
                <span>
                  Capacity: {item.capacity}
                  {/* {item.peopleNum || 0}/{item.capacity} */}
                </span>
                <span></span>
              </div>
            </div>
            <div className="edit-delete">
              {isAdmin && <EditOutlined onClick={(event) => handleSaveTable(item)} />}
              {/* {isAdmin && <EditOutlined onClick={(event) => handleSaveTable(item.id, item.table_name, item.capacity)} />} */}
              {isAdmin && <DeleteOutlined onClick={() => showDeleteConfirm(item, item.area_id)} />}
            </div>
          </div>
        ))}
        <div className="table-item add-table" onClick={() => handleSaveTable()}>
          <div className="add-icon">
            <PlusOutlined />
            {/* Add Table */}
          </div>
        </div>
      </div>
      <AddTable visible={showTable} hideModel={setShowTable} tableObj={table}></AddTable>
      <AreaPepleNum visible={showPersonNumPop} hideModel={handleUpdatePersonNum} tableObj={table} />
    </Fragment>
  );
}

export default withRouter(TableList);
