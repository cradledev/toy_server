const Discount = require("../../models/Discount");
const path = require("path");
const CTRLS = {};

CTRLS.getDiscounts = (req, res) => {
    Discount.find({})
    .where({status : true})
    .sort({ createdAt: "DESC" })
    .exec((err, discounts) => {
        if (err) {
            return res.json ({
                ok : false, msg : "Somethign went wrong."
            });
        }
      return res.json({ok : true, discounts});
    });
};

CTRLS.saveDiscount = (req, res) => {
    const body = req.body
    const discount = new Discount ({
        title : body.title,
        description : body.description,
        discountType : body.discountType,
        usePercentage : body.usePercentage,
        discountValue : body.discountValue,
        useCouponCode : body.useCouponCode,
        couponCode : body.couponCode ? body.couponCode : null,
        startTime : new Date(body.startTime),
        endTime : new Date(body.endTime),
        discountLimitation : body.discountLimitation,
        times : body.times,
        minOrderSubTotalAmount : body.minOrderSubTotalAmount,
        minOrderTotalAmount : body.minOrderTotalAmount,
        status : body.status,
        timesUsed : 0
    }) 
    discount.save((err, newDiscount) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err,
            });
        }

        res.status(201).json({
            ok: true,
            discount: newDiscount,
        });
    });
}
CTRLS.getProductDiscounts = (req, res) => {
    console.log(req.headers)
    Discount.find({$and : [{'discountType' : "AssignedToProducts"}, {'status' : true}]})
    .exec((err, discounts) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err,
            });
        }
        // const newArrayOfObj = discounts.map(({
        //     "_id": value, title : label
        //   }) => ({
        //     value, label
        //   }));
        return res.json({
            ok : true,
            discounts,
        })
    })
}
CTRLS.getDiscountByFilter = (req, res) => {
    console.log(req.body)
    const sort = req.body.sort;
    const sortColumn = req.body.sortColumn;
    const perPage = req.body.perPage;
    const status = req.body.status;
    const page = Math.max(0, req.body.page);
    const sortContent = {}
    if(sortColumn != null) {
        sortContent[sortColumn] = sort;
    }
    let query = {};
    if (status == "empty") {
        query = {
            $or : [ {'status' : true}, {'status' : false }],
        };
    } else {
        query = {
            'status' : status == "active" ? true : false
        };
    }
    console.log(query)
    Discount.find({...query})
    .limit(perPage * 1)
    .skip(perPage * (page * 1 - 1))
    .sort(sortContent)
    .exec((err, discounts) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err,
            });
        }
        Discount.countDocuments({...query}).exec((err, count) => {
            return res.json({
                ok : true,
                discounts,
                total: count
            })
        })
    })
}

CTRLS.getDiscount = (req, res) => {
    const { id } = req.params;
    Discount.findById(id).exec((err, discount) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          err,
        });
      }
      return res.json({ ok:true, discount});
    });
};

CTRLS.updateDiscount = (req, res) => {
    const { id } = req.params;
    const discount = {};
    if(req.body.title) discount.title = req.body.title;
    if(req.body.description) discount.description = req.body.description;
    if(req.body.discountType) discount.discountType = req.body.discountType;
    if(req.body.usePercentage) discount.usePercentage = req.body.usePercentage;
    if(req.body.discountValue) discount.discountValue = req.body.discountValue;
    if(req.body.useCouponCode) discount.useCouponCode = req.body.useCouponCode;
    if(req.body.couponCode) discount.couponCode = req.body.couponCode;
    if(req.body.startTime) discount.startTime = new Date(req.body.startTime);
    if(req.body.endTime) discount.endTime = new Date(req.body.endTime);
    if(req.body.discountLimitation) discount.discountLimitation = req.body.discountLimitation;
    if(req.body.times)  discount.times = req.body.times;
    if(req.body.minOrderSubTotalAmount)  discount.minOrderSubTotalAmount = req.body.minOrderSubTotalAmount;
    if(req.body.minOrderTotalAmount)  discount.minOrderTotalAmount = req.body.minOrderTotalAmount;
    if(req.body.status)  discount.status = req.body.status;
    console.log(discount)
    Discount.findByIdAndUpdate(id, discount, { new: true }, (err, updDiscount) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err,
            });
        }

        res.status(201).json({
        ok: true,
        discount: updDiscount,
        });
    });
};

CTRLS.deleteDiscount = (req, res) => {
    const { id, status } = req.params;
    Discount.findByIdAndUpdate(id, { status }, { new: true }, (err, delDiscount) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err,
            });
        }

        res.status(201).json({
            ok: true,
            discount: delDiscount,
        });
    });
};

// CTRLS.viewImage = (req, res) => {
//     const urlImage = path.join(
//         __dirname,
//         "./../../uploads/sliders",
//         req.params.img // /products/image/:img
//     );
//     return res.sendFile(urlImage);
// };

function coupongenerator(_codeLength) {
    var coupon = "";
    var possible = "abcdefghijklmn01234opqrstuvwxyz56789";
    for (var i = 0; i < _codeLength; i++) {
        coupon += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return coupon;
}
CTRLS.generateCouponCode = (req, res) => {
    
    let isExistDiscount = false
    do {
        let myDiscountCode = coupongenerator(15)
        Discount.countDocuments({ couponCode : myDiscountCode}).exec((err, count) => {
            if (count > 0) {
                isExistDiscount = true;
            } else {
                return res.json({
                    ok : true,
                    couponCode : myDiscountCode
                });
            }
        })
        // newDiscountCode.save(function (err) {
        //     if (err) {
        //         if (err.name === "MongoError" && err.code === 11000) {
        //             // Duplicate code detected
        //             isExistDiscount = true;
        //         }
        //     }
        //     return res.json({
        //         ok : true,
        //         coupon : myDiscountCode
        //     });
        // })
    }
    while (isExistDiscount);
    
}
module.exports = CTRLS;
