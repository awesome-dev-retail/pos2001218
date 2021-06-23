import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import CONSTANT from "../configs/CONSTANT";

const initialState = {
  messageBox: {},
  errorBox: {
    // visible: true,
    // title: "Transaction Error",
    // content: "dfdfd",
    // onCloseFunc: resetErrorBox,
    // btnList: [],
  },
  status: CONSTANT.API_STATUS.IDLE,
  globalLoading: false,
};

const publicComponentSlice = createSlice({
  name: "public-component",
  initialState,
  reducers: {
    setMessageBox(state, action) {
      state.messageBox = action.payload;
    },
    resetMessageBox(state, action) {
      state.messageBox = {};
    },
    setErrorBox(state, action) {
      state.errorBox = action.payload;
    },
    resetErrorBox(state, action) {
      state.errorBox = {};
    },
    setPageLoading(state, action) {
      state.globalLoading = action.payload;
    }
  }
});

export const { setMessageBox, setErrorBox, resetErrorBox, resetMessageBox, setPageLoading } = publicComponentSlice.actions;


export const selectMessageBox = state => state.PublicComponent.messageBox;
export const selectErrorBox = state => state.PublicComponent.errorBox;
export const selectGlobalLoading = state => state.PublicComponent.globalLoading;

export default publicComponentSlice.reducer;