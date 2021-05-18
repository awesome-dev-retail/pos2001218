import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../configs/index";
import { menuListRequest, saveMenuRequest, deleteMenuRequest } from "../services";
// import { CacheStorage, message } from "../lib";
// import { menuListRequest } from "../services";
import axios from "axios";
// import { history } from "../App";

const initialState = {
  menu: [],
  menuId: 0,
  // addedMenu: null,
  status: "",
  error: null,
};

// export const menuListRequest = (shopId: any) => {
//   return api.request({
//     url: `/pos/data/menu/list_in_shop?shopId=${shopId}`,
//     method: "get",
//     headers: {
//       Authorization: "2fse783mcEIlui4pN5i7WQ==",
//     },
//   });
// };
export const fetchMenuList = createAsyncThunk("menu/fetchMenuList", async (shopId, { rejectWithValue }) => {
  try {
    const res = await menuListRequest(shopId);
    if (res.error) throw res.error;
    console.log("fetchMenuList--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const saveMenu = createAsyncThunk("menu/saveMenu", async (menuObj, { rejectWithValue }) => {
  try {
    const res = await saveMenuRequest(menuObj);
    if (res.error) throw res.error;
    console.log("saveMenu--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const deleteMenu = createAsyncThunk("menu/deleteMenu", async (menuId, { rejectWithValue }) => {
  try {
    const res = await deleteMenuRequest(menuId);
    if (res.error) throw res.error;
    console.log("deleteMenu--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const MenuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenuIdInSlice(state, action) {
      state.menuId = action.payload;
    },
  },
  extraReducers: {
    [fetchMenuList.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [fetchMenuList.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.menu = action.payload.data.list;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [fetchMenuList.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
    [saveMenu.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [saveMenu.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.menuId = action.payload.data.id;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [saveMenu.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
    [deleteMenu.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [deleteMenu.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      // state.menu = action.payload;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [deleteMenu.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
  },
});

export const { setMenuIdInSlice } = MenuSlice.actions;

export const selectMenuList = (state) => state.Menu.menu;
export const selectMenuId = (state) => state.Menu.menuId;

export default MenuSlice.reducer;
