import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../configs/index";
// import { CacheStorage, message } from "../lib";
import { tableListInShopRequest, tableListInAreaRequest, tableByIdRequest, saveTableRequest, deleteTableRequest, startTableRequest, endTableRequest } from "../services";
import axios from "axios";
import CacheStorage from "../lib/cache-storage";
// import { history } from "../App";

const initialState = {
  tableList: [],
  copyTableListInShop: [],
  tableListInArea: [],
  table: null,
  tableInfo: null,
  status: "",
  error: null,
};

export const fetchTableListInShop = createAsyncThunk("table/fetchTableListInShop", async (shopId, { rejectWithValue }) => {
  try {
    const res = await tableListInShopRequest(shopId);
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
    const res = await tableListInAreaRequest({ shopId, areaId });
    if (res.error) throw res.error;
    console.log("fetchTableListInArea--------------", res);

    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchTableById = createAsyncThunk("table/fetchTableById", async (tableId, { rejectWithValue }) => {
  try {
    const res = await tableByIdRequest(tableId);
    if (res.error) throw res.error;
    console.log("fetchTableById--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const saveTable = createAsyncThunk("table/saveTable", async (tableObj, { rejectWithValue }) => {
  try {
    const res = await saveTableRequest(tableObj);
    if (res.error) throw res.error;
    console.log("saveTable--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const deleteTable = createAsyncThunk("table/deleteTable", async (tableId, { rejectWithValue }) => {
  try {
    const res = await deleteTableRequest(tableId);
    if (res.error) throw res.error;
    console.log("deleteTable--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const startTable = createAsyncThunk("table/startTable", async (tableId, { rejectWithValue }) => {
  try {
    const res = await startTableRequest(tableId);
    if (res.error) throw res.error;
    console.log("endTable--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const endTable = createAsyncThunk("table/endTable", async (tableId, { rejectWithValue }) => {
  try {
    const res = await endTableRequest(tableId);
    if (res.error) throw res.error;
    console.log("endTable--------------", res);
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
    setTableListInArea: (state, action) => {
      state.tableList = state.copyTableListInShop.filter((item) => item.area_id === action.payload);
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
      state.tableList = action.payload.data.list;
      state.copyTableListInShop = JSON.parse(JSON.stringify(state.tableList));
      let totalAmount = 0;
      const newTableList = state.copyTableListInShop.map((item) => {
        const dishObjInOrder = CacheStorage.getItem("dishObjInOrder_" + "1_" + item.id);
        if (!!dishObjInOrder) {
          dishObjInOrder.forEach((i) => (totalAmount += i.Amount));
        } else {
          totalAmount = 0;
        }
        item.totalAmount = totalAmount;
        return item;
      });
      state.tableList = newTableList;
      state.error = null;
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
      state.tableList = action.payload.data.list;
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
      state.table = action.payload.data;
      state.error = null;
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
      state.table = action.payload.data;
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
    [startTable.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [startTable.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      // state.tableList = action.payload;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [startTable.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
    [endTable.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [endTable.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      // state.tableList = action.payload;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [endTable.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
  },
});
export const { setTableList, setTable, setTableListInArea } = TableSlice.actions;
export const selectTableList = (state) => state.Table.tableList;
export const selectTable = (state) => state.Table.table;
export const selectTableInfo = (state) => state.Table.tableInfo;
// export const selectTableById = (state) => state.Table.table;

export default TableSlice.reducer;
