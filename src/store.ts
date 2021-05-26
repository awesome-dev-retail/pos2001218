import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice.js";
import authReducer from "./slices/authSlice.js";
import areaReducer from "./slices/areaSlice";
import tableReducer from "./slices/tableSlice";
import menuReducer from "./slices/menuSlice";
import dishReducer from "./slices/dishSlice";
import documentReducer from "./slices/documentSlice";
// import invoiceReducer from "./slices/invoiceSlice";

export default configureStore({
  reducer: {
    App: appReducer,
    Auth: authReducer,
    Area: areaReducer,
    Table: tableReducer,
    Menu: menuReducer,
    Dish: dishReducer,
    Document: documentReducer,
    // Invoice: invoiceReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false
    // serializableCheck: {
    //   ignoredActions: [
    //     "user/fetchUser/fulfilled",

    //     "area/fetchAreaList/fulfilled",
    //     "area/saveArea/fulfilled",
    //     "area/deleteArea/fulfilled",

    //     "table/saveTable/fulfilled",
    //     "table/deleteTable/fulfilled",
    //     "table/fetchTableListInShop/fulfilled",
    //     "table/fetchTableListInArea/fulfilled",
    //     "table/fetchTableById/fulfilled",

    //     "menu/fetchMenuList/fulfilled",
    //     "menu/saveMenu/fulfilled",
    //     "menu/deleteMenu/fulfilled",

    //     "dish/fetchDishList/fulfilled",
    //     "dish/fetchDishListInShop/fulfilled",
    //     "dish/fetchDishListInMenu/fulfilled",
    //     "dish/saveDish/fulfilled",
    //     "dish/deleteDish/fulfilled",

    //     "dish/calculateInvoice/fulfilled",
    //     "dish/saveInvoice/fulfilled",

    //     "document/fetchDocument/fulfilled",
    //   ],
    // },
  }),
});
