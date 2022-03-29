const User = require("../models/User");
const bcrypt = require("bcrypt");

const CTRLS = {};

CTRLS.getUsers = (req, res) => {
  User.find({})
    .sort({ createdAt: "DESC" })
    .where({ status: true })
    .exec((err, users) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          err,
        });
      }
      return res.json(users);
    });
};

CTRLS.getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id).exec((err, user) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }
    return res.json({ ok:true, user});
  });
};

CTRLS.saveUser = (req, res) => {
  const user = new User({
    firstname: req.body.firstname,
    email: req.body.email,
    lastname: req.body.lastname,
    password: bcrypt.hashSync(req.body.password, 10),
    avatar: req.body.avatar?req.body.avatar:null,
    role: req.body.role?req.body.role : "USER",
    status: true,
    bio : req.body.bio?req.body.bio:null
  });
  
  // console.log(req.body);

  user.save((err, newUser) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }

    res.status(201).json({
      ok: true,
      user: newUser,
    });
  });
};

CTRLS.updateUser = (req, res) => {
  const { id } = req.params;
  const user = {};
  if(req.body.firstname) user.firstname = req.body.firstname;
  if(req.body.email) user.email = req.body.email;
  if(req.body.lastname) user.lastname = req.body.lastname;
  if(req.body.avatar) user.avatar = req.body.avatar;
  if(req.body.role) user.role = req.body.role;
  if(req.body.status) user.status = req.body.status;
  if(req.body.bio) user.bio = req.body.bio;
  if(req.body.password) user.password = bcrypt.hashSync(req.body.password, 10);
  User.findByIdAndUpdate(id, user, { new: true }, (err, updUser) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }

    res.status(201).json({
      ok: true,
      user: updUser,
    });
  });
};

CTRLS.deleteUser = (req, res) => {
  const { id, status } = req.params;
  User.findByIdAndUpdate(id, { status }, { new: true }, (err, delUser) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }

    res.status(201).json({
      ok: true,
      user: delUser,
    });
  });
};

module.exports = CTRLS;
