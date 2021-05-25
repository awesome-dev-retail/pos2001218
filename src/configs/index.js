export default {
  BASE_URL: "https://pos-restaurant-be-dev.azurewebsites.net",
  // BASE_URL: "http://192.168.69.76:8080",
  // BASE_URL: "https://pos-topcatch-dev-be.azurewebsites.net",
  API_REQUEST_TIME_OUT_LIMIT: 60000,
  SOCKET_RECONNECT_TIMES: 2,
  API_STATUS: {
    IDLE: "idle",
    LOADING: "loading",
    SUCCEEDED: "succeeded",
    FAILED: "failed",
  },
};

export const getWebSocketBaseUrl = (url) => {
  return url.replace("http", "ws");
};
