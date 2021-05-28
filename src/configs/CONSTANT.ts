const frontEndUrlSymbol = () => {
  const urlArr = window.location.href.split("/");
  return urlArr.length > 2 ? urlArr[2] + "/" : "/";
};

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
  TIME_FORMAT: {
    BACKEND_DATETIME: "YYYY-MM-DD HH:mm:ss",
    FRONTEND_DATE: "DD/MM/YYYY"
  },
  LOCALSTORAGE_SYMBOL: {
    DOCUMENT_SYMBOL: frontEndUrlSymbol() + "BIZEX_CATERING_POS_DOCUMENT",
  }
};
