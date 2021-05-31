export default {
  BASE_URL: "https://pos-restaurant-be-dev.azurewebsites.net",
  // BASE_URL: "http://192.168.69.19:8080",
  // BASE_URL: "http://10.10.1.115:8080",

  // BASE_URL: "https://pos-topcatch-dev-be.azurewebsites.net",
  API_REQUEST_TIME_OUT_LIMIT: 60000,
  SOCKET_RECONNECT_TIMES: 6,
  API_STATUS: {
    IDLE: "idle",
    LOADING: "loading",
    SUCCEEDED: "succeeded",
    FAILED: "failed",
  },
  NO_MONEY_CHARACTER : "-",

};

export const getWebSocketBaseUrl = (url) => {
  return url.replace("http", "ws");
};
