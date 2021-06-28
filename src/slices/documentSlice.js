import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config, { getWebSocketBaseUrl } from "../configs/index";
import CONSTANT from "../configs/CONSTANT";
import moment from "moment";
import { fetchDocumentRequest, saveTemporaryPayment, invokePos, cancelEftPos } from "../services";
import Document from "../modules/document";
import { setMessageBox, setErrorBox, resetErrorBox, resetMessageBox } from "../slices/publicComponentSlice";
import { setShowCashPage } from "./paymentSlice";
import { message, sleep, getMoney } from "../lib/index";
import _ from "lodash";
import { notification } from "antd";
import CacheStorage from "../lib/cache-storage";
import { history } from "../components/MyRouter";

const initialState = {
  document: {},
  billList: [],
  paidBillList: [],
  unpaidBillList: [],
  portionBillList: [],
  paidArr: [],
  amountPaying: 0,
  amountPaid: 0,
  amountTotal: 0,
  showSplitOrder: false,
  isBackToOrder: true,
  showCashierPop: false,
  status: config.API_STATUS.IDLE,
  error: null,
  currentTransactionId: "",
  currentTransactionIsAccepted: false,
  lastSocketMsg: {},
  ws: null,
};

// export const documentListRequest = (shopId: any) => {
//   return api.request({
//     url: `/pos/data/document/list_in_shop?shopId=${shopId}`,
//     method: "get",
//     headers: {
//       Authorization: "2fse783mcEIlui4pN5i7WQ==",
//     },
//   });
// };

export const fetchDocument = createAsyncThunk("document/fetchDocument", async (invoiceId, { dispatch, rejectWithValue }) => {
  try {
    const res = await fetchDocumentRequest(invoiceId);
    if (res.error) throw res.error;
    const sum = res.data.payment_lines.reduce((t, c) => t + c.line_amount - c.rounding_amount, 0);
    if (res.data.doc_gross_amount === sum) {
      dispatch(setShowCashPage(true));
    }
    console.log("fetchDocument--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const processEFTPOS = createAsyncThunk("document/processEFTPOS", async (data, { getState, dispatch, rejectWithValue }) => {
  try {
    console.warn("Start process EFTPOS transaction...");
    console.log(getState());
    const { Document, Auth, Payment } = getState();
    const { document, billList, currentTransactionId, currentTransactionIsAccepted } = Document;
    const { shop, lane, user, device } = Auth;
    const { amountPaidArr } = Payment;
    const { amount, cashOutAmount } = data;
    let transactionApproved = false;
    const approveTransaction = function () {
      transactionApproved = true;
    };

    if (_.isEmpty(shop)) throw new Error("Shop is required");
    if (_.isEmpty(lane)) throw new Error("Lane is required");
    if (_.isEmpty(user)) throw new Error("User is required");
    if (_.isEmpty(device)) throw new Error("Device is required");

    console.log(data);
    const isNewTransaction = !document.transactionId;
    // console.log(document);
    if (isNewTransaction) {
      // Old transaction jump over this block
      let params = {
        cid: user.userinfo.cid,
        shop_id: shop.id,
        lane_id: lane.id.toString(),
        device_id: device.device_id.toString(),
        type: "CS",
        document_id: document.id,
        document_type: document.document_type,
        payment_date: moment().format(CONSTANT.TIME_FORMAT.BACKEND_DATETIME),
        line_amount: amount,
        cashout_amount: cashOutAmount,
        transaction_id: document.generateTransactionId(device.device_id),
        user_id: user.userinfo.id,
        original_id: 0,
      };
      // console.log(params);
      const res = await saveTemporaryPayment(params);
      if (res.error) throw res.error;
      console.log("Save temp payment success");
    } else {
      console.log("Skipped save temp payment...");
    }

    const invokeRes = await dispatch(invokeTerminal({ isNewTransaction, transaction_amount: amount, cashout_amount: 0, approveTransaction: approveTransaction }));

    console.log(invokeRes);
    // console.log(transactionApproved);

    if (transactionApproved) {
      // const res = await dispatch(fetchDocument(document.id));
      // const newDocument = res.payload.data;
      // const newBillList = res.payload.data.invoice_lines;
      // const unpaidBillList = newBillList.filter((item) => !item.checked);
      // dispatch(setBillList(unpaidBillList));
      // dispatch(setShowCashPage(true));
      // const len = newDocument.payment_lines.length;
      // const amountPaid = newDocument.payment_lines[len - 1].actual_amount;
      // amountPaidArr.push(amountPaid);

      message.success("Transaction Success");
      console.warn("Transaction completed successfully");
      //Clean up re-fetch document
      history.push("/");
      CacheStorage.removeItem("invoice_" + "1_" + document.table_id);
    } else {
      // debugger;
      console.warn("Transaction completed with error");
    }
    await dispatch(fetchDocument(document.id));
  } catch (e) {
    console.log("processEFTPOS catch");
    console.log(e.message);
    console.warn("Transaction completed with error");
    // pop error
    return rejectWithValue(e.message);
  } finally {
    CacheStorage.removeItem(CONSTANT.LOCALSTORAGE_SYMBOL.DOCUMENT_SYMBOL);
  }
});

export const invokeTerminal = createAsyncThunk("document/invoke", async (data, { getState, dispatch, rejectWithValue }) => {
  try {
    console.log(getState());
    const { Document, Auth } = getState();
    const { document, lastSocketMsg } = Document;
    const { shop, lane, user, device } = Auth;
    const { transaction_amount, cashout_amount, approveTransaction, isNewTransaction } = data;
    console.log(data);

    if (isNewTransaction) {
      // Old transaction jump over this block
      let params = {
        shop_id: shop.id,
        transaction_id: document.transactionId,
        device_id: device.device_id.toString(),
        transaction_amount: transaction_amount,
        cashout_amount: cashout_amount,
        currency_code: "NZD",
        transaction_type: "Purchase", //refund
        invoice_id: document.id,
        original_id: 0,
      };

      // Pop processing modal up
      dispatch(
        setMessageBox({
          title: "EFTPOS PROCESS",
          contentList: ["PLEASE WAIT", "CONNECTING EFTPOS PROVIDER SERVER"],
          btnList: [],
          processing: "Connecting",
          visible: true,
        })
      );

      CacheStorage.setItem(CONSTANT.LOCALSTORAGE_SYMBOL.DOCUMENT_SYMBOL, document);

      const res = await invokePos(params);
      if (res.error) throw res.error;
      // console.log(res);
      if (res.data && res.data.pos_info) {
        const { pos_info } = res.data;
        let contentList = pos_info.process.lines;
        contentList.unshift(getMoney(transaction_amount + cashout_amount));
        const btnList = pos_info.process.buttons;
        // Update processing modal content with invoke returned data
        dispatch(
          setMessageBox({
            title: "EFTPOS PROCESS",
            contentList: contentList,
            btnList: addCancelBtnCallBack(btnList),
            processing: "Connecting",
            visible: true,
          })
        );
        document.setMessageFromInvoke(res.data);
      }
    } else {
      // Reconnection initial message before first valid socket message return
      console.log("Skipped invoke terminal....");
      dispatch(
        setMessageBox({
          title: "EFTPOS PROCESS",
          contentList: ["PLEASE WAIT", "CONNECTING EFTPOS PROVIDER SERVER"],
          btnList: [],
          processing: "Connecting",
          visible: true,
        })
      );
    }

    // dispatch(setCurrentTransactionId(document.transactionId));

    const socketRes = await dispatch(connectSocket({ approveTransaction: approveTransaction }));
    console.log(getState());

    console.log(socketRes);

    if (socketRes.error) {
      dispatch(resetMessageBox());
      dispatch(
        setErrorBox({
          visible: true,
          title: "Transaction Error",
          content: `Failed to process payment. Error returned from EFTPOS: ${socketRes.payload}`,
        })
      );
    }
    return socketRes;
  } catch (e) {
    dispatch(resetMessageBox());
    dispatch(
      setErrorBox({
        visible: true,
        title: "Transaction Error",
        content: `Failed to process payment. Error returned from EFTPOS: ${e.message}`,
      })
    );
    console.log("invokeTerminal catch");
    console.log(e);
    return rejectWithValue(e.message);
  }
});

export const connectSocket = createAsyncThunk("document/connectSocket", async (data, { getState, dispatch, rejectWithValue }) => {
  let socketReconnectTimesRemain = data.hasOwnProperty("socketReconnectTimesRemain") ? data.socketReconnectTimesRemain : config.SOCKET_RECONNECT_TIMES;
  const { approveTransaction } = data;
  try {
    console.log(data);
    const previousMsg = data.previousMsg || {};
    const res = await openEFTPOSWebSocket(getState, dispatch, previousMsg, approveTransaction);
    await reconnectSocket(dispatch, res, socketReconnectTimesRemain, approveTransaction, getState);

    return res;
  } catch (e) {
    console.log(e);
    const { Document } = getState();
    console.log(Document);
    if (Document.ws) {
      Document.ws.close();
    }
    await reconnectSocket(dispatch, e, socketReconnectTimesRemain, approveTransaction, getState);
    return rejectWithValue(e.error.message);
  }
});

const reconnectSocket = async (dispatch, source, socketReconnectTimesRemain, approveTransaction, getState) => {
  // console.log(source);
  const { lastMsgGetFromSocket } = source;
  const { Document } = getState();
  const { document } = Document;
  // console.log(document);
  const socketCode = lastMsgGetFromSocket.code;
  const socketIsComplete = lastMsgGetFromSocket.pos_info && lastMsgGetFromSocket.pos_info.complete;
  console.log(`socket is complete: ${socketIsComplete} socket code: ${socketCode} reconnect remain times ${socketReconnectTimesRemain}`);
  if ((socketCode === 900 || socketCode === 200 || socketCode === 1006 || document.invokeMessage) && !socketIsComplete && socketReconnectTimesRemain > 0) {
    await sleep(5000);
    message.warning(`Try to reconnect the socket... remain times = ${socketReconnectTimesRemain - 1}`);
    console.log(`Try to reconnect the socket... remain times = ${socketReconnectTimesRemain}`);
    await dispatch(connectSocket({ socketReconnectTimesRemain: socketReconnectTimesRemain - 1, previousMsg: lastMsgGetFromSocket, approveTransaction }));
  }
};

const openEFTPOSWebSocket = (getStore, dispatch, previousMsg, approveTransaction) => {
  return new Promise((resolve, reject) => {
    // console.log(getStore());
    const { Auth, Document } = getStore();
    const { shop, lane, user, device, token } = Auth;
    const { document } = Document;
    const { transactionId } = document;
    const ws_url = `${getWebSocketBaseUrl(config.BASE_URL)}/payment/pos/progress?shopId=${shop.id}&deviceId=${device.device_id}&transactionId=${transactionId}&token=${token}`;
    console.log(`Opening socket to ${ws_url}...`);
    const ws = new WebSocket(ws_url);
    dispatch(setWs(ws));
    let timer;
    let heartBeatInterval;
    let lastMsgGetFromSocket = previousMsg || {};
    // console.log(ws);
    ws.onopen = (e) => {
      // Save log
      console.log("ws is open");
      timer = setTimeout(() => {
        console.log("heart bit time out");
        ws.close();
        reject({ error: new Error("connection time out"), lastMsgGetFromSocket });
        // Save log
      }, 3000);
      ws.send(new Date().toString());
      heartBeatInterval = setInterval(() => {
        if (ws.readyState === 1) {
          ws.send(new Date().toString());
        }
      }, 500);
    };

    ws.onmessage = (e) => {
      let res = JSON.parse(e.data);
      if (res.code !== 204) {
        lastMsgGetFromSocket = res;
      }
      clearTimeout(timer);
      const { isCompleted, isAccepted, arrayContent } = processWSMessage(res, dispatch, getStore);
      if (isAccepted) {
        console.log("Accepted");
        dispatch(setCurrentTransactionIsAccepted(true));
        approveTransaction();
      }
      if (isCompleted) {
        // dispatch(resetTransactionId());
        console.log("Got completed message from socket");
        console.log({ isCompleted, isAccepted, arrayContent });
        clearInterval(heartBeatInterval);
        if (isAccepted) {
          resolve({ lastMsgGetFromSocket, msg: "Transaction approved" });
        } else {
          reject({ error: new Error(arrayContent.toString()), lastMsgGetFromSocket });
        }
        ws.close(1000);
      }
      timer = setTimeout(() => {
        reject({ error: new Error("Connection time out"), lastMsgGetFromSocket });
        // Save log
      }, 3000);
      // Save log
    };
    ws.onerror = (e) => {
      // Save log
      console.log("socket error");
      console.log(JSON.stringify(e));
      clearInterval(heartBeatInterval);
      reject({ e, lastMsgGetFromSocket });
    };
    ws.onclose = (e) => {
      console.log("socket closed");
      console.log(JSON.stringify(e));
      clearInterval(heartBeatInterval);
      clearTimeout(timer);
      // save log
      resolve({ lastMsgGetFromSocket, msg: "socket is closed by server" });
    };
  });
};

const processWSMessage = (msg, dispatch, getStore) => {
  // code 200 returned means FE and BE communication correctly
  // Any returned data without code 200 will be ignored or treat as error connection
  // Transaction status change, completed or accepted MUST BE in code 200. Otherwise ask backend to provide a full documentation including all possible returned data structure.
  const { Document } = getStore();
  const { document } = Document;
  let arrayContent = [],
    arrayBTNs = [];
  let isCompleted = false;
  let isAccepted = false;
  let isCreditCard, cardType, surchargeAmount;
  if (msg.code === 204) return { isCompleted: isAccepted, arrayContent }; //Ignore 204 code
  if (msg.code === 200) {
    document.resetMessage();
    if (!msg.pos_info.complete) {
      isCompleted = false;
      //UNCOMPLETED
      arrayContent = msg.pos_info.process.lines;
      arrayBTNs = msg.pos_info.process.buttons;
    } else {
      //COMPLETED
      if (msg.msg) {
        // Warning message most likely backend failed to post invoice return a warning
        // Better to save as log here
        notification.warning({
          message: "Warning",
          description: msg.msg,
          duration: 0,
        });
        //message.warning(msg.msg);
      }
      isCompleted = true;
      if (!msg.pos_info.recipe.accept) {
        //COMPLETED FAILURE
        arrayContent = msg.pos_info.recipe.lines;
        isAccepted = false;
      } else {
        //COMPLETED SUCCESS
        arrayContent = msg.pos_info.recipe.lines;
        isAccepted = true;
        isCreditCard = msg.pos_info.recipe.credit_card;
        cardType = msg.pos_info.recipe.card_type;
        surchargeAmount = msg.pos_info.recipe.surcharge_amount || 0;
      }
      setTimeout(() => {
        dispatch(setMessageBox({ visible: false }));
      }, 1000);
    }
  } else if (msg.code === 1100) {
    //Alert Error
    arrayContent = [msg.msg];
  } else {
    arrayContent = [msg.msg];
    //Alert Error message.error(message.msg)
  }

  let messageBox = {
    title: "EFTPOS PROCESS",
    contentList: arrayContent,
    btnList: addCancelBtnCallBack(arrayBTNs),
    processing: "Connecting",
    visible: true,
  };
  dispatch(setMessageBox(messageBox));
  // console.log("Completed message process");
  return { isCompleted, isAccepted, isCreditCard, cardType, surchargeAmount, arrayContent };
};

const handleCancelBtnClick = async (key, val, shopId, deviceId) => {
  try {
    console.log("Cancel btn clicked" + key + val + shopId + deviceId);
    const res = await cancelEftPos(shopId, deviceId, key, val);
    if (res.error) throw res.error;
  } catch (e) {
    message.warning(`Failed to cancel by command because of ${e.message}, force to close manually.`);
  }
};

const addCancelBtnCallBack = (arrayBtn) => {
  if (arrayBtn.length > 0) {
    arrayBtn = arrayBtn.map((btn) => {
      btn["btn_callback"] = handleCancelBtnClick;
      return btn;
    });
  }
  return arrayBtn;
};

const DocumentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    setCurrentTransactionId(state, action) {
      state.currentTransactionId = action.payload;
    },
    resetTransactionId(state, action) {
      state.currentTransactionId = "";
    },
    setCurrentTransactionIsAccepted(state, action) {
      state.currentTransactionIsAccepted = action.payload;
    },
    setLastMessage(state, action) {
      state.lastSocketMsg = action.payload;
    },
    resetLastMessage(state, action) {
      state.lastSocketMsg = {};
    },
    setWs(state, action) {
      state.ws = action.payload;
    },
    resetAll(state, action) {
      state = { ...initialState };
    },

    setUnpaidBillList(state, action) {
      state.unpaidBillList = action.payload;
      state.amountPaying = 0;
      state.unpaidBillList.forEach((item) => {
        if (item.checked) {
          state.amountPaying += item.line_amount;
        }
      });
    },

    setPortionBillList(state, action) {
      state.portionBillList = action.payload;
    },
    setShowCashierPop(state, action) {
      state.showCashierPop = action.payload;
    },

    setShowSplitOrder(state, action) {
      state.showSplitOrder = action.payload;
    },

    setDocument(state, action) {
      state.document = action.payload;
    },

    setAmountPaying(state, action) {
      state.amountPaying = action.payload;
    },

    initDocumentState(state, action) {
      state.document = {},
        state.billList = [],
        state.paidBillList = [],
        state.unpaidBillList = [],
        state.paidArr = [],
        state.amountPaying = 0,
        state.amountPaid = 0,
        state.amountTotal = 0,
        state.showSplitOrder = false;
      state.showCashierPop = false;

    },



  },
  extraReducers: {
    [fetchDocument.pending]: (state) => {
      return initialState;
    },
    [fetchDocument.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      // state.document = action.payload.data;
      state.document = new Document(action.payload.data);

      state.showSplitOrder = state.document.payment_lines[0] && state.document.payment_lines[0].invoice_line_ids.length !== 0;

      state.unpaidBillList = state.document.invoice_lines ? state.document.invoice_lines.filter((i) => !i.paid) : [];

      state.paidBillList = state.document.invoice_lines ? state.document.invoice_lines.filter((i) => i.paid) : [];

      state.paidArr = state.paidBillList.map((i) => i.line_amount);

      state.amountPaid = state.paidBillList.reduce((total, current) => total + current.line_amount, 0);

      state.remainingDue = state.document.doc_gross_amount - state.document.payment_lines.reduce((total, current) => total + current.line_amount - current.rounding_amount, 0);

      state.amountTotal = state.document.doc_gross_amount;

      if (state.amountPaid > 0) {
        state.isBackToOrder = false;
      }



      // const copyDocument = JSON.parse(JSON.stringify(state.document));

      // CacheStorage.setItem("document_" + "1_" + copyDocument.id, copyDocument);

      // console.log("copyDocument from localstorage----------------", CacheStorage.getItem("document_" + "1_" + copyDocument.id));
      // state.tableList = action.payload.data.data.list;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [fetchDocument.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
    [processEFTPOS.pending]: (state, action) => {
      state.status = config.API_STATUS.LOADING;
      console.log("processEFTPOS pending");
    },
    [processEFTPOS.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      console.log("processEFTPOS fulfilled");
    },
    [processEFTPOS.rejected]: (state, action) => {
      message.error(`Failed to process payment: ${action.payload}`);
      state.status = config.API_STATUS.FAILED;
    },
    [invokeTerminal.pending]: (state, action) => {
      console.log("invokeTerminal pending");
    },
    [invokeTerminal.fulfilled]: (state, action) => {
      console.log("invokeTerminal fulfilled");
    },
    [invokeTerminal.rejected]: (state, action) => {
      console.error("invokeTerminal rejected");
    },
    [connectSocket.pending]: (state, action) => {
      console.log("connectSocket pending");
    },
    [connectSocket.fulfilled]: (state, action) => {
      console.log("connectSocket fulfilled");
    },
    [connectSocket.rejected]: (state, action) => {
      console.error("connectSocket rejected");
    },
  },
});

// export const { } = DocumentSlice.actions;
// export const selectCashierStatus = (state) => state.Document.showCashier;

export const { setCurrentTransactionId, resetTransactionId, setCurrentTransactionIsAccepted, setLastMessage, setDocument, resetAll, setWs, setShowSplitOrder, setUnpaidBillList, setPortionBillList, setShowCashierPop, setAmountPaying, initDocumentState } =
  DocumentSlice.actions;

export const selectDocument = (state) => state.Document.document;

// export const selectBillList = (state) => state.Document.billList;
export const selectUnpaidBillList = (state) => state.Document.unpaidBillList;
export const selectShowCashierPop = (state) => state.Document.showCashierPop;
export const selectPortionBillList = (state) => state.Document.portionBillList;

export const selectPaidBillList = (state) => state.Document.paidBillList;

export const selectPaidArr = (state) => state.Document.paidArr;


export const selectAmountPaying = (state) =>
  state.Document.amountPaying;

export const selectAmountPaid = (state) => state.Document.amountPaid;

export const selectRemainingDue = (state) => state.Document.remainingDue;

export const selectAmountTotal = (state) => state.Document.amountTotal;

export const selectDocumentIsLoading = (state) => state.Document.status === config.API_STATUS.LOADING;

export const selectShowSplitOrder = (state) => state.Document.showSplitOrder;
export const selectIsBackToOrder = (state) => state.Document.isBackToOrder;

// export const selectPaidPriceArr = (state) => state.Document.paidPriceArr;

export default DocumentSlice.reducer;
