import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import areaReducer from "./slices/areaSlice";
import tableReducer from "./slices/tableSlice";
import menuReducer from "./slices/menuSlice";
import dishReducer from "./slices/dishSlice";

export default configureStore({
  reducer: {
    Auth: authReducer,
    Area: areaReducer,
    Table: tableReducer,
    Menu: menuReducer,
    Dish: dishReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [
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
        "dish/fetchDishListInMenu/fulfilled",
        "dish/saveDish/fulfilled",
        "dish/deleteDish/fulfilled",
      ],
      // ignoredActions: ["user/fetchUser/fulfilled"],
    },
  }),
});
