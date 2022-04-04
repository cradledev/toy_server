const Product = require("../models/Product");
const CategoryM = require("../models/Category");
const path = require("path");

const CTRLS = {};

CTRLS.getProducts = async (req, res) => {
  const sort = req.body.sortBy ? req.body.sortBy : null;
  const q = req.body.q ? req.body.q : ''
  
  const category = req.body.category ? req.body.category : null

  const perPage = req.body.perPage;
  const page = Math.max(0, req.body.page);
  let query = {
    $or: [
      { 'name': { '$regex': q, '$options': 'i' } },
      { 'description': { '$regex': q, '$options': 'i' } }
    ]};
  
  const whereQuery = {status: true};
  let _category;
  if (category != null) {
    _category = await CategoryM.find({ "ancestors._id":  category }, {"_id": 1}).exec()
    let _ancestorsIds = _category.map(el => el._id)
    query = {
      $and : [
         { $or : [
          { 'name': { '$regex': q, '$options': 'i' } },
          { 'description': { '$regex': q, '$options': 'i' } }
        ]}, 
        { $or : [ 
          {"category" : {$in : _ancestorsIds } },
          {"category" : category }
        ]}
      ]
      };
  }
  const sortContent = {}
  if (sort == "price-asc") {
    sortContent.price = "1";
  }
  if (sort == "price-desc") {
    sortContent.price = "-1";
  }
  const isEmpty = Object.keys(sortContent).length === 0
  if(isEmpty) {
    sortContent.createdAt = "-1"
  }
  
  Product.find({...query})
  .where({...whereQuery})
  .populate('category')
  .limit(perPage * 1)
  .skip(perPage * (page * 1 - 1))
  .sort(sortContent)
  .exec((err, products) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }
    Product.countDocuments().exec((err, count) => {
      return res.json({
          ok : true,
          products,
          total: count
      })
    })
  })

};

CTRLS.getProduct = (req, res) => {
  const { id } = req.params;
  Product.findById(id).exec((err, product) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }
    return res.json({ ok:true, product});
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
      excerpt: req.body.excerpt ? req.body.excerpt : null,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      image: _target_name,
      status: req.body.status ? req.body.status : true
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
      product.image = _target_name;
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
