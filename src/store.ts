import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import areaReducer from "./slices/areaSlice";
import tableReducer from "./slices/tableSlice";
import menuReducer from "./slices/menuSlice";
import dishReducer from "./slices/dishSlice";
import documentReducer from "./slices/documentSlice";
import paymentReducer from "./slices/paymentSlice";
// import invoiceReducer from "./slices/invoiceSlice";

export default configureStore({
  reducer: {
    Auth: authReducer,
    Area: areaReducer,
    Table: tableReducer,
    Menu: menuReducer,
    Dish: dishReducer,
    Document: documentReducer,
    Payment: paymentReducer,
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
        "table/startTable/fulfilled",
        "table/endTable/fulfilled",
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
        "dish/listDocument/fulfilled",
        "dish/cancelInvoice/fulfilled",

        "document/fetchDocument/fulfilled",

        "payment/savePayment/fulfilled",
        "payment/completePayment/fulfilled",
      ],
      // ignoredActions: [],
    },
  }),
});
