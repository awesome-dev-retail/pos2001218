import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import CONSTANT from "../configs/CONSTANT";
import { loginRequest, listShops, listLanes, getCurrentUser, logout } from "../services";
import { UserCredential } from "../configs/data";
import CacheStorage from "../lib/cache-storage";
import { message } from "antd";
// import history from "../components/history";
import { history } from "../components/MyRouter";

const initialState = {
  user: null,
  token: null,
  status: CONSTANT.API_STATUS.IDLE,
  error: null,
  shops: [],
  devices: [],
  lanes: [],
};

export const fetchShopList = createAsyncThunk("user/fetchShops", async (data, { rejectWithValue }) => {
  try {
    const res = await listShops();
    return res;
    console.log(res);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchLaneList = createAsyncThunk("user/fetchLanes", async (data, { rejectWithValue }) => {
  try {
    const res = await listLanes();
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const loginToServer = createAsyncThunk("user/login", async (data, { rejectWithValue }) => {
  try {
    // console.log("loginToServer------------");
    // const res = await loginRequest(data);
    // const res = await loginRequest(data);
    const res = await loginRequest(data);

    if (res.error) throw res.error;
    CacheStorage.setItem("token", res.token);
    history.push(CONSTANT.ROUTES.SELECT_SHOP);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const userLogOut = createAsyncThunk("user/userLogOut", async (data, { rejectWithValue }) => {
  try {
    CacheStorage.removeItem("token");
    const res = await logout(data);
    history.push(CONSTANT.ROUTES.LOGIN);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchUser = createAsyncThunk("user/fetchUser", async (data, { rejectWithValue }) => {
  try {
    const res = await getCurrentUser(data);
    CacheStorage.setItem("token", res.token);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    logoutLocally(state) {
      state.user = null;
      state.token = null;
      CacheStorage.removeItem("token");

      //CacheStorage.removeItem(token);

      //Should be replace by using history instead of window hard redirect

      // window.location = "/login";
      // history.push(config.ROUTES.LOGIN);
    },
    setToken(state, action) {
      state.token = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(loginToServer.pending, (state) => {
      state.status = CONSTANT.API_STATUS.LOADING;
    });
    builder.addCase(loginToServer.fulfilled, (state, action) => {
      state.status = CONSTANT.API_STATUS.SUCCEEDED;
      state.user = action.payload.data;
      state.token = action.payload.token;
      // history.push(CONSTANT.ROUTES.SELECT_SHOP);
      // window.location = "/select-shop";
      //Extract token store token
    });
    builder.addCase(userLogOut.fulfilled, (state, action) => {
      state.token = null;
      state.user = null;
      // window.location = "./login";
      //Extract token store token
    });
    // builder.addCase(logOut.rejected, (state, action) => {
    // 	state.token = null;
    // 	state.user = null;
    // 	//Extract token store token
    // });
    builder.addCase(fetchShopList.pending, (state) => {
      state.status = CONSTANT.API_STATUS.LOADING;
    });
    builder.addCase(fetchShopList.fulfilled, (state, action) => {
      state.status = CONSTANT.API_STATUS.SUCCEEDED;
      if (action.payload.data && action.payload.data.list) {
        state.shops = action.payload.data.list;
      } else {
        state.shops = [];
      }

      //Extract token store token
    });
    builder.addCase(fetchLaneList.pending, (state) => {
      state.status = CONSTANT.API_STATUS.LOADING;
    });
    builder.addCase(fetchLaneList.fulfilled, (state, action) => {
      state.status = CONSTANT.API_STATUS.SUCCEEDED;
      if (action.payload.data && action.payload.data.list) {
        state.lanes = action.payload.data.list;
      } else {
        state.lanes = [];
      }

      //Extract token store token
    });
    builder.addCase(fetchUser.pending, (state, action) => {
      state.status = CONSTANT.API_STATUS.LOADING;
    });

    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.status = CONSTANT.API_STATUS.SUCCEEDED;
      state.user = action.payload.data;
      state.token = action.payload.token;
      //Extract token store token
    });

    // Error handle
  },
});

export const { setUser, logoutLocally, setToken } = authSlice.actions;

export const selectUserToken = (state) => state.Auth.token;
export const selectIsLogin = (state) => state.Auth.user;
export const selectCurrentUser = (state) => state.Auth.user;
export const selectShops = (state) => state.Auth.shops;
export const selectLanes = (state) => state.Auth.lanes;
export const selectAuthIsLoading = (state) => state.Auth.status === CONSTANT.API_STATUS.LOADING || state.Auth.status === CONSTANT.API_STATUS.IDLE;

export default authSlice.reducer;
