import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../configs/index";
import { history } from "../components/MyRouter";

import CacheStorage from "../lib/cache-storage";
import { message } from "../lib";

import { commentListRequest, saveCommentRequest, deleteCommentRequest } from "../services";

const initialState = {
  // comment: {},
  commentList: [],
  status: "",
  error: null,
};

export const fetchCommentListInShop = createAsyncThunk("comment/fetchCommentListInShop", async (cid, { rejectWithValue }) => {
  try {
    const res = await commentListRequest(cid);
    if (res.error) throw res.error;
    console.log("fetchCommentListInShop--------------", res);

    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const saveComment = createAsyncThunk("comment/saveComment", async (comment, { dispatch, rejectWithValue }) => {
  try {
    const res = await saveCommentRequest(comment);
    if (res.error) throw res.error;
    dispatch(fetchCommentListInShop(0));
    console.log("saveComment--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const deleteComment = createAsyncThunk("comment/deleteComment", async (commentID, { dispatch, rejectWithValue }) => {
  try {
    const res = await deleteCommentRequest(commentID);
    if (res.error) throw res.error;
    dispatch(fetchCommentListInShop(0));
    console.log("deleteComment--------------", res);
    return res;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const CommentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    setComment(state, action) {
      state.comment = action.payload;
    },
  },
  extraReducers: {
    [fetchCommentListInShop.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [fetchCommentListInShop.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.commentList = action.payload.data.list;
      // debugger;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [fetchCommentListInShop.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },

    [saveComment.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [saveComment.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      state.comment = action.payload.data.list;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [saveComment.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
    [deleteComment.pending]: (state) => {
      state.status = config.API_STATUS.LOADING;
    },
    [deleteComment.fulfilled]: (state, action) => {
      state.status = config.API_STATUS.SUCCEEDED;
      // state.comment = action.payload;
      state.error = null;
      // state.token = action.payload.token;
      // CacheStorage.setItem(config.TOKEN_SYMBOL, action.payload.token);
      // CacheStorage.setItem(config.TOKEN_IS_ADMIN, false);
    },
    [deleteComment.rejected]: (state, action) => {
      state.status = config.API_STATUS.FAILED;
      // message.error(action.payload);
    },
  },
});

export const { setCommentObjInOrder, setCurrentLine, clearCheckedComment, setShowCashier, setInvoice } = CommentSlice.actions;

export const selectCommentList = (state) => state.Comment.commentList;

export default CommentSlice.reducer;
