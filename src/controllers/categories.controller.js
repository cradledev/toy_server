const Category = require("../models/Category");

const CTRLS = {};

CTRLS.getCategories = (req, res) => {
  Category.find({}).exec((err, categories) => {
    return res.json(categories);
  });
};

CTRLS.getCategory = async (req, res) => {
  try {
    const category = await Category.find({ slug: req.body.slug })
      .select({
        "_id": false, 
        "name": true,
        "ancestors.slug": true,
        "ancestors.name": true })
      .exec();
    res.status(201).json({ ok : true, category});
  } catch (err) {
    res.status(401).json( {ok : false , err});
  }
};
// get descendants of selected category
CTRLS.getDescendants = async (req, res) => {
  try {
    const categories = await Category.find({ "ancestors._id":  req.body.category_id })
     .select({ "_id": false, "name": true })
     .exec();
    res.status(201).json({ ok : true, categories });
   } catch (err) {
     res.status(500).json({ ok: false, err});
   }
};

CTRLS.saveCategory = async (req, res) => {
  let parent = req.body.parent ? req.body.parent : null;
  const category = new Category({
    name: req.body.name,
    parent
  });

  console.log(category);
  try {
    let newCategory = await category.save();
    buildAncestors(newCategory._id, parent);
    res.status(201).json({ ok: true, msg: `Category ${newCategory._id}` });
  } catch (err) {
    res.status(401).json({ok:false, err});
  }
};

CTRLS.updateCategory = async (req, res) => {
  let category_id = req.body.category_id;
  let new_parent_id = req.body.new_parent_id;
  try {
    const category = await Category.findByIdAndUpdate(category_id, { $set: { "parent": new_parent_id } });
    buildHierarchyAncestors(category._id, new_parent_id)
    res.status(201).json({ok:true, msg : "success"});
  } catch (err) {
    res.status(401).json({ok: false, err});
  }
};

CTRLS.renameCategory = async (req, res) => {
  let category_id = req.body.category_id
  let category_name = req.body.category_name
  try {
    const _result = await Category.findByIdAndUpdate(category_id, { $set: { "name": category_name, "slug": slugify(category_name) } });
    const _f_result = await Category.update({"ancestors._id": category_id},
    {"$set": {"ancestors.$.name": category_name, "ancestors.$.slug": slugify(category_name) }}, {multi: true});
    res.status(201).json({ok:true, msg : "Category is renamed successfully."});
  } catch (err) {
    res.status(401).json({ok: false, err});
  }
};
CTRLS.deleteCategory = async (req, res) => {
  let category_id = req.body.category_id
  try {
    err = await Category.findByIdAndRemove(category_id);
    if(!err)
      result = await Category.deleteMany({"ancestors._id": category_id});
      res.status(201).json({ok:true, msg : "Category is deleted successfully."});
  } catch (err) {
    res.status(401).json({ok: false, err});
  }
};

const buildAncestors = async (id, parent_id) => {
  try {
      let parent_category = await Category.findOne({ "_id": parent_id },{ "name": 1, "slug": 1, "ancestors": 1 }).exec();
      if( parent_category ) {
         const { _id, name, slug } = parent_category;
         const ancest = [...parent_category.ancestors];
         ancest.unshift({ _id, name, slug })
         const category = await Category.findByIdAndUpdate(id, { $set: { "ancestors": ancest} });
       }
    } catch (err) {
        console.log(err.message)
     }
}

const buildHierarchyAncestors = async ( category_id, parent_id ) => {
  if( category_id && parent_id )
     buildAncestors(category_id, parent_id)
     const result = await Category.find({ 'parent': category_id }).exec();
  if(result) 
     result.forEach((doc) => {
        buildHierarchyAncestors(doc._id, category_id)})
}
module.exports = CTRLS;
