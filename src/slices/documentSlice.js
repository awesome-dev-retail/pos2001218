import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config, { getWebSocketBaseUrl } from "../configs/index";
import CONSTANT from "../configs/CONSTANT";
import CacheStorage from "../lib/cache-storage";
import moment from "moment";

// import { CacheStorage, message } from "../lib";
import { fetchDocumentRequest, saveTemporaryPayment, invokePos } from "../services";
import axios from "axios";
// import { history } from "../App";
import Document from "../modules/document";
import {fetchDevices} from "./authSlice";
import { setMessageBox, setErrorBox, resetErrorBox, resetMessageBox } from "../slices/publicComponentSlice";

const initialState = {
  document: {},
  showCashier: false,
  // currentDocument: {},
  status: "",
  error: null,
  currentTransactionId:"",
  currentTransactionIsAccepted: false,
  lastSocketMsg: {},
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

const sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const fetchDocument = createAsyncThunk("document/fetchDocument", async (invoiceID, { rejectWithValue }) => {
  try {
    const res = await fetchDocumentRequest(invoiceID);
    if (res.error) throw res.error;
    console.log("fetchDocument--------------", res);

    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const processEFTPOS = createAsyncThunk("document/processEFTPOS", async (data, { getState, dispatch, rejectWithValue }) => {
  try {
    console.log(getState());
    const { Document, Auth } = getState();
    const { document, currentTransactionId, currentTransactionIsAccepted } = Document;
    const { shop, lane, user, device } = Auth;
    const { amount } = data;
    console.log(data);

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
      cashout_amount: 0,
      transaction_id: document.generateTransactionId(device.device_id),
      user_id: user.userinfo.id,
      original_id: 0,
    };
    const res = await saveTemporaryPayment(params);
    if (res.error) throw res.error;
    await dispatch(invokeTerminal({transaction_amount: amount, cashout_amount: 0}));

    if (currentTransactionIsAccepted) {
      console.log("Transaction Success");
    }

    return res;
  } catch (e) {
    console.log("saveTempPayment catch");
    return rejectWithValue(e.message);
  }
});

export const invokeTerminal = createAsyncThunk("document/invoke", async (data, { getState, dispatch, rejectWithValue }) => {
  try {
    console.log(getState());
    const { Document, Auth } = getState();
    const { document, lastSocketMsg } = Document;
    const { shop, lane, user, device } = Auth;
    const { transaction_amount, cashout_amount } = data;
    console.log(data);

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
    const res = await invokePos(params);
    if (res.error) throw res.error;
    dispatch(setCurrentTransactionId(document.transactionId));

    let initMessageBox = {
      title: "EFTPOS PROCESS",
      contentList: ["PLEASE WAIT", "CONNECTING EFTPOS PROVIDER SERVER"],
      btnList: [
      ],
      processing: "Connecting",
      visible: true,
    };
    dispatch(setMessageBox(initMessageBox));
    const socketRes = await dispatch(connectSocket());
    console.log(getState());

    console.log(socketRes);

    if (socketRes.error) {
      dispatch(resetMessageBox());
      dispatch(setErrorBox({
        visible: true,
        title: "Transaction Error",
        content: `Failed to process payment. Error returned from EFTPOS: ${socketRes.payload}`,
      }));
    }
    // Socket rejected but should reconnet
    return socketRes;
  } catch (e) {
    console.log("invokeTerminal catch");
    console.log(e);
    return rejectWithValue(e.message);
  }
});

export const connectSocket = createAsyncThunk("document/connectSocket", async (data, { getState, dispatch, rejectWithValue }) => {
  try {
    console.log(getState());
    const { Document } = getState();
    const { document, currentTransactionId, currentTransactionIsAccepted } = Document;
    let socketReconnectTimesRemain = data ? data.socketReconnectTimesRemain : config.SOCKET_RECONNECT_TIMES;
    const res = await openEFTPOSWebSocket(getState, dispatch);
    console.log(res);
    const { lastMessage } = res;
    const socketCode = lastMessage.code;
    const socketIsComplete = lastMessage.pos_info && lastMessage.pos_info.complete;
    console.log(`socket is complete: ${socketIsComplete} socket code: ${socketCode}`);
    if ((socketCode === 900 || socketCode === 200 || socketCode === 1006) && !socketIsComplete) {
        await sleep(5000);
        console.log(`Try to reconnect the socket... remain times = ${socketReconnectTimesRemain}`);
        await dispatch(connectSocket({socketReconnectTimesRemain: socketReconnectTimesRemain - 1}));
    }
    // if (currentTransactionId && !currentTransactionIsAccepted && socketReconnectTimesRemain > 0) {
    //   await sleep(5000);
    //   console.log(`remain times = ${socketReconnectTimesRemain}`);
    //   await dispatch(connectSocket({socketReconnectTimesRemain: socketReconnectTimesRemain - 1}));
    // }
    return res;
  } catch (e) {
    let socketReconnectTimesRemain = data ? data.socketReconnectTimesRemain : config.SOCKET_RECONNECT_TIMES;
    console.log(e);
    const { lastMsgGetFromSocket } = e;
    console.log(lastMsgGetFromSocket);
    const socketCode = lastMsgGetFromSocket.code;
    const socketIsComplete = lastMsgGetFromSocket.pos_info && lastMsgGetFromSocket.pos_info.complete;
    console.log(`socket is complete: ${socketIsComplete} socket code: ${socketCode}`);
    if ((socketCode === 900 || socketCode === 200 || socketCode === 1006) && !socketIsComplete) {
      await sleep(5000);
      console.log(`Try to reconnect the socket... remain times = ${socketReconnectTimesRemain}`);
      await dispatch(connectSocket({socketReconnectTimesRemain: socketReconnectTimesRemain - 1}));
    }
    console.log("connectSocket catch");
    return rejectWithValue(e.error.message);
  }
});

const openEFTPOSWebSocket = (getStore, dispatch) => {
  return new Promise((resolve, reject) => {
    // console.log(getStore());
    const { Auth, Document } = getStore();
    const { shop, lane, user, device, token } = Auth;
    const { document } = Document;
    const { transactionId } = document;
    const ws_url = `${getWebSocketBaseUrl(config.BASE_URL)}/payment/pos/progress?shopId=${shop.id}&deviceId=${device.device_id}&transactionId=${transactionId}&token=${token}`;
    console.log(ws_url);
    const ws = new WebSocket(ws_url);
    let timer;
    let heartBeatInterval;
    let lastMsgGetFromSocket = {};
    console.log(ws);
    ws.onopen =  e => {
      // Save log
      console.log("ws is open");
      timer = setTimeout(() => {
        console.log("heart bit time out");
        ws.close();
        reject({error: new Error("connection time out"), lastMsgGetFromSocket});
        // Save log
      },3000);
      ws.send(new Date().toString());
      heartBeatInterval = setInterval(() => {
        ws.send(new Date().toString());
      }, 500);
    };

    ws.onmessage = e => {
      let res = JSON.parse(e.data);
      if (res.code !== 204) {
        lastMsgGetFromSocket = res;
      }
      clearTimeout(timer);
      const {isCompleted, isAccepted, arrayContent} = processWSMessage(res, dispatch);
      if(isAccepted) {
        dispatch(setCurrentTransactionIsAccepted(true));
      }
      if (isCompleted) {
        // dispatch(resetTransactionId());
        console.log("got completed message from socket");
        console.log({isCompleted, isAccepted, arrayContent});
        clearInterval(heartBeatInterval);
        if (isAccepted) {
          resolve({lastMessage: lastMsgGetFromSocket, msg:"Transaction approved"});
        } else {
          reject({error: new Error(arrayContent.toString()), lastMsgGetFromSocket});
        }
        ws.close(1000);
      }
      timer = setTimeout(() => {
        reject({error: new Error("Connection time out"), lastMsgGetFromSocket});
        // Save log
      }, 3000);
      // Save log
    };
    ws.onerror = e => {
      // Save log
      console.log("socket error");
      console.log(JSON.stringify(e));
      clearInterval(heartBeatInterval);
      reject({e, lastMsgGetFromSocket});
    };
    ws.onclose = e => {
      console.log("socket closed");
      console.log(JSON.stringify(e));
      clearInterval(heartBeatInterval);
      clearTimeout(timer);
      // save log
      resolve({lastMessage: lastMsgGetFromSocket, msg:"socket is closed by server"});
    };
  });
};

const processWSMessage = (message, dispatch) => {
  let arrayContent = [], arrayBTNs = [];
  let isCompleted = false;
  let isAccepted =  false;
  let isCreditCard, cardType, surchargeAmount;
  if (message.code === 204) return {isCompleted: isAccepted, arrayContent}; //Ignore 204 code
  // if (message.pos_info) {
  //   isCompleted = true;
  // }
  // dispatch(setLastMessage(message));
  if ( message.code === 200 ) {
    if (!message.pos_info.complete) {
      isCompleted = false;
      //UNCOMPLETED
      arrayContent = message.pos_info.process.lines;
      arrayBTNs = message.pos_info.process.buttons;
    } else {
      isCompleted = true;
      if (!message.pos_info.recipe.accept) {
        //COMPLETED FAILURE
        arrayContent = message.pos_info.recipe.lines;
        isAccepted = false;
      } else {
        //COMPLETED SUCCESS
        arrayContent = message.pos_info.recipe.lines;
        isAccepted = true;
        isCreditCard = message.pos_info.recipe.credit_card;
        cardType = message.pos_info.recipe.card_type;
        surchargeAmount = message.pos_info.recipe.surcharge_amount || 0;
      }
      setTimeout(() => {
        dispatch(setMessageBox({visible: false}));
      }, 1000);
    }

  } else if (message.code === 1100) {
    //Alert Error
    arrayContent = [message.msg];
  } else {
    arrayContent = [message.msg];
    //Alert Error message.error(message.msg)
  }
  let messageBox = {
    title: "EFTPOS PROCESS",
    contentList: arrayContent,
    btnList: arrayBTNs,
    processing: "Connecting",
    visible: true,
  };
  dispatch(setMessageBox(messageBox));
  // console.log("Completed message process");
  return {isCompleted, isAccepted, isCreditCard, cardType, surchargeAmount, arrayContent};
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
    }
    // setDocumentObjInOrder(state, action) {
    //   state.documentObjInOrder = action.payload;
    // },
    // setCurrentDocument(state, action) {
    //   state.currentDocument = action.payload;
    // },
    // setShowCashier(state, action) {
    //   state.showCashier = action.payload;
    // },
  },
  extraReducers: {
    [fetchDocument.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [fetchDocument.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      // state.document = action.payload.data;
      state.document = new Document(action.payload.data);

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
      console.log("processEFTPOS pending");
    },
    [processEFTPOS.fulfilled]: (state, action) => {

      console.log("processEFTPOS fulfilled");
    },
    [processEFTPOS.rejected]: (state, action) => {
      console.error("processEFTPOS rejected");
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
    }


  },
});

// export const { } = DocumentSlice.actions;
// export const selectCashierStatus = (state) => state.Document.showCashier;
export const { setCurrentTransactionId, resetTransactionId, setCurrentTransactionIsAccepted, setLastMessage, resetLastMessage } = DocumentSlice.actions;

export const selectDocument = (state) => state.Document.document;

export default DocumentSlice.reducer;
