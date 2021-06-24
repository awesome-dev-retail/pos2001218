import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../configs/index";
import { history } from "../components/MyRouter";

import CacheStorage from "../lib/cache-storage";
import { message } from "../lib";

import { stockListRequest, saveStockRequest, deleteStockRequest } from "../services";

const initialState = {
  // stock: {},
  stockList: [],
  selectedExtras: [],
  status: "",
  error: null,
};

export const fetchStockListInShop = createAsyncThunk("stock/fetchStockListInShop", async (cid, { rejectWithValue }) => {
  try {
    const res = await stockListRequest(cid);
    if (res.error) throw res.error;
    console.log("fetchStockListInShop--------------", res);

    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const saveStock = createAsyncThunk("stock/saveStock", async (stock, { dispatch, rejectWithValue }) => {
  try {
    const res = await saveStockRequest(stock);
    if (res.error) throw res.error;
    dispatch(fetchStockListInShop(0));
    console.log("saveStock--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const deleteStock = createAsyncThunk("stock/deleteStock", async (stockID, { dispatch, rejectWithValue }) => {
  try {
    const res = await deleteStockRequest(stockID);
    if (res.error) throw res.error;
    dispatch(fetchStockListInShop(0));
    console.log("deleteStock--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const StockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    getSelectedExtras(state, action) {
      state.selectedExtras = state.stockList.filter((i) => action.payload.indexOf(i.id) > -1);
    },
  },
  extraReducers: {
    [fetchStockListInShop.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [fetchStockListInShop.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.stockList = action.payload.data.list;
      // debugger;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [fetchStockListInShop.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },

    [saveStock.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [saveStock.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.stock = action.payload.data.list;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [saveStock.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
    [deleteStock.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [deleteStock.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      // state.stock = action.payload;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [deleteStock.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
  },
});

export const { getSelectedExtras, setStockObjInOrder, setCurrentLine, clearCheckedStock, setShowCashier, setInvoice } = StockSlice.actions;

export const selectStockList = (state) => state.Stock.stockList;
export const selectExtras = (state) => state.Stock.selectedExtras;

export default StockSlice.reducer;
