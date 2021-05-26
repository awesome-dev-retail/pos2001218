import api from "./api";

export const FELogsListRequest = (logs) => {
    return api.request({
      url: "/pos/system/FeLogsList",
      method: "post",
      data: logs,
    });
};

export const FELogRequest = (log) => {
    return api.request({
      url: "/pos/system/FeLogs",
      method: "post",
      data: log,
    });
};