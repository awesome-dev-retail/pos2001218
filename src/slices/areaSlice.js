import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../configs/index";
// import { CacheStorage, message } from "../lib";
import { areaListRequest } from "../services";
import axios from "axios";
// import { history } from "../App";

const initialState = {
  area: [],
  areaId: 0,
  addedArea: null,
  status: "",
  error: null,
};

// export const areaListRequest = (shopId: any) => {
//   return api.request({
//     url: `/pos/data/area/list_in_shop?shopId=${shopId}`,
//     method: "get",
//     headers: {
//       Authorization: "2fse783mcEIlui4pN5i7WQ==",
//     },
//   });
// };
export const fetchAreaList = createAsyncThunk("area/fetchAreaList", async (id, { rejectWithValue }) => {
  try {
    const res = await axios({
      url: `https://pos-restaurant-be-dev.azurewebsites.net/pos/data/area/list_in_shop?shopId=${id}`,
      headers: { Authorization: "Bearer P-xnb4rkBisKHmjO7Rmkig==" },
    });
    if (res.error) throw res.error;
    console.log("fetchAreaList--------------", res);

    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const saveArea = createAsyncThunk("area/saveArea", async (areaObj, { rejectWithValue }) => {
  try {
    const res = await axios({
      method: "post",
      url: "https://pos-restaurant-be-dev.azurewebsites.net/pos/data/area/save",
      headers: { Authorization: "Bearer P-xnb4rkBisKHmjO7Rmkig==" },
      data: areaObj,
    });
    if (res.error) throw res.error;
    console.log("saveArea--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const deleteArea = createAsyncThunk("area/deleteArea", async (id, { rejectWithValue }) => {
  try {
    const res = await axios({
      method: "delete",
      url: `https://pos-restaurant-be-dev.azurewebsites.net/pos/data/area/delete/${id}`,
      headers: { Authorization: "Bearer P-xnb4rkBisKHmjO7Rmkig==" },
    });
    if (res.error) throw res.error;
    console.log("deleteArea--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const AreaSlice = createSlice({
  name: "area",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchAreaList.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [fetchAreaList.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.area = action.payload.data.data.list;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [fetchAreaList.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
    [saveArea.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [saveArea.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.areaId = action.payload.data.data.id;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [saveArea.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
    [deleteArea.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [deleteArea.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      // state.area = action.payload;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [deleteArea.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
  },
});

// export const { getAreaId } = AreaSlice.actions;

export const selectAreaList = (state) => state.Area.area;
export const selectAreaId = (state) => state.Area.areaId;

export default AreaSlice.reducer;
