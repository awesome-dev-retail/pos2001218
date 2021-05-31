import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../configs/index";
import CacheStorage from "../lib/cache-storage";

// import { CacheStorage, message } from "../lib";
import { savePaymentRequest, completePaymentRequest } from "../services";
import axios from "axios";
import { message } from "../lib";
import { history } from "../components/MyRouter";

const initialState = {
  payment: {},
  status: "",
  error: null,
};

// export const PaymentListRequest = (shopId: any) => {
//   return api.request({
//     url: `/pos/data/payment/list_in_shop?shopId=${shopId}`,
//     method: "get",
//     headers: {
//       Authorization: "2fse783mcEIlui4pN5i7WQ==",
//     },
//   });
// };
export const savePayment = createAsyncThunk("payment/savePayment", async (payment, { rejectWithValue }) => {
  try {
    const res = await savePaymentRequest(payment);
    if (res.error) throw res.error;
    console.log("savePayment--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const completePayment = createAsyncThunk("payment/completePayment", async ({ invoiceId, tableId }, { rejectWithValue }) => {
  try {
    const res = await completePaymentRequest(invoiceId);
    if (res.error) throw res.error;
    message.success("payment completed successfully!");
    history.push("/");
    CacheStorage.removeItem("dishObjInOrder_" + "1_" + tableId);
    console.log("completePayment--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const PaymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    // setPaymentObjInOrder(state, action) {
    //   state.PaymentObjInOrder = action.payload;
    // },
    // setCurrentPayment(state, action) {
    //   state.currentPayment = action.payload;
    // },
    // setShowCashier(state, action) {
    //   state.showCashier = action.payload;
    // },
  },
  extraReducers: {
    [savePayment.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [savePayment.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.payment = action.payload.data;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [savePayment.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },

    [completePayment.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [completePayment.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.payment = action.payload.data;
      state.error = null;

      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [completePayment.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      message.error(action.payload);
    },
  },
});

// export const { } = PaymentSlice.actions;
// export const selectCashierStatus = (state) => state.Payment.showCashier;

export const selectPayment = (state) => state.Payment.payment;

export default PaymentSlice.reducer;
