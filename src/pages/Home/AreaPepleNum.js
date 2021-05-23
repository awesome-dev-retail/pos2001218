import React, { useState } from "react";
import { withRouter } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { fetchTableListInShop, fetchTableListInArea, saveTable, deleteTable, setTableInfoPeopleNum } from "../../slices/tableSlice";

import { Input, Modal, Row, Col, Button } from "antd";
import PropTypes from "prop-types";
import deleteIcon from "../../assets/images/delete.png";
import "./index.areapeple.scss";

const Index = (props) => {
  const [num, setNum] = useState("");
  const dispatch = useDispatch();

  const hideModal = () => {
    setNum("");
    props.hideModel();
  };
  const handleOk = (number = 0) => {
    const { tableObj } = props;
    props.hideModel(number);
    // eslint-disable-next-line react/prop-types
    props.history.push(`/order/table/${tableObj.id}`);
    tableObj.status = "Occupied";
    dispatch(saveTable(tableObj));
    dispatch(setTableInfoPeopleNum({ tableId: tableObj.id, peopleNum: num }));
    // dispatch(setTableInfo({ unpaidOrder, unpaidAmount, tables: [{ tableId: tableObj.id, peopleNum: num }] }));
  };

  const hanldeSetNum = (number) => {
    if (number !== "" && num.length < 4) {
      setNum(num + number);
    }
  };

  const handleInputNum = (e) => {
    setNum(e.target.value);
  };

  const handleDeleteNum = () => {
    if (num.length) {
      setNum((num) => num.substr(0, num.length - 1));
    }
  };

  return (
    <Modal
      className="counter-container"
      width={400}
      title="Number Of Customers"
      destroyOnClose={true}
      visible={props.visible}
      onOk={handleOk}
      onCancel={hideModal}
      footer={[
        <Button disabled={!num.length} className={`${!num.length ? "disabled" : ""} model-btn`} key="btn" onClick={() => handleOk(num)}>
          START TO ORDER
        </Button>,
      ]}>
      <Input maxLength={4} value={num} onChange={handleInputNum} />
      <Row gutter={24}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0].map((item) => (
          <Col key={item} span={8} onClick={() => hanldeSetNum(item)}>
            {item}
          </Col>
        ))}
        <Col span={8} onClick={handleDeleteNum}>
          <img className="delete" src={deleteIcon} alt="delete" />
        </Col>
      </Row>
    </Modal>
  );
};

Index.propTypes = {
  hideModel: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  tableObj: PropTypes.object.isRequired,
};

export default withRouter(Index);
