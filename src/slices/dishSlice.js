import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../configs/index";
import { history } from "../components/MyRouter";

import CacheStorage from "../lib/cache-storage";

// import { CacheStorage, message } from "../lib";
import { dishListRequest, dishListInMenuRequest, saveDishRequest, deleteDishRequest, calculateInvoiceRequest, saveInvoiceRequest } from "../services";
import axios from "axios";
import { createDishObjInOrder } from "../services/createDishObjInOrder";

const initialState = {
  dish: [],
  dishObjInOrder: [],
  // addedDish: null,
  invoice: {},
  showCashier: false,
  currentDish: {},
  status: "",
  error: null,
};

// export const dishListRequest = (shopId: any) => {
//   return api.request({
//     url: `/pos/data/dish/list_in_shop?shopId=${shopId}`,
//     method: "get",
//     headers: {
//       Authorization: "2fse783mcEIlui4pN5i7WQ==",
//     },
//   });
// };
export const fetchDishListInShop = createAsyncThunk("dish/fetchDishListInShop", async (shopId, { rejectWithValue }) => {
  try {
    const res = await dishListRequest(shopId);
    if (res.error) throw res.error;
    console.log("fetchDishListInShop--------------", res);

    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchDishListInMenu = createAsyncThunk("dish/fetchDishListInMenu", async (menuId, { rejectWithValue }) => {
  try {
    const res = await dishListInMenuRequest(menuId);
    if (res.error) throw res.error;
    console.log("fetchDishListInMenu--------------", res);

    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const saveDish = createAsyncThunk("dish/saveDish", async (dishObj, { rejectWithValue }) => {
  try {
    const res = await saveDishRequest(dishObj);
    if (res.error) throw res.error;
    console.log("saveDish--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const deleteDish = createAsyncThunk("dish/deleteDish", async (dishID, { rejectWithValue }) => {
  try {
    const res = await deleteDishRequest(dishID);
    if (res.error) throw res.error;
    console.log("deleteDish--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const calculateInvoice = createAsyncThunk("dish/calculateInvoice", async (invoice, { rejectWithValue }) => {
  try {
    const res = await calculateInvoiceRequest(invoice);
    if (res.error) throw res.error;
    console.log("calculateInvoice--------------", res);

    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const saveInvoice = createAsyncThunk("dish/saveInvoice", async (table, { rejectWithValue }) => {
  try {
    const copyInvoice = CacheStorage.getItem("invoice_" + "1_" + table.id);
    console.log("++++++++++++++++++++", copyInvoice);
    const res = await saveInvoiceRequest(copyInvoice);
    if (res.error) throw res.error;
    history.push(`/order/payment/${res.data.InvoiceID}`);

    console.log("saveInvoice--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const DishSlice = createSlice({
  name: "dish",
  initialState,
  reducers: {
    setDishObjInOrder(state, action) {
      state.dishObjInOrder = action.payload;
    },
    setCurrentDish(state, action) {
      state.currentDish = action.payload;
    },
    clearCheckedDish(state, action) {
      state.dishObjInOrder.forEach((item) => {
        item.checked = false;
      });
    },
    setShowCashier(state, action) {
      state.showCashier = action.payload;
    },
    setCurrentInvoice(state, action) {
      state.invoice = action.payload;
    },
  },
  extraReducers: {
    [calculateInvoice.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [calculateInvoice.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.invoice = action.payload.data;
      const copydishObjInOrder = JSON.parse(JSON.stringify(state.dishObjInOrder));
      state.dishObjInOrder = createDishObjInOrder(state, copydishObjInOrder);

      CacheStorage.setItem("dishObjInOrder_" + "1_" + state.invoice.TableID, state.dishObjInOrder);
      CacheStorage.setItem("invoice_" + "1_" + state.invoice.TableID, state.invoice);
      // console.log(CacheStorage.getItem("invoice_" + "1_" + res.data.TableID));

      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [calculateInvoice.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
    [saveInvoice.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [saveInvoice.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.invoice = action.payload.data;
      CacheStorage.setItem("invoice_" + "1_" + state.invoice.TableID, state.invoice);

      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [calculateInvoice.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
    [fetchDishListInShop.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [fetchDishListInShop.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.dish = action.payload.data.list;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [fetchDishListInShop.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
    [fetchDishListInMenu.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [fetchDishListInMenu.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.dish = action.payload.data.list;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [fetchDishListInMenu.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
    // [fetchDishListInArea.pending]: (state) => {
    //   state.status = config.API_STATUS.LOADING;
    // },
    // [fetchDishListInArea.fulfilled]: (state, action) => {
    //   state.status = config.API_STATUS.SUCCEEDED;
    //   state.dish = action.payload.data.data.list;
    //   // state.dish = action.payload.data.data.list;
    //   state.error = null;
    //   // state.token = action.payload.token;
    //   // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
    //   // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    // },
    // [fetchDishListInArea.rejected]: (state, action) => {
    //   state.status = config.API_STATUS.FAILED;
    //   // message.error(action.payload);
    // },
    [saveDish.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [saveDish.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.dish = action.payload.data.list;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [saveDish.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
    [deleteDish.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [deleteDish.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      // state.dish = action.payload;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [deleteDish.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
  },
});

export const { setDishObjInOrder, setCurrentDish, clearCheckedDish, setShowCashier, setCurrentInvoice } = DishSlice.actions;

export const selectInvoice = (state) => state.Dish.invoice;
export const selectCashierStatus = (state) => state.Dish.showCashier;

export const selectDishList = (state) => state.Dish.dish;
export const selectCurrentDish = (state) => state.Dish.currentDish;
export const selectDishObjInOrder = (state) => state.Dish.dishObjInOrder;

export default DishSlice.reducer;
