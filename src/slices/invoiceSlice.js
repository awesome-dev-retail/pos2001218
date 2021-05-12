import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../configs/index";
// import { CacheStorage, message } from "../lib";
import { tableListRequest } from "../services";
import axios from "axios";
// import { history } from "../App";

const initialState = {
  // tableList: [],
  // table: null,
  // addedTable: null,
  invoice: null,
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
export const calculateInvoice = createAsyncThunk("invoice/calculateInvoice", async (invoice, { rejectWithValue }) => {
  try {
    const res = await axios({
      method: "post",
      url: "https://pos-restaurant-be-dev.azurewebsites.net/pos/data/invoice/calculate",
      headers: { Authorization: "Bearer XCkfD775gu0EBNuC3FjigQ==" },
      data: invoice,
    });
    if (res.error) throw res.error;
    console.log("calculateInvoice--------------", res);

    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

// export const fetchTableListInArea = createAsyncThunk("table/fetchTableListInArea", async ({ shopId, areaId }, { rejectWithValue }) => {
//   try {
//     console.log("-----areaId--- ------", areaId);
//     const res = await axios({
//       url: `https://pos-restaurant-be-dev.azurewebsites.net/pos/data/dinner_table/list_in_area?shopId=${shopId}&areaId=${areaId}`,
//       headers: { Authorization: "Bearer hT8t8ndaNBRgBBa25588ZA==" },
//     });
//     if (res.error) throw res.error;
//     console.log("fetchTableListInArea--------------", res);

//     return res;
//   } catch (e) {
//     return rejectWithValue(e.message);
//   }
// });

// export const fetchTableById = createAsyncThunk("table/fetchTableById", async (tableId, { rejectWithValue }) => {
//   try {
//     const res = await axios({
//       url: `https://pos-restaurant-be-dev.azurewebsites.net/pos/data/dinner_table/${tableId}`,
//       headers: { Authorization: "Bearer hT8t8ndaNBRgBBa25588ZA==" },
//     });
//     if (res.error) throw res.error;
//     console.log("fetchTableById--------------", res);

//     return res;
//   } catch (e) {
//     return rejectWithValue(e.message);
//   }
// });

// export const saveTable = createAsyncThunk("table/saveTable", async (tableObj, { rejectWithValue }) => {
//   try {
//     const res = await axios({
//       method: "post",
//       url: "https://pos-restaurant-be-dev.azurewebsites.net/pos/data/dinner_table/save",
//       headers: { Authorization: "Bearer hT8t8ndaNBRgBBa25588ZA==" },
//       data: tableObj,
//     });
//     if (res.error) throw res.error;
//     console.log("saveTable--------------", res);
//     return res;
//   } catch (e) {
//     return rejectWithValue(e.message);
//   }
// });

// export const deleteTable = createAsyncThunk("table/deleteTable", async (id, { rejectWithValue }) => {
//   try {
//     const res = await axios({
//       method: "delete",
//       url: `https://pos-restaurant-be-dev.azurewebsites.net/pos/data/dinner_table/delete/${id}`,
//       headers: { Authorization: "Bearer hT8t8ndaNBRgBBa25588ZA==" },
//     });
//     if (res.error) throw res.error;
//     console.log("deleteTable--------------", res);
//     return res;
//   } catch (e) {
//     return rejectWithValue(e.message);
//   }
// });

const InvoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    // setTableList: (state, action) => {
    //   state.tableList = action.payload;
    // },
    // setInvoice: (state, action) => {
    //   state.invoice = action.payload;
    // },
  },
  extraReducers: {
    [calculateInvoice.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [calculateInvoice.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.invoice = action.payload.data.data;
      // state.tableList = action.payload.data.data.list;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [calculateInvoice.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
  },
});
export const { setInvoice } = InvoiceSlice.actions;
// export const selectTableList = (state) => state.Table.tableList;
export const selectInvoice = (state) => state.Invoice.invoice;
// export const selectTableById = (state) => state.Table.table;

export default InvoiceSlice.reducer;
