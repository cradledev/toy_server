const  mongoose = require('mongoose');
const Order = require("../models/Order");
const Product = require("../models/Product");

const CTRLS = {};

CTRLS.getOrders = (req, res) => {
  Order.find({})
    .sort({ createdAt: "DESC" })
    .populate("client")
    .populate("orderItems.product")
    .exec((err, orders) => {
      return res.json({ok : true, orders});
    });
};

CTRLS.saveOrder = (req, res) => {
  const body = req.body;

  validateQty(body.orderItems, (resp) => {
    if (!resp)
      return res.status(401).json({
        ok: false,
        msg: "There are no products to save",
      });

    const order = new Order({
      payment: body.payment,
      client: body.client,
      orderItems: resp,
    });

    order.save((err, newOrder) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          err,
        });
      }

      res.status(201).json({
        ok: true,
        order: newOrder,
      });
    });
  });
};

const validateQty = async (products, cb) => {
  const products_id = [];

  products.forEach((elem) => {
    products_id.push(elem.product_id);
  });

  const resp = [];

  Product.find()
    .where("_id")
    .in(products_id)
    .exec(async (err, data) => {
      for (const key of data) {
        const qty = products.find((p) => p.product_id == key._id).qty;
        if (qty <= key.stock) {
          const modify = await Product.findByIdAndUpdate(key._id, {
            stock: key.stock - qty,
          });

          if (modify != false) {
            resp.push({
              product: key._id,
              qty: qty,
            });
          }
          console.log(resp);
        }
      }

      cb(resp.length == 0 ? false : resp);
    });
};

CTRLS.addCart = async (req, res) => {
  const { productId, qty, price, userId } = req.body;
  try {
    let cart = await Order.findOne({ client : mongoose.Types.ObjectId(userId), active : true });

    if (cart) {
      //cart exists for user
      let itemIndex = cart.orderItems.findIndex(p => p.product == productId);

      if (itemIndex > -1) {
        //product exists in the cart, update the quantity
        let productItem = cart.orderItems[itemIndex];
        productItem.qty = qty;
        cart.orderItems[itemIndex] = productItem;
      } else {
        //product does not exists in cart, add new item
        cart.orderItems.push({ 'product' : productId, qty, price });
      }
      cart = await cart.save();
      return res.status(201).json({
        ok : true,
        msg : "Adding cart is successfully proceed."
      });
    } else {
      //no cart for user, create new cart
      const newCart = await Order.create({
        client : mongoose.Types.ObjectId(userId),
        orderItems: [{ 'product' : productId, qty, price }]
      });

      return res.status(201).json({
        ok : true,
        msg : "Successfully adding cart.",
        data : newCart
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok : false,
      msg : "Somethign went wrong.",
      err : err
    });
  }
}

CTRLS.getCartByProductId = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    let cart = await Order.findOne({ client : mongoose.Types.ObjectId(userId), active : true });
    let qty = 0;
    if (cart) {
      //cart exists for user
      let itemIndex = cart.orderItems.findIndex(p => p.product == productId);

      if (itemIndex > -1) {
        //product exists in the cart, update the quantity
        let productItem = cart.orderItems[itemIndex];
        qty = productItem.qty;
      } else {
        //product does not exists in cart, add new item
        qty = 0;
      }
      return res.status(201).json({
        ok : true,
        qty,
        msg : "Success"
      });
    } else {
      //no cart for user, create new cart
      return res.status(201).json({
        ok : true,
        qty : 0,
        msg : "There is no cart for you."
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok : false,
      msg : "Something went wrong"
    });
  }
}
CTRLS.getCart = async (req, res) => {
  const { id } = req.params;
  try {
    let cart = await Order.findOne({ client : mongoose.Types.ObjectId(id), active : true })
    .populate({
      path : "orderItems.product",
      model : "Product",
      populate : {
        path : "category",
        model : "Category"
      }
    });

    if (cart) {
      //cart exists for user
      console.log(cart.orderItems)
      return res.status(201).json({
        ok : true,
        orderItems : cart.orderItems,
        msg : "There are some cart for you."
      });
    } else {
      //no cart for user, create new cart
      return res.status(201).json({
        ok : true,
        orderItems : [],
        msg : "There is no cart for you."
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok : false,
      msg : "Something went wrong"
    });
  }
}
CTRLS.removeCart = async (req, res) => {
  const { productId, userId } = req.body;
  try {
    let cart = await Order.findOne({ client : mongoose.Types.ObjectId(userId), active : true});

    if (cart) {
      //cart exists for user
      let itemIndex = cart.orderItems.findIndex(p => p.product == productId);

      if (itemIndex > -1) {
        //product exists in the cart, update the quantity
        cart.orderItems.splice(itemIndex, 1);
      }
      cart = await cart.save();
      return res.status(201).json({
        ok : true,
        msg : "Successfully Removed.",
        data : cart
      });
    } else {
      //no cart for user, create new cart
      return res.status(201).json({
        ok : true,
        msg : "There is no item for this."
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok : false,
      msg : "Somethign went wrong.",
      err : err
    });
  }
}
CTRLS.emptyCart = async (req, res) => {
  const { id } = req.params;
  try {
    let cart = await Order.findOne({ client : mongoose.Types.ObjectId(id), active : true });
    cart.orderItems = [];
    cart.payment = 0
    let data = await cart.save();
    res.status(200).json({
        ok : true,
        mgs: "Cart Has been emptied",
        data: data
    })
} catch (err) {
    console.log(err)
    res.status(400).json({
        ok : false,
        msg: "Something Went Wrong",
        err: err
    })
}
}
module.exports = CTRLS;
