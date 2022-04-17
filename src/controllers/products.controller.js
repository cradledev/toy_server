const  mongoose = require('mongoose');
const Product = require("../models/Product");
const CategoryM = require("../models/Category");
const path = require("path");

const CTRLS = {};

CTRLS.getProducts = async (req, res) => {
  const q = req.body.q ? req.body.q : ''
  const sort = req.body.sort;
  const sortColumn = req.body.sortColumn;
  const category = req.body.category ? req.body.category : null
  const status = req.body.status;

  const perPage = req.body.perPage;
  const page = Math.max(0, req.body.page);
  let query = {
    status : true,
    $or: [
      { 'name': { '$regex': q, '$options': 'i' } },
      { 'description': { '$regex': q, '$options': 'i' } }
    ]};
  if (status == "empty") {
    query = {
      $or : [{'status' : true}, {'status' : false}],
      $or: [
        { 'name': { '$regex': q, '$options': 'i' } },
        { 'description': { '$regex': q, '$options': 'i' } }
      ]};
  } else {
    query = {
      status : status == "active" ? true : false ,
      $or: [
        { 'name': { '$regex': q, '$options': 'i' } },
        { 'description': { '$regex': q, '$options': 'i' } }
    ]};
  }
  let _category;
  if (category != null) {
    _category = await CategoryM.find({ "ancestors._id":  category }, {"_id": 1}).exec()
    let _ancestorsIds = _category.map(el => el._id)
    if (status == "empty") {
      query = {
        $and : [
           { $or : [
            { 'name': { '$regex': q, '$options': 'i' } },
            { 'description': { '$regex': q, '$options': 'i' } }
          ]}, 
          { $or : [ 
            {"category" : {$in : _ancestorsIds } },
            {"category" : category }
          ]},
        ],
        $or : [{'status' : true}, {'status' : false}]
      };
    } else {
      query = {
        $and : [
           { $or : [
            { 'name': { '$regex': q, '$options': 'i' } },
            { 'description': { '$regex': q, '$options': 'i' } }
          ]}, 
          { $or : [ 
            {"category" : {$in : _ancestorsIds } },
            {"category" : category }
          ]},
        ],
        status : status == "active" ? true : false ,
      };
    }
  }
  const sortContent = {}
  if(sortColumn != null) {
    sortContent[sortColumn] = sort;
  }
  const isEmpty = Object.keys(sortContent).length === 0
  if(isEmpty) {
    sortContent.createdAt = "-1"
  }
  
  Product.find({...query})
  .populate('category')
  .populate('events')
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
    Product.countDocuments({...query}).exec((err, count) => {
      return res.json({
          ok : true,
          products,
          total: count
      })
    })
  })

};

CTRLS.searhProductsByName = (req, res) => {
  const q = req.body.q ? req.body.q : ''
  let query = {
    status : true,
    $or: [
      { 'name': { '$regex': q, '$options': 'i' } },
      { 'description': { '$regex': q, '$options': 'i' } }
    ]
  };
  const perPage = req.body.perPage;
  const page = Math.max(0, req.body.page);
  Product.find({...query})
    .populate('category')
    .populate('events')
    .limit(perPage * 1)
    .skip(perPage * (page * 1 - 1))
    .exec((err, products) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          err,
        });
      }
      Product.countDocuments({...query}).exec((err, count) => {
        return res.json({
          ok : true,
          products,
          total: count
        })
      })
    }
  );
}
CTRLS.getProductsByCategorySlug = async (req, res) => {
  const category = await CategoryM.find({ slug: { '$regex': req.body.slug, '$options': 'i' } })
      .select({
        "_id": true, 
       })
      .exec();
  console.log(req.body.slug)
  let category_ids = category.map(el => el._id)
  console.log(category_ids)
  let query = {
    status : true,
    category : {$in : category_ids}
  };
  const perPage = req.body.perPage;
  const page = Math.max(0, req.body.page);
  Product.find({...query})
    .populate('category')
    .populate('events')
    .limit(perPage * 1)
    .skip(perPage * (page * 1 - 1))
    .exec((err, products) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          err,
        });
      }
      Product.countDocuments({...query}).exec((err, count) => {
        return res.json({
          ok : true,
          products,
          total: count
        })
      })
    }
  );
}

CTRLS.getRecommendProducts = async (req, res) => {
  let query = {
    status : true,
    recommend : true
  };
  const perPage = req.body.perPage;
  const page = Math.max(0, req.body.page);
  Product.find({...query})
    .populate('category')
    .populate('events')
    .limit(perPage * 1)
    .skip(perPage * (page * 1 - 1))
    .exec((err, products) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          err,
        });
      }
      Product.countDocuments({...query}).exec((err, count) => {
        return res.json({
          ok : true,
          products,
          total: count
        })
      })
    }
  );
}

CTRLS.getNewArrival = (req, res) => {
  const perPage = req.body.perPage;
  const page = Math.max(0, req.body.page);

  //Get today's date using the JavaScript Date object.
  const fromDate = new Date();
  //Change it so that it is 7 days in the past.
  var pastDate = fromDate.getDate() - 7;
  fromDate.setDate(pastDate);
  console.log(fromDate);
  const toDate = new Date(); 
  Product.find({createdAt:{$gte:fromDate,$lte:toDate}, status : true})
  .populate('category')
  .populate('events')
  .limit(perPage * 1)
  .skip(perPage * (page * 1 - 1))
  .exec((err, products) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }
    Product.countDocuments({createdAt:{$gte:fromDate,$lte:toDate}, status : true}).exec((err, count) => {
      return res.json({
        ok : true,
        products,
        total: count
      })
    })
  })
}
CTRLS.getProduct = (req, res) => {
  const { id } = req.params;
  Product.findById(id).populate('events').exec((err, product) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }
    console.log(product)
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
      description: req.body.description ? req.body.description : null,
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
    let s = req.body.events.map(element => mongoose.Types.ObjectId(element))
    if(req.body.category) product.category = req.body.category;
    if(req.body.name) product.name = req.body.name;
    if(req.body.excerpt) product.excerpt = req.body.excerpt;
    if(req.body.description) product.description = req.body.description;
    if(req.body.price) product.price = req.body.price;
    if(req.body.stock) product.stock = req.body.stock;
    if(req.body.status) product.status = req.body.status;
    if (req.body.events) product.events = s;
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
      const _temp = req.body.events.split(",")
      let s = _temp.map(element => mongoose.Types.ObjectId(element))
      if(req.body.category) product.category = req.body.category;
      if(req.body.name) product.name = req.body.name;
      if(req.body.excerpt) product.excerpt = req.body.excerpt;
      if(req.body.description) product.description = req.body.description;
      if(req.body.price) product.price = req.body.price;
      if(req.body.stock) product.stock = req.body.stock;
      if(req.body.status) product.status = req.body.status;
      if (req.body.events) product.events = s;
      product.image = _target_name;

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

CTRLS.asRecommend = (req, res) => {
  const {id, flag} = req.params
  Product.findByIdAndUpdate(id, { recommend : flag }, { new: true }, (err, updProduct) => {
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
}
CTRLS.viewImage = (req, res) => {
  const urlImage = path.join(
    __dirname,
    "./../../uploads/products",
    req.params.img // /products/image/:img
  );
  return res.sendFile(urlImage);
};

module.exports = CTRLS;
