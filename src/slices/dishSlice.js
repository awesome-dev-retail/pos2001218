import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../configs/index";
// import { CacheStorage, message } from "../lib";
import { dishListRequest } from "../services";
import axios from "axios";
// import { history } from "../App";

const initialState = {
  dish: [],
  dishObjInOrder: [],
  // addedDish: null,
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
export const fetchDishListInShop = createAsyncThunk("dish/fetchDishListInShop", async (id, { rejectWithValue }) => {
  try {
    const res = await axios({
      url: `https://pos-restaurant-be-dev.azurewebsites.net/pos/data/dish/list_in_shop?shopId=${id}`,
      headers: { Authorization: "Bearer LtCCxMZRBmbqbDpqBDlB7Q==" },
    });
    if (res.error) throw res.error;
    console.log("fetchDishListInShop--------------", res);

    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchDishListInMenu = createAsyncThunk("dish/fetchDishListInMenu", async (menuId, { rejectWithValue }) => {
  try {
    console.log("-------menuId-------", menuId);
    const res = await axios({
      url: `https://pos-restaurant-be-dev.azurewebsites.net/pos/data/dish/list_in_shop?classId=${menuId}`,
      headers: { Authorization: "Bearer LtCCxMZRBmbqbDpqBDlB7Q==" },
    });
    if (res.error) throw res.error;
    console.log("fetchDishListInMenu--------------", res);

    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const saveDish = createAsyncThunk("dish/saveDish", async (dishObj, { rejectWithValue }) => {
  try {
    const res = await axios({
      method: "post",
      url: "https://pos-restaurant-be-dev.azurewebsites.net/pos/data/dish/save",
      headers: { Authorization: "Bearer LtCCxMZRBmbqbDpqBDlB7Q==" },
      data: dishObj,
    });
    if (res.error) throw res.error;
    console.log("saveDish--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const deleteDish = createAsyncThunk("dish/deleteDish", async (id, { rejectWithValue }) => {
  try {
    const res = await axios({
      method: "delete",
      url: `https://pos-restaurant-be-dev.azurewebsites.net/pos/data/dish/delete/${id}`,
      headers: { Authorization: "Bearer LtCCxMZRBmbqbDpqBDlB7Q==" },
    });
    if (res.error) throw res.error;
    console.log("deleteDish--------------", res);
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
    setShowCashier(state, action) {
      state.showCashier = action.payload;
    },
  },
  extraReducers: {
    [fetchDishListInShop.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [fetchDishListInShop.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.dish = action.payload.data.data.list;
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
      state.dish = action.payload.data.data.list;
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
      state.dish = action.payload.data.data.list;
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

export const { setDishObjInOrder, setCurrentDish, setShowCashier } = DishSlice.actions;
export const selectCashierStatus = (state) => state.Dish.showCashier;

export const selectDishList = (state) => state.Dish.dish;
export const selectCurrentDish = (state) => state.Dish.currentDish;
export const selectDishObjInOrder = (state) => state.Dish.dishObjInOrder;

export default DishSlice.reducer;
