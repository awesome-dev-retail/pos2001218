export const createInvoice = (table, dishArr) => {
  const grossAmount = dishArr.reduce((total, currentValue) => {
    return total + currentValue.count * currentValue.unit_price;
  }, 0);
  return {
    CID: 1,
    ShopID: 1,
    LaneID: "LE_001",
    TableID: table.id,
    DivideNo: 1,
    MemberID: 0,
    TakeawayID: 0,
    InvoiceDate: new Date(),
    GrossAmount: grossAmount.toFixed(2) * 1,
    NetAmount: (grossAmount * 0.87).toFixed(2) * 1,
    GSTAmount: (grossAmount - grossAmount * 0.87).toFixed(2) * 1,
    UserID: 24,

    Lines: dishArr.map((dish) => ({
      Dish: {
        DishCode: dish.dish_code,
      },
      Quantity: {
        Qty: dish.count,
      },
      UOM: "EACH",
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
};
