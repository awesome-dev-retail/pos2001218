import api from "./api";
import { UserCredential } from "../configs/data";

//====================area start
export const areaListRequest = (shopId) => {
  return api.request({
    url: `/pos/data/area/list_in_shop?shopId=${shopId}`,
    method: "get",
  });
};

export const saveAreaRequest = (areaObj) => {
  return api.request({
    url: "/pos/data/area/save",
    method: "post",
    data: areaObj,
  });
};

export const deleteAreaRequest = (areaId) => {
  return api.request({
    url: `/pos/data/area/delete/${areaId}`,
    method: "delete",
  });
};
//====================area end

//====================table start
export const tableListInShopRequest = (shopId) => {
  return api.request({
    url: `/pos/data/dinner_table/list_in_shop?shopId=${shopId}`,
    method: "get",
  });
};

export const tableListInAreaRequest = ({ shopId, areaId }) => {
  return api.request({
    url: `/pos/data/dinner_table/list_in_area?shopId=${shopId}&areaId=${areaId}`,
    method: "get",
  });
};

export const tableByIdRequest = (tableId) => {
  return api.request({
    url: `/pos/data/dinner_table/${tableId}`,
    method: "get",
  });
};

export const saveTableRequest = (tableObj) => {
  return api.request({
    url: "/pos/data/dinner_table/save",
    method: "post",
    data: tableObj,
  });
};

export const deleteTableRequest = (tableId) => {
  return api.request({
    url: `/pos/data/dinner_table/delete/${tableId}`,
    method: "delete",
  });
};
//====================table end

//====================menu start
export const menuListRequest = (shopId) => {
  return api.request({
    url: `/pos/data/dish_class/list_in_shop?shopId=${shopId}`,
    method: "get",
  });
};

export const saveMenuRequest = (menuObj) => {
  return api.request({
    url: "/pos/data/dish_class/save",
    method: "post",
    data: menuObj,
  });
};

export const deleteMenuRequest = (menuId) => {
  return api.request({
    url: `/pos/data/dish_class/delete/${menuId}`,
    method: "delete",
  });
};
//====================menu end

//====================dish start
export const dishListRequest = (shopId) => {
  return api.request({
    url: `/pos/data/dish/list_in_shop?shopId=${shopId}`,
    method: "get",
  });
};

export const dishListInMenuRequest = (menuId) => {
  return api.request({
    url: `/pos/data/dish/list_in_shop?classId=${menuId}`,
    method: "get",
  });
};

export const saveDishRequest = (dishObj) => {
  return api.request({
    url: "/pos/data/dish/save",
    method: "post",
    data: dishObj,
  });
};

export const deleteDishRequest = (dishID) => {
  return api.request({
    url: `/pos/data/dish/delete/${dishID}`,
    method: "delete",
  });
};

export const calculateInvoiceRequest = (invoice) => {
  return api.request({
    url: "/pos/data/invoice/calculate",
    method: "post",
    data: invoice,
  });
};

export const saveInvoiceRequest = (invoice) => {
  return api.request({
    url: "/pos/data/invoice/save",
    method: "post",
    data: invoice,
  });
};

//====================dish end

//====================document start
export const fetchDocumentRequest = (invoiceID) => {
  return api.request({
    url: `/pos/data/document/${invoiceID}`,
    method: "get",
  });
};
//====================document end

export const loginRequest = (data) => {
  const { password, username } = data;
  const param = password ? { uname: username, passwd: password } : { barcode: username };
  console.log(param);
  console.log(api);
  return api.request({
    // url: "https://pos-restaurant-be-dev.azurewebsites.net/brunton/user/login?nocache=" + new Date().getTime(),
    url: "/brunton/user/login",
    headers: {
      Authorization: "",
    },
    data: { ...param },
    method: "POST",
  });
};

export const logout = () => {
  return api.request({
    url: "/brunton/user/logout",
    method: "GET",
  });
};

export const getCurrentUser = () => {
  return api.request({
    url: "/brunton/user/current_user",
    method: "GET",
  });
};

export const listShops = () => {
  return api.request({
    url: "/pos/config/shop_config/list",
    method: "GET",
  });
};

export const listLanes = () => {
  return api.request({
    url: "/pos/config/lane/list",
    method: "GET",
  });
};

// import api from "./api";
// import { UserCredential } from "../configs/data";
//
// export const areaListRequest = (shopId: any) => {
//   return api.request({
//     url: `/pos/data/area/list_in_shop?shopId=${shopId}`,
//     method: "get",
//     headers: {
//       Authorization: "2fse783mcEIlui4pN5i7WQ==",
//     },
//   });
// };
//
// // export const login = (username, password) => {
// //   const uri = password ? username + "/" + password : username;
//
// //   return api.request({
// //     url: `/brunton/loyalty_user/login/${uri}?nocache=${new Date().getTime()}`,
// //     method: "get",
// //     headers: {
// //       Authorization: "",
// //     },
// //   });
// // };
//
// export const loginRequest = (data: UserCredential) => {
//   const { password, username } = data;
//   const param = password ? { uname: username, passwd: password } : { barcode: username };
//   return api.request({
//     url: "/brunton/user/login?nocache=" + new Date().getTime(),
//     headers: {
//       Authorization: "",
//     },
//     data: { ...param },
//     method: "POST",
//   });
// };
