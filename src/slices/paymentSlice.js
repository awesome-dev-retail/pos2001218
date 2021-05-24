import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../configs/index";
import CacheStorage from "../lib/cache-storage";

// import { CacheStorage, message } from "../lib";
import { savePaymentRequest } from "../services";
import axios from "axios";
// import { history } from "../App";

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

      // const copyPayment = JSON.parse(JSON.stringify(state.payment));

      // CacheStorage.setItem("Payment_" + "1_" + copyPayment.id, copyPayment);

      // console.log("copyPayment from localstorage----------------", CacheStorage.getItem("Payment_" + "1_" + copyPayment.id));
      // state.tableList = action.payload.data.data.list;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [savePayment.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
  },
});

// export const { } = PaymentSlice.actions;
// export const selectCashierStatus = (state) => state.Payment.showCashier;

export const selectPayment = (state) => state.Payment.payment;

export default PaymentSlice.reducer;
