const Product = require("../models/Product");
const path = require("path");

const CTRLS = {};

CTRLS.getProducts = (req, res) => {
  Product.find({})
    .sort({ createdAt: "DESC" })
    .where({ status: true })
    .populate("category")
    .exec((err, products) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          err,
        });
      }
      return res.json({ ok : true, products});
    });
};

CTRLS.getProduct = (req, res) => {
  const { id } = req.params;
  Product.findById(id).exec((err, user) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }
    return res.json({ ok:true, user});
  });
};

CTRLS.saveProduct = (req, res) => {
  if (!req.files) {
    return res.json({ ok:false, msg: "No files where uploaded!" });
  }

  const image = req.files.image;
  const _temp_result = path.parse(image.name);
  const _target_name = Date.now() + _temp_result.name + _temp_result.ext;
  image.mv(`uploads/products/${_target_name}`, (err) => {
    if (err) {
      return res.status(500).json({ok:false, err});
    }

    const product = new Product({
      category: req.body.category,
      name: req.body.name,
      excerpt: req.body.excerpt,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      image: _target_name,
      status: req.body.status,
    });
    product.save((err, newProduct) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          err,
        });
      }

      res.status(201).json({
        ok: true,
        product: newProduct,
      });
    });
  });
};

CTRLS.updateProduct = (req, res) => {
  const { id } = req.params;
  let product = {}
  if (!req.files) {
    if(req.body.category) product.category = req.body.category;
    if(req.body.name) product.name = req.body.name;
    if(req.body.excerpt) product.excerpt = req.body.excerpt;
    if(req.body.description) product.description = req.body.description;
    if(req.body.price) product.price = req.body.price;
    if(req.body.stock) product.stock = req.body.stock;
    if(req.body.status) product.status = req.body.status;
    Product.findByIdAndUpdate(id, product, { new: true }, (err, updProduct) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          err,
        });
      }
  
      res.status(201).json({
        ok: true,
        product: updProduct,
      });
    });
  } else {
    const image = req.files.image;
    const _temp_result = path.parse(image.name);
    const _target_name = Date.now() + _temp_result.name + _temp_result.ext;
    image.mv(`uploads/products/${_target_name}`, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      if(req.body.category) product.category = req.body.category;
      if(req.body.name) product.name = req.body.name;
      if(req.body.excerpt) product.excerpt = req.body.excerpt;
      if(req.body.description) product.description = req.body.description;
      if(req.body.price) product.price = req.body.price;
      if(req.body.stock) product.stock = req.body.stock;
      if(req.body.status) product.status = req.body.status;
      if(req.body.image) product.image = _target_name;
      console.log(product);

      Product.findByIdAndUpdate(id, product, { new: true }, (err, updProduct) => {
        if (err) {
          return res.status(401).json({
            ok: false,
            err,
          });
        }
    
        res.status(201).json({
          ok: true,
          product: updProduct,
        });
      });
    });
  }

  
};

CTRLS.deleteProduct = (req, res) => {
  const { id, status } = req.params;
  Product.findByIdAndUpdate(id, { status }, { new: true }, (err, delProduct) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }

    res.status(201).json({
      ok: true,
      product: delProduct,
    });
  });
};

CTRLS.viewImage = (req, res) => {
  const urlImage = path.join(
    __dirname,
    "./../../uploads/products",
    req.params.img // /products/image/:img
  );
  return res.sendFile(urlImage);
};

module.exports = CTRLS;
