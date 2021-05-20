import CacheStorage from "../lib/cache-storage";

export const createDishObjInOrder = (state, copydishObjInOrder) => {
  // export const createDishObjInOrder = (tableID, invoice) => {
  // const copydishObjInOrder = CacheStorage.getItem("dishObjInOrder_" + "1_" + state.invoice.TableID);
  // if (JSON.parse(JSON.stringify(invoice)) != "{}") {
  // console.log("state.invoice.data.Lines", state.invoice.data.Lines);
  // console.log("copydishObjInOrder", copydishObjInOrder);
  if (state.invoice && state.invoice.Lines) {
    const newdishObjInOrder = state.invoice.Lines.map((item) => {
      const dish = copydishObjInOrder.find((dish) => dish.dish_code === item.Dish.DishCode);
      // dish.unit_price = 100;
      // dish.unit_price = item.unit_price;
      return dish;
    });
    return newdishObjInOrder;
  } else {
    return [];
  }
};

const dishlist = {
  data: {
    count: 16,
    list: [
      {
        id: 22,
        cid: 1,
        class_id: 16,
        dish_code: "16-5",
        description: "Fruit Salad",
        UOM: "EACH",
        unit_price: 3,
        unit_cost: 7.32,
        pos_image_url: "",
        status: "",
        introduction: "",
        exclusive_shops: "",
        ctime: "2021-04-29T09:52:54+12:00",
        mtime: "2021-05-01T18:55:09+12:00",
        cuid: 1,
        muid: 1,
        UOM_conversions: [],
      },
    ],
  },
};

const invoice = {
  data: {
    InvoiceID: 0,
    CID: 1,
    ShopID: 1,
    HolidaySurcharge: false,
    HolidaySurchargePercent: 0,
    LaneID: "LE_001",
    TableID: 56,
    DivideNo: 1,
    InvoiceType: "EatIn",
    MemberID: 0,
    TakeawayID: 0,
    InvoiceDate: "2019-10-03 14:52:39",
    Description: "",
    NetAmount: 660.85,
    GSTAmount: 99.13,
    GrossAmount: 759.98,
    UserID: 24,
    ErrorMsg: "",
    Lines: [
      {
        Dish: {
          DishCode: "18-1",
          Changed: false,
        },
        Description: "",
        Quantity: {
          Qty: 2,
          Changed: false,
        },
        UOM: {
          UOM: "EACH",
          Changed: false,
          BaseUOM: "",
          UOMList: null,
        },
        UnitPrice: 379.99,
        DiscountPercentage: {
          DiscountPercentage: 0,
          Changed: false,
        },
        DiscountAmount: {
          DiscountAmount: 0,
          Changed: false,
        },
        HolidaySurchargeAmount: 0,
        Amount: 759.98,
        Changed: false,
        ErrorMsg: "",
        UnitCost: 350,
        RuleID: 0,
        GroupNumber: 0,
        Index: 0,
        IsMixmatchDiscount: false,
        ServeNow: true,
        Cooked: false,
        Served: false,
      },
    ],
  },
};
