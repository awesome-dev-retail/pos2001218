import api from "./api";
import { UserCredential } from "../configs/data";

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

export const areaListRequest = (shopId) => {
  return api.request({
    url: `/pos/data/area/list_in_shop?shopId=${shopId}`,
    method: "get",
    // headers: {
    //   Authorization: "2fse783mcEIlui4pN5i7WQ==",
    // },
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
