
export const saveTimeClock = data => {
  return api.request({
    url: "/pos/timesheet/save",
    method: "POST",
    data: data
  });
};

export const listAllTimesheetStaffInShop = (shopName) => {
  const url = shopName ? `/pos/timesheet/staff/get_shop_all?shop=${shopName}` : "/pos/timesheet/staff/get_shop_all";
  return api.request({
    url: url,
    method: "GET",
  });
};

export const listAllTimesheetStaffInCompany = () => {
  return api.request({
    url: "pos/timesheet/staff/get_all",
    method: "GET"
  });
};

export const addTimesheetStaff = (staff) => {
  return api.request({
    url: "/pos/timesheet/staff/save",
    method: "POST",
    data: staff
  });
};

export const editTimesheetStaff = staff => {
  return api.request({
    url: "/pos/timesheet/staff/edit",
    method: "PATCH",
    data: staff
  });
};

export const timesheetStaffLogin = staff => {
  return api.request({
    url: "/pos/timesheet/staff/login",
    method: "POST",
    data: staff
  });
};

export const loadTimesheetReport = (dateStr, shop_name) => {
  return api.request({
    url: `pos/timesheet/daily/load?date=${dateStr}&shop=${shop_name}`,
    method: "GET",
  });
};

export const editTimesheetDoc = data => {
  return api.request({
    url: "pos/timesheet/daily/edit_time",
    method: "POST",
    data: data
  });
};

export const addTimesheetAction = data => {
  return api.request({
    url: "pos/timesheet/daily/add_timesheet",
    method: "POST",
    data: data
  });
};

export const fetchTimesheetDashboard = shopCode => {
  return api.request({
    url: `pos/timesheet/report/today_status?shop=${shopCode || ""}`,
    method: "GET"
  });
};

export const postTimesheet = (dateStr, shopName) => {
  return api.request({
    url: `pos/timesheet/daily/approve_all?date=${dateStr}&shop=${shopName}`,
    method: "GET"
  });
};

export const deleteTimesheetLine = id => {
  return api.request({
    url: `pos/timesheet/daily/del_timesheet/${id}`,
    method: "DELETE"
  });
};

export const saveRoster = data => {
  return api.request({
    url: "/pos/timesheet/schedule/save",
    method: "POST",
    data: data
  });
};

export const editRoster = data => {
  return api.request({
    url: "/pos/timesheet/schedule/edit",
    method: "PATCH",
    data: data
  });
};

export const listRoster = (from, to) => {
  return api.request({
    url: `/pos/timesheet/schedule/list_week?begin_date=${from}&end_date=${to}`,
    method: "GET",
  });
};

export const deleteRoster = id => {
  return api.request({
    url: `/pos/timesheet/schedule/del/${id}`,
    method: "DELETE"
  });
};

export const ListPaidType = () => {
  return api.request({
    url: "/pos/timesheet/paidtype/list",
    method: "GET"
  });
};

export const SavePaidType = data => {
  return api.request({
    url: "/pos/timesheet/paidtype/save",
    method: "POST",
    data: data
  });
};

export const EditPaidType = data => {
  return api.request({
    url: "/pos/timesheet/paidtype/edit",
    method: "PATCH",
    data: data
  });
};

export const DeletePaidType = id => {
  return api.request({
    url: `/pos/timesheet/paidtype/del/${id}`,
    method: "DELETE",
  });
};

export const duplicateRosterBasedOnToday = (store_code, is_overwrite) => {
  return api.request({
    url: `pos/timesheet/schedule/s_duplicate?store_code=${store_code}&is_overwrite=${is_overwrite}`,
    method: "GET"
  });
};

export const duplicateRoster = data => {
  return api.request({
    url: "pos/timesheet/schedule/duplicate",
    method: "POST",
    data: data
  });
};