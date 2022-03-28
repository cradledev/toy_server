const Product = require("../models/Product");
const path = require("path");

const CTRLS = {};

CTRLS.getProducts = (req, res) => {
  Product.find({})
    .sort({ createdAt: "DESC" })
    .where({ status: true })
    .populate("category")
    .exec((err, products) => {
      return res.json(products);
    });
};

CTRLS.getProduct = (req, res) => {};

CTRLS.saveProduct = (req, res) => {
  if (!req.files) {
    return res.json({ msg: "No files where uploaded!" });
  }

  const image = req.files.image;

  image.mv(`uploads/products/${image.name}`, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    const product = new Product({
      category: req.body.category,
      name: req.body.name,
      excerpt: req.body.excerpt,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      image: image.name,
      status: req.body.status,
    });

    console.log(product);

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
    product = {
      category: req.body.category,
      name: req.body.name,
      excerpt: req.body.excerpt,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      image: req.body.image,
      status: req.body.status,
    };
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

    image.mv(`uploads/products/${image.name}`, (err) => {
      if (err) {
        return res.status(500).send(err);
      }

      product = {
        category: req.body.category,
        name: req.body.name,
        excerpt: req.body.excerpt,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        image: image.name,
        status: req.body.status,
      };

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
