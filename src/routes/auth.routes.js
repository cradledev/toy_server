const { Router } = require("express");

const router = Router();
const authCTRL = require("../controllers/auth/auth.controller");
const {isAuth} = require('../middlewares/authentication')

router.post("/login", authCTRL.login);
router.post("/signup", authCTRL.signup);
router.post("/logout", isAuth, authCTRL.logout);

module.exports = router;
