import moment from "moment";

export function createInvoice(table, dishArr, userID) {
  const grossAmount = dishArr.reduce((total, currentValue) => {
    return total + currentValue.count * currentValue.unit_price;
  }, 0);
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
      Changed: true,
      ExtraDetail: {
        //if have
        Changed: true, // [required]
        ExtraList:
          dish.extras && dish.extras.length !== 0
            ? dish.extras
                .map((i) => {
                  if (i.count && i.count !== 0) {
                    return {
                      ExtraID: i.id,
                      ExtraQty: i.count,
                    };
                  }
                })
                .filter((n) => n)
            : [],
        // ExtraList: [
        //   {
        //     ExtraID: 1, // [required]
        //     ExtraQty: 2, // [required]
        //     ExtraInventoryID: "MILK", // [return from backend]
        //     ExtraDescription: "Add milk", // [return from backend]
        //   },
        // ],
      },
      ServeNow: true,
      Cooked: false,
      Served: false,
    })),
  };
}
