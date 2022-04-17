const { Router } = require("express");

const router = Router();
const wishlistCTRL = require("../controllers/wishlist.controller");
const {isAuth} = require('../middlewares/authentication')

router.get("/:id", wishlistCTRL.getItems);
router.post("/", wishlistCTRL.saveWishlist)
router.post("/deleteItemFromWishlist", wishlistCTRL.deleteWishlistItem)

module.exports = router;
