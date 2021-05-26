export default {
  ROUTES: {
    HOME: "/",
    ABOUT: "/about",
    LOGIN: "/login",
    ORDER: "/order",
    ORDER_LIST: "/order/table/:tableId",
    ORDER_PAYMENT: "/order/payment/:invoiceId",
    SELECT_SHOP: "/select-shop",
  },
  API_STATUS: {
    IDLE: "idle",
    LOADING: "loading",
    SUCCEEDED: "succeeded",
    FAILED: "failed",
  },
  debug: true,    // Debug info
};
