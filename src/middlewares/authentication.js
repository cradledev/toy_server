const config = require("../config/config");
const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  try {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        if (token) {
          jwt.verify(token, config.secretKey, (err, user) => {
            if (err) {
              return res.status(500).json({
                ok: false,
                msg: "Token is invalid!",
              });
            }
        
            req.user = user.data;
        
            next();
          });
        } else {
          return res.status(500).json({
            ok: false,
            msg: "Token is invalid!",
          });
        }
    } else {
      return res.status(500).json({
        ok: false,
        msg: "Token is invalid!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Token is invalid!",
    });
  }
};
const isAdminAuth = (req, res, next) => {
  try {
      if (req.headers.authorization) {
          const token = req.headers.authorization.split(" ")[1];
          if (token) {
            jwt.verify(token, config.secretKey, (err, user) => {
              if (err) {
                return res.status(500).json({
                  ok: false,
                  msg: "Token is invalid!",
                });
              }
          
              req.user = user.data;
              if (user.data.role != "ADMIN" || user.data.role != "SUPERADMIN") {
                return res.status(500).json({
                  ok: false,
                  msg: "Token is invalid!",
                });
              }
              next();
            });
          } else {
            return res.status(500).json({
              ok: false,
              msg: "Token is invalid!",
            });
          }
      } else {
        return res.status(500).json({
          ok: false,
          msg: "Token is invalid!",
        });
      }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Token is invalid!",
    });
  }
};

const token_image = (req, res, next) => {
  try {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        if (token) {
          jwt.verify(token, config.secretKey, (err, user) => {
            if (err) {
              return res.status(500).json({
                ok: false,
                msg: "Token is invalid!",
              });
            }
        
            req.user = user.data;
        
            next();
          });
        } else {
          return res.status(500).json({
            ok: false,
            msg: "Token is invalid!",
          });
        }
    } else {
      return res.status(500).json({
        ok: false,
        msg: "Token is invalid!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Token is invalid!",
    });
  }
};

module.exports = {
  isAuth,
  token_image,
  isAdminAuth
}
