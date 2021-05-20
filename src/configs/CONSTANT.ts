export default {
  ROUTES: {
    HOME: "/",
    ABOUT: "/about",
    LOGIN: "/login",
    // ORDER: "/order",
    ORDER: "/order/:id",
    PAYMENT: "/payment/:id",
    SELECT_SHOP: "/select-shop",
  },
  API_STATUS: {
    IDLE: "idle",
    LOADING: "loading",
    SUCCEEDED: "succeeded",
    FAILED: "failed",
  },
};
