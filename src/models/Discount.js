const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DiscountSchema = new Schema({
    title : {type : String, required : true},
    description : {type : String, required : true},
    discountType : {type : String, enum: ["AssignedToProducts","AssignedToOrderTotal","AssignedToOrderSubTotal"], default : "AssignedToProducts"},
    usePercentage : {type : Boolean, default : false},
    discountValue : {type : Number, required : true},
    useCouponCode : { type : Boolean, required : false, default : true},
    couponCode : { type : String, unique: true, required : false, min : 5, max : 15},
    startTime : { type : Date, required : true},
    endTime : { type : Date, required : true},
    discountLimitation : { type : String, enum: ["Unlimited","NtimesPerCustomer"], default : "Unlimited"},
    times : { type : Number, required : false},
    minOrderSubTotalAmount : { type : Number, required : false},
    minOrderTotalAmount : { type : Number, required : false},
    status: {
        type: Boolean,
        default: true
    },
    timesUsed : { type : Number, required : false, default : 0}
},
{
    timestamps: true
});

module.exports = mongoose.model("Discount", DiscountSchema);
