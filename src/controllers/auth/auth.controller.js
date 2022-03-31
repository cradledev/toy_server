const config = require("../../config/config");

const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const CTRLS = {};

CTRLS.login = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!user) {
      return res.status(201).json({
        ok: false,
        msg: "Username invalid!",
      });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(201).json({
        ok: false,
        msg: "Password invalid!",
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
    firstname: req.body.firstname,
    email: req.body.email,
    lastname: req.body.lastname,
    password: bcrypt.hashSync(req.body.password, 10)
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

CTRLS.logout = (req, res) => {
  res.clearCookie('jwt');
  const token = req.headers.authorization.split(" ")[1];
  jwt.sign(token, "", { expiresIn: 1 } , (logout, err) => {
    if (logout) {
      res.json({msg : 'You have been Logged Out', ok : true});
    } else {
      res.json({msg:'Error', ok : false});
    }
  });
}

CTRLS.tokenValidation = (req, res) => {
  const token = req.body.token;
  jwt.verify(token, config.secretKey, (err, user) => {
    if (err) {
      return res.status(201).json({
        ok: false,
        msg: "Token is invalid!",
      });
    }
    return res.json({ok:true, msg : "Token is valid."})
  });
}
module.exports = CTRLS;
