import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../configs/index";
// import { CacheStorage, message } from "../lib";
import { tableListRequest } from "../services";
import axios from "axios";
// import { history } from "../App";

const initialState = {
  tableList: [],
  table: null,
  // addedTable: null,
  status: "",
  error: null,
};

// export const tableListRequest = (shopId: any) => {
//   return api.request({
//     url: `/pos/data/table/list_in_shop?shopId=${shopId}`,
//     method: "get",
//     headers: {
//       Authorization: "2fse783mcEIlui4pN5i7WQ==",
//     },
//   });
// };
export const fetchTableListInShop = createAsyncThunk("table/fetchTableListInShop", async (id, { rejectWithValue }) => {
  try {
    const res = await axios({
      url: `https://pos-restaurant-be-dev.azurewebsites.net/pos/data/dinner_table/list_in_shop?shopId=${id}`,
      headers: { Authorization: "Bearer USB9RbmRlv4EiLxEShlXRQ==" },
    });
    if (res.error) throw res.error;
    console.log("fetchTableListInShop--------------", res);

    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchTableListInArea = createAsyncThunk("table/fetchTableListInArea", async ({ shopId, areaId }, { rejectWithValue }) => {
  try {
    console.log("-----areaId--- ------", areaId);
    const res = await axios({
      url: `https://pos-restaurant-be-dev.azurewebsites.net/pos/data/dinner_table/list_in_area?shopId=${shopId}&areaId=${areaId}`,
      headers: { Authorization: "Bearer USB9RbmRlv4EiLxEShlXRQ==" },
    });
    if (res.error) throw res.error;
    console.log("fetchTableListInArea--------------", res);

    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchTableById = createAsyncThunk("table/fetchTableById", async (tableId, { rejectWithValue }) => {
  try {
    const res = await axios({
      url: `https://pos-restaurant-be-dev.azurewebsites.net/pos/data/dinner_table/${tableId}`,
      headers: { Authorization: "Bearer USB9RbmRlv4EiLxEShlXRQ==" },
    });
    if (res.error) throw res.error;
    console.log("fetchTableById--------------", res);

    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const saveTable = createAsyncThunk("table/saveTable", async (tableObj, { rejectWithValue }) => {
  try {
    const res = await axios({
      method: "post",
      url: "https://pos-restaurant-be-dev.azurewebsites.net/pos/data/dinner_table/save",
      headers: { Authorization: "Bearer USB9RbmRlv4EiLxEShlXRQ==" },
      data: tableObj,
    });
    if (res.error) throw res.error;
    console.log("saveTable--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const deleteTable = createAsyncThunk("table/deleteTable", async (id, { rejectWithValue }) => {
  try {
    const res = await axios({
      method: "delete",
      url: `https://pos-restaurant-be-dev.azurewebsites.net/pos/data/dinner_table/delete/${id}`,
      headers: { Authorization: "Bearer USB9RbmRlv4EiLxEShlXRQ==" },
    });
    if (res.error) throw res.error;
    console.log("deleteTable--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const TableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setTableList: (state, action) => {
      state.tableList = action.payload;
    },
    setTable: (state, action) => {
      state.table = action.payload;
    },
  },
  extraReducers: {
    [fetchTableListInShop.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [fetchTableListInShop.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.tableList = action.payload.data.data.list;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [fetchTableListInShop.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
    [fetchTableListInArea.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [fetchTableListInArea.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.tableList = action.payload.data.data.list;
      // state.tableList = action.payload.data.data.list;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [fetchTableListInArea.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
    [fetchTableById.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [fetchTableById.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.table = action.payload.data.data;
      // state.tableList = action.payload.data.data.list;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [fetchTableById.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
    [saveTable.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [saveTable.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.table = action.payload.data.data;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [saveTable.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
    [deleteTable.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [deleteTable.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      // state.tableList = action.payload;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [deleteTable.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
  },
});
export const { setTableList, setTable } = TableSlice.actions;
export const selectTableList = (state) => state.Table.tableList;
export const selectTable = (state) => state.Table.table;
// export const selectTableById = (state) => state.Table.table;

export default TableSlice.reducer;
