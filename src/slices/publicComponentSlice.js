import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import CONSTANT from "../configs/CONSTANT";

const initialState = {
  messageBox: {},
  status: CONSTANT.API_STATUS.IDLE,
};

const publicComponentSlice = createSlice({
  name: "public-component",
  initialState,
  reducers: {
    setMessageBox(state, action) {
      state.messageBox = action.payload;
    }
  }
});

export const { setMessageBox } = publicComponentSlice.actions;


export const selectMessageBox = state => state.PublicComponent.messageBox;

export default publicComponentSlice.reducer;