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
  TIMESHEET: {
    CLOCK: "CLOCK",
    BREAK: "BREAK",
    UNPAIDBREAK: "UNPAIDBREAK",
    LEAVE: "LEAVE",
    VIEW_NAME: {
      CLOCK: "CLOCK",
      BREAK: "BREAK",
      UNPAIDBREAK: "UNPAID BREAK",
      LEAVE: "LEAVE"
    }
  },
  ROSTER: {
    DEFAULT_START_TIME: "1970-01-01 08:00",
    DEFAULT_END_TIME: "1970-01-01 17:00"
  }
};

export const getWebSocketBaseUrl = (url) => {
  return url.replace("http", "ws");
};
