import moment from "moment";

export function createInvoice(table, dish, userID) {
  //  "InvoiceDate": "2019-10-03 14:52:39", // [required]
  const newInvoiceDate = moment().format("YYYY-MM-DD HH:mm:ss");
  let existInvioceDate = "";
  if (table.uncomplete_invoices) {
    existInvioceDate = table.uncomplete_invoices[0].document_date;
    const date = existInvioceDate.split(" ")[0];
    const time = existInvioceDate.split(" ")[1];
    existInvioceDate = date + " " + time;
  }

  return {
    InvoiceID: table.uncomplete_invoices ? table.uncomplete_invoices[0].id : 0,
    CID: 1,
    ShopID: 1,
    LaneID: "LE_001",
    TableID: table.id,
    DivideNo: table.uncomplete_details ? table.uncomplete_details[0].divide_no : 0,
    InvoiceType: "EatIn",
    MemberID: 0,
    TakeawayID: 0,
    InvoiceDate: table.uncomplete_invoices ? existInvioceDate : newInvoiceDate,
    // GrossAmount: grossAmount.toFixed(2) * 1,
    // NetAmount: (grossAmount * 0.87).toFixed(2) * 1,
    // GSTAmount: (grossAmount - grossAmount * 0.87).toFixed(2) * 1,
    UserID: userID,

    Lines: [
      {
        Dish: {
          DishCode: dish.dish_code,
          // Changed: true, //must
        },
        Description: dish.description,
        Quantity: {
          Qty: 1,
        },
        UOM: {
          UOM: "EACH",
        },
        UnitPrice: dish.unit_price,
        DiscountPercentage: {
          DiscountPercentage: 0,
        },
        DiscountAmount: {
          DiscountAmount: 0,
        },
        // Amount: dish.count * dish.unit_price,
        UnitCost: dish.unit_cost,
        Changed: true,
        ExtraDetail: {
          Changed: true,
          ExtraList: null,
        },

        ServeNow: true,
        Cooked: false,
        Served: false,
      },
    ],
  };
}

export const createLine = (dish) => {
  return {
    Dish: {
      DishCode: dish.dish_code,
      // Changed: true, //must
    },
    Description: dish.description,
    Quantity: {
      Qty: 1,
    },
    UOM: {
      UOM: "EACH",
    },
    UnitPrice: dish.unit_price,
    DiscountPercentage: {
      DiscountPercentage: 0,
    },
    DiscountAmount: {
      DiscountAmount: 0,
    },
    // Amount: dish.count * dish.unit_price,
    UnitCost: dish.unit_cost,
    Changed: true,
    ExtraDetail: {
      Changed: true,
      ExtraList: null,
    },
    ServeNow: true,
    Cooked: false,
    Served: false,
  };
};

// ExtraDetail:
//   dish.extras.length !== 0
//     ? {
//         Changed: true,
//         ExtraList: [],
//         // ExtraList: dish.extras.map((i) => {
//         //   return {
//         //     ExtraID: i.id,
//         //     ExtraQty: i.count,
//         //   };
//         // }),
//       }
//     : null,
