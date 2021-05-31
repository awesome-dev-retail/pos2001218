import moment from "moment";

export default class Document {
  constructor(doc) {
    this.id = doc.id;
    this.cid = doc.cid;
    this.shop_id = doc.shop_id;
    this.holiday_sucharge = doc.holiday_sucharge;
    this.holiday_surcharge_percent = doc. holiday_surcharge_percent;
    this.lane_id = doc.lane_id;
    this.table_id = doc.table_id;
    this.divide_no = doc.divide_no;
    this.document_type = doc.document_type;
    this.member_id = doc.member_id;
    this.takeaway_id = doc.takeaway_id;
    this.document_date = doc.document_date;
    this.status = doc.status;
    this.description = doc.description;
    this.doc_gross_amount = doc.doc_gross_amount;
    this.doc_net_amount = doc.doc_net_amount;
    this.doc_GST_amount = doc.doc_GST_amount;
    this.user_id = doc.user_id;
    this.from_offline = doc.from_offline;
    this.member_deposit = doc.member_deposit;
    this.doc_note = doc.doc_note;
    this.invoice_lines = doc.invoice_lines;
    this.payment_lines = doc.payment_lines;
    this.suspect_payment_lines = doc.suspect_payment_lines;
    this.transactionId = doc.transactionId || "";
  }

  generateTransactionId = (deviceId) => {
    let shopId = this.shop_id;
    // let deviceId = this.lane_id;
    let time = moment().format("YYYYMMDDHHmmss");
    this.transactionId = shopId.toString() + "_" + deviceId.toString() + "_" + time.toString();
    return this.transactionId;
  }

  setMessageFromInvoke = message => {
    this.invokeMessage = message;
  }

  resetMessage = function() {
    delete this.invokeMessage;
  }

  // addPaymentLine = line => {
  //   this.payment_lines.push(line);
  // }
  //
  // hasUncompletedTransaction = () => {
  //   if (this.transactionId) {
  //     const payment = this.payment_lines.find (item => item .transactionId === this.transactionId);
  //     return !payment;
  //     // if (payment && payment.is_paid === false) {
  //     //   return true;
  //     // } else {
  //     //   return true;
  //     // }
  //   }
  //   return false;
  // }

}