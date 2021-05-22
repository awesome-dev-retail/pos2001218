import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../configs/index";
// import { CacheStorage, message } from "../lib";
import { tableListInShopRequest, tableListInAreaRequest, tableByIdRequest, saveTableRequest, deleteTableRequest } from "../services";
import axios from "axios";
import CacheStorage from "../lib/cache-storage";
// import { history } from "../App";

const initialState = {
  tableList: [],
  copyTableListInShop: [],
  tableListInArea: [],
  table: null,
  tableInfo: null,
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
    // initTableInfo: (state, action) => {
    //   state.tableInfo = { unpaidOrder: 0, unpaidAmount: 0, tables: [] };
    // },

    setTableInfoPeopleNum: (state, action) => {
      const copyTableInfo = JSON.parse(JSON.stringify(state.tableInfo));
      copyTableInfo.tables.push(action.payload);
      state.tableInfo = copyTableInfo;
      CacheStorage.setItem("tableInfo", state.tableInfo);
      // CacheStorage.setItem("table_" + "1_" + state.tableInfo.tableId, state.tableInfo);
    },
    removeTableInfoPeopleNum: (state, action) => {
      const currentTable = state.tableInfo.tables.find((i) => i.tableId === action.payload);
      const index = state.tableInfo.tables.indexOf(currentTable);
      debugger;
      state.tableInfo.tables.splice(index, 1);
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

      const newTableList = state.copyTableListInShop.map((item) => {
        const invoice = CacheStorage.getItem("invoice_" + "1_" + item.id);
        if (!!invoice) {
          item.GrossAmount = invoice.GrossAmount;
        } else {
          item.GrossAmount = 0;
          // item.status = "Available";
        }
        if (state.tableInfo) {
          // debugger;
          const currentTable = state.tableInfo.tables.find((i) => i.tableId === item.id);
          item.peopleNum = currentTable ? currentTable.peopleNum : 0;
        } else {
          const tableInfo = CacheStorage.getItem("tableInfo");
          if (tableInfo) {
            state.tableInfo = tableInfo;
            // const copyTableInfo = JSON.parse(JSON.stringify(state.tableInfo));
            const currentTable = tableInfo.tables.find((i) => i.tableId === item.id);
            item.peopleNum = currentTable ? currentTable.peopleNum : 0;
          } else {
            state.tableInfo = { unpaidOrder: 0, unpaidAmount: 0, tables: [] };
            item.peopleNum = 0;
          }
        }
        return item;
      });
      state.tableList = newTableList;
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
  },
});
export const { setTableList, setTable, setTableListInArea, setTableInfoPeopleNum, removeTableInfoPeopleNum } = TableSlice.actions;
export const selectTableList = (state) => state.Table.tableList;
export const selectTable = (state) => state.Table.table;
// export const selectTableById = (state) => state.Table.table;

export default TableSlice.reducer;
