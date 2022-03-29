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
    name: req.body.category_name,
    parent
  });

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
  let new_parent_id = req.body.new_parent_id?req.body.new_parent_id:null;
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
  let category = {
    name : req.body.category_name,
    slug : slugify(req.body.category_name)
  }
  try {
    const _result = await Category.findByIdAndUpdate(category_id, category, {new : true});
    const _f_result = await Category.updateMany({"ancestors._id": category_id}, {$set : {"ancestors.$.name": category.name, "ancestors.$.slug": category.slug} })
    
    res.status(201).json({ok:true, msg : "Category is renamed successfully."});
  } catch (err) {
    res.status(401).json({ok: false, err});
  }
};
CTRLS.deleteCategory = async (req, res) => {
  let category_id = req.body.category_id
  try {
    err = await Category.findByIdAndRemove(category_id);
    result = await Category.deleteMany({"ancestors._id": category_id});
    res.status(201).json({ok:true, msg : "Category is deleted successfully."});
  } catch (err) {
    res.status(401).json({ok: false, err});
  }
};

const buildAncestors = async (id, parent_id) => {
  try {
    if(parent_id == null) {
      const category = await Category.findByIdAndUpdate(id, { $set: { "ancestors": []} });
    }else {
      let parent_category = await Category.findOne({ "_id": parent_id },{ "name": 1, "slug": 1, "ancestors": 1 }).exec();
      if( parent_category ) {
        const { _id, name, slug } = parent_category;
        const ancest = [...parent_category.ancestors];
        ancest.unshift({ _id, name, slug })
        const category = await Category.findByIdAndUpdate(id, { $set: { "ancestors": ancest} });
      }
    }
    
  } catch (err) {
      console.log(err.message)
  }
}

const buildHierarchyAncestors = async ( category_id, parent_id ) => {
  if( category_id ) {
    buildAncestors(category_id, parent_id)
  }
  const result = await Category.find({ 'parent': category_id }).exec();
  if(result.length > 0) {
    result.forEach((doc) => {
      buildHierarchyAncestors(doc._id, category_id)})
  }
}

function slugify(string) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}
module.exports = CTRLS;
