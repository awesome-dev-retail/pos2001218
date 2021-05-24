export const createPayment = (document) => {
  return {
    PaymentID: "", // [more than 0 while updating] [payment by EFTPOS cannot update]
    ShopID: 1, // [required] type int
    InvoiceID: document.id, // [required]
    DeviceID: "", // [required for EFTPOS]
    PaymentMethod: "Cash", // [required]
    Amount: 0.6, // [required] [Amount is the number after rounding]
    ActualAmount: 0.6, // [required] [it is the real amount client give]
    Change: 0, // [required] [ActualAmount - Amount]
    RoundingAmount: 0.05, // [required] [Amount of Rounding]
    CashoutAmount: 0, // [required] [can't be less than 0] [if >0, PaymentMethod should be "EFTPOS", "VISA" or "MASTERCARD"] [can't have cent digit like $12.34, should be $12.30]
    SurchargeAmount: 0, //[required] [usually is 0]
    TransactionID: "", // [required for EFTPOS]
    VoucherNumber: "", // [required for VOUCHER]
    OriginalID: -1, // [required for refunding a previous payment, OriginalID = payment ID that need refund; if not refund, empty or <= 0] type int
    IsCreditCard: false,
  };
};
