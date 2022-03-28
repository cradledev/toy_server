const config = require("../../config/config");

const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const CTRLS = {};

CTRLS.login = (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "Username or Password invalid!",
      });
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(404).json({
        ok: false,
        msg: "Username or Password invalid!",
      });
    }

    let token = jwt.sign({
        data: user,
    }, config.secretKey, { expiresIn: "1h" });

    res.status(201).json({
      ok: true,
      user,
      token
    })
  });
};

CTRLS.signup = (req, res) => {
  const user = new User({
    displayName: req.body.displayName,
    email: req.body.email,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    avatar: req.body.avatar,
    role: req.body.role,
    status: req.body.status,
  });

  console.log(req.body);

  user.save((err, newUser) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }
    let token = jwt.sign({
      data: user,
    }, config.secretKey, { expiresIn: "1h" });
    res.status(201).json({
      ok: true,
      user: newUser,
      token
    });
  });
};

module.exports = CTRLS;
