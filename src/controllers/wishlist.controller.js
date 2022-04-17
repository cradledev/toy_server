const Wishlist = require("../models/Wishlist");
const CTRLS = {};

CTRLS.getItems = (req, res) => {
    const { id } = req.params;
    Wishlist.findById(id).exec((err, items) => {
        if (err) {
          return res.status(401).json({
            ok: false,
            err,
          });
        }
        return res.json({ ok:true, items});
    });
}

CTRLS.saveWishlist = (req, res) => {
  Wishlist.countDocuments({client : req.body.userId}).exec((err, count) => {
    if (count > 0) {
      Wishlist.updateOne({client : req.body.userId}, {$push : {items : [req.body.productId]}})
      .exec((err, updItem) => {
        if (err) {
          return res.status(401).json({
            ok: false,
            err,
          });
        }
        return res.json({ ok:true, wishlist : updItem});
      })
    } else {
      const wishlist = new Wishlist({
        client: req.body.userId,
        items : [req.body.productId]
      });
      
      // console.log(req.body);
    
      wishlist.save((err, newWishlist) => {
        if (err) {
          return res.status(401).json({
            ok: false,
            err,
          });
        }
    
        res.status(201).json({
          ok: true,
          wishlist: newWishlist,
        });
      });
    }
  })
    
}

CTRLS.deleteWishlistItem = (req, res) => {
    const productID = req.body.productId
    const client = req.body.userId
    Wishlist.updateOne({client : client}, {$pull : {items : [productID]}})
      .exec((err, delItem) => {
        if (err) {
          return res.status(401).json({
            ok: false,
            err,
          });
        }
        return res.json({ ok:true, delItem});
      })
}
module.exports = CTRLS;
