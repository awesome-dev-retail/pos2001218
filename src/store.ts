import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import areaReducer from "./slices/areaSlice";
import tableReducer from "./slices/tableSlice";
import menuReducer from "./slices/menuSlice";
import dishReducer from "./slices/dishSlice";
import documentReducer from "./slices/documentSlice";
import publicComponentReduer from "./slices/publicComponentSlice";
// import invoiceReducer from "./slices/invoiceSlice";

export default configureStore({
  reducer: {
    Auth: authReducer,
    Area: areaReducer,
    Table: tableReducer,
    Menu: menuReducer,
    Dish: dishReducer,
    Document: documentReducer,
    PublicComponent: publicComponentReduer,
    // Invoice: invoiceReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [
        "user/fetchUser/fulfilled",

        "area/fetchAreaList/fulfilled",
        "area/saveArea/fulfilled",
        "area/deleteArea/fulfilled",

        "table/saveTable/fulfilled",
        "table/deleteTable/fulfilled",
        "table/fetchTableListInShop/fulfilled",
        "table/fetchTableListInArea/fulfilled",
        "table/fetchTableById/fulfilled",

        "menu/fetchMenuList/fulfilled",
        "menu/saveMenu/fulfilled",
        "menu/deleteMenu/fulfilled",

        "dish/fetchDishList/fulfilled",
        "dish/fetchDishListInShop/fulfilled",
        "dish/fetchDishListInMenu/fulfilled",
        "dish/saveDish/fulfilled",
        "dish/deleteDish/fulfilled",

        "dish/calculateInvoice/fulfilled",
        "dish/saveInvoice/fulfilled",

        "document/fetchDocument/pending",
        "document/fetchDocument/fulfilled",

        "document/processEFTPOS/fulfilled",
        "document/processEFTPOS/pending",
        "document/processEFTPOS/rejected",

        "document/connectSocket/pending",
        "document/connectSocket/fulfilled",
        "document/connectSocket/rejected",

        "document/invoke/pending",
        "document/invoke/fulfilled",
        "document/invoke/rejected",

        "document/setLastMessage",
        "document/setCurrentTransactionIsAccepted",
        "document/setWs",



        "document/setCurrentTransactionId",

        "public-component/setMessageBox",
        "public-component/setErrorBox",
        "public-component/resetMessageBox",
        "public-component/resetErrorBox",

      ],
      // ignoredActions: [],
    },
  }),
});
