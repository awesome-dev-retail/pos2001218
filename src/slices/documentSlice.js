import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../configs/index";
import CacheStorage from "../lib/cache-storage";

// import { CacheStorage, message } from "../lib";
import { fetchDocumentRequest } from "../services";
import axios from "axios";
// import { history } from "../App";

const initialState = {
  document: {},
  documentObjInOrder: [],
  showCashier: false,
  currentDocument: {},
  status: "",
  error: null,
};

// export const documentListRequest = (shopId: any) => {
//   return api.request({
//     url: `/pos/data/document/list_in_shop?shopId=${shopId}`,
//     method: "get",
//     headers: {
//       Authorization: "2fse783mcEIlui4pN5i7WQ==",
//     },
//   });
// };
export const fetchDocument = createAsyncThunk("document/fetchDocument", async (invoiceID, { rejectWithValue }) => {
  try {
    const res = await fetchDocumentRequest(invoiceID);
    if (res.error) throw res.error;
    console.log("fetchDocument--------------", res);

    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const DocumentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    // setDocumentObjInOrder(state, action) {
    //   state.documentObjInOrder = action.payload;
    // },
    // setCurrentDocument(state, action) {
    //   state.currentDocument = action.payload;
    // },
    // setShowCashier(state, action) {
    //   state.showCashier = action.payload;
    // },
  },
  extraReducers: {
    [fetchDocument.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [fetchDocument.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.document = action.payload.data;
      const copyDocument = JSON.parse(JSON.stringify(state.document));

      CacheStorage.setItem("document_" + "1_" + copyDocument.id, copyDocument);

      console.log("copyDocument from localstorage----------------", CacheStorage.getItem("document_" + "1_" + copyDocument.id));
      // state.tableList = action.payload.data.data.list;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [fetchDocument.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
  },
});

// export const { } = DocumentSlice.actions;
// export const selectCashierStatus = (state) => state.Document.showCashier;

export const selectDocument = (state) => state.Document.document;

export default DocumentSlice.reducer;
