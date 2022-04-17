const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const OrderSchema = new Schema({
  dateReg: {
    type: Date,
    default: Date.now,
  },
  payment: Number,
  client: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  orderItems: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      price : Number,
      qty: Number
    },
  ],
  active : {
    type : Boolean,
    default : true
  }
});

module.exports = mongoose.model("Order", OrderSchema);
