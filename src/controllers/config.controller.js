const Slider = require("../models/Slider");
const path = require("path");
const CTRLS = {};

CTRLS.getSliders = (req, res) => {
    Slider.find({})
    .where({status : true})
    .sort({ order: "DESC" })
    .exec((err, sliders) => {
        if (err) {
            return res.json ({
                ok : false, msg : "Somethign went wrong."
            });
        }
      return res.json({ok : true, sliders});
    });
};

CTRLS.getSliderByFilter = (req, res) => {
  const sort = req.body.sort;
  const sortColumn = req.body.sortColumn;
  const perPage = req.body.perPage;
  const status = req.body.status;
  const page = Math.max(0, req.body.page);
  const sortContent = {}
  if(sortColumn != null) {
    sortContent[sortColumn] = sort;
  }
  const whereQuery = {};
  if (status == "active") {
    whereQuery.status = true;
  } 
  if (status == "inactive" ) {
    whereQuery.status = false;
  }
  if(status == "empty" || status == null) {
    Slider.find({})
    .limit(perPage * 1)
    .skip(perPage * (page * 1 - 1))
    .sort(sortContent)
    .exec((err, sliders) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          err,
        });
      }
      Slider.find({}).count().exec((err, count) => {
        return res.json({
            ok : true,
            sliders: sliders,
            page: page,
            totalPages: Math.ceil(count / perPage)
        })
      })
    })
  } else {
    Slider.find({})
    .where(whereQuery)
    .limit(perPage * 1)
    .skip(perPage * (page * 1 - 1))
    .sort(sortContent)
    .exec((err, sliders) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          err,
        });
      }
      Slider.find({}).where(whereQuery).count().exec((err, count) => {
        return res.json({
            ok : true,
            sliders: sliders,
            page: page,
            totalPages: Math.ceil(count / perPage)
        })
      })
    })
  }
  
  
}

CTRLS.getSlider = (req, res) => {
    const { id } = req.params;
    Slider.findById(id).exec((err, slider) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          err,
        });
      }
      return res.json({ ok:true, slider});
    });
};


CTRLS.saveSlider = (req, res) => {
    if (!req.files) {
        return res.json({ ok:false, msg: "No files where uploaded!" });
    }
    const image = req.files.image;
    const _temp_result = path.parse(image.name);
    const _target_name = Date.now() + _temp_result.name + _temp_result.ext;

    const body = req.body;
    image.mv(`uploads/sliders/${_target_name}`, (err) => {
        if (err) {
          return res.status(500).json({ok:false, err});
        }
        const slider = new Slider({
            image: _target_name,
            title: body.title ? body.title : "",
            order: body.order ? body.order : 0,
            status : true
        });
        console.log(slider)
        slider.save((err, newSlider) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    err,
                });
            }
    
            res.status(201).json({
                ok: true,
                slider: newSlider,
            });
        });
    });
    
};

CTRLS.updateSlider = (req, res) => {
    const { id } = req.params;
    let slider = {}
    if (!req.files) {
      if(req.body.title) slider.title = req.body.title;
      if(req.body.order) slider.order = req.body.order;
      if(req.body.status) slider.status = req.body.status;
        Slider.findByIdAndUpdate(id, slider, { new: true }, (err, updSlider) => {
          if (err) {
            return res.status(401).json({
              ok: false,
              err,
            });
          }
      
          res.status(201).json({
            ok: true,
            slider: updSlider,
          });
        });
      } else {
        const image = req.files.image;
        const _temp_result = path.parse(image.name);
        const _target_name = Date.now() + _temp_result.name + _temp_result.ext;
        image.mv(`uploads/sliders/${_target_name}`, (err) => {
          if (err) {
            return res.status(500).send(err);
          }
          if(req.body.title) slider.title = req.body.title;
          if(req.body.order) slider.order = req.body.order;
          if(req.body.status) slider.status = req.body.status;
          slider.image = _target_name;
          console.log(slider);
    
          Slider.findByIdAndUpdate(id, slider, { new: true }, (err, updSlider) => {
            if (err) {
              return res.status(401).json({
                ok: false,
                err,
              });
            }
        
            res.status(201).json({
              ok: true,
              slider: updSlider,
            });
          });
        });
      }
};

CTRLS.deleteSlider = (req, res) => {
    const { id, status } = req.params;
    Slider.findByIdAndUpdate(id, { status }, { new: true }, (err, delSlider) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err,
            });
        }

        res.status(201).json({
            ok: true,
            slider: delSlider,
        });
    });
};

CTRLS.viewImage = (req, res) => {
    const urlImage = path.join(
        __dirname,
        "./../../uploads/sliders",
        req.params.img // /products/image/:img
    );
    return res.sendFile(urlImage);
};
module.exports = CTRLS;
