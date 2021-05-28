import React, { Fragment, useEffect, useState } from "react";
import moment from "moment";

export function createInvoice(table, dishArr, userID) {
  const grossAmount = dishArr.reduce((total, currentValue) => {
    return total + currentValue.count * currentValue.unit_price;
  }, 0);
  //  "InvoiceDate": "2019-10-03 14:52:39", // [required]
  const InvoiceDate = moment().format("YYYY-MM-DD HH:mm:ss");
  return {
    CID: 1,
    ShopID: 1,
    LaneID: "LE_001",
    TableID: table.id,
    DivideNo: table.uncomplete_details ? table.uncomplete_details[0].divide_no : 0,
    InvoiceType: "EatIn",
    MemberID: 0,
    TakeawayID: 0,
    InvoiceDate,
    GrossAmount: grossAmount.toFixed(2) * 1,
    NetAmount: (grossAmount * 0.87).toFixed(2) * 1,
    GSTAmount: (grossAmount - grossAmount * 0.87).toFixed(2) * 1,
    UserID: userID,

    Lines: dishArr.map((dish) => ({
      Dish: {
        DishCode: dish.dish_code,
      },
      Description: dish.description,
      Quantity: {
        Qty: dish.count,
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
      Amount: dish.count * dish.unit_price,
      UnitCost: dish.unit_cost,
      ServeNow: true,
      Cooked: false,
      Served: false,
    })),
  };
}
