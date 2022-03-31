const { Router } = require("express");

const router = Router();
const authCTRL = require("../controllers/auth/auth.controller");
const {isAuth} = require('../middlewares/authentication')

router.post("/login", authCTRL.login);
router.post("/signup", authCTRL.signup);
router.post("/logout", authCTRL.logout);
router.post("/isValidToken", authCTRL.tokenValidation)

module.exports = router;
