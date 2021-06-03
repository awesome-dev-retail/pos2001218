// import { useSelector } from "react-redux";
// import { selectPayment, selectAmountPaying, selectAmountPaid } from "../slices/paymentSlice";
// const amountPaying = useSelector((state) => selectAmountPaying(state));

export const createPaymentForSplit = (document, payMoney, amountPaying) => {
  // const shop = useSelector((state) => selectShops(state));
  return {
    PaymentID: 0, // [more than 0 while updating] [payment by EFTPOS cannot update]
    ShopID: 1, // [required] type int
    InvoiceID: document.id, // [required]
    DeviceID: "", // [required for EFTPOS]
    PaymentMethod: "Cash", // [required]
    Amount: Math.round(amountPaying * 10) / 10, // [required] [Amount is the number after rounding]
    // Amount: document.doc_gross_amount.toFixed(1) * 1, // [required] [Amount is the number after rounding]
    ActualAmount: payMoney, // [required] [it is the real amount client give]
    Change: (payMoney - Math.round(amountPaying * 10) / 10).toFixed(1) * 1, // [required] [ActualAmount - Amount]
    RoundingAmount: (Math.round(amountPaying * 10) / 10 - amountPaying).toFixed(2) * 1, // [required] [Amount of Rounding]
    CashoutAmount: 0, // [required] [can't be less than 0] [if >0, PaymentMethod should be "EFTPOS", "VISA" or "MASTERCARD"] [can't have cent digit like $12.34, should be $12.30]
    SurchargeAmount: 0, //[required] [usually is 0]
    TransactionID: "", // [required for EFTPOS]
    VoucherNumber: "", // [required for VOUCHER]
    OriginalID: -1, // [required for refunding a previous payment, OriginalID = payment ID that need refund; if not refund, empty or <= 0] type int
    IsCreditCard: false,
  };
};
export const createPayment = (document, due, tendered, change) => {
  // const shop = useSelector((state) => selectShops(state));
  return {
    PaymentID: 0, // [more than 0 while updating] [payment by EFTPOS cannot update]
    ShopID: 1, // [required] type int
    InvoiceID: document.id, // [required]
    DeviceID: "", // [required for EFTPOS]
    PaymentMethod: "Cash", // [required]
    Amount: Math.round(due * 10) / 10, // [required] [Amount is the number after rounding]
    // Amount: document.doc_gross_amount.toFixed(1) * 1, // [required] [Amount is the number after rounding]
    ActualAmount: tendered * 1, // [required] [it is the real amount client give]
    Change: change, // [required] [ActualAmount - Amount]
    RoundingAmount: (due - Math.round(due * 10) / 10).toFixed(2) * 1, // [required] [Amount of Rounding]
    CashoutAmount: 0, // [required] [can't be less than 0] [if >0, PaymentMethod should be "EFTPOS", "VISA" or "MASTERCARD"] [can't have cent digit like $12.34, should be $12.30]
    SurchargeAmount: 0, //[required] [usually is 0]
    TransactionID: "", // [required for EFTPOS]
    VoucherNumber: "", // [required for VOUCHER]
    OriginalID: -1, // [required for refunding a previous payment, OriginalID = payment ID that need refund; if not refund, empty or <= 0] type int
    IsCreditCard: false,
  };
};
