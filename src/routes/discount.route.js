const { Router } = require("express");

const router = Router();
const discountCTRL = require("../controllers/promotion/discount.controller");
const {isAuth} = require('../middlewares/authentication')

router.get("/couponCode", discountCTRL.generateCouponCode);
router.post('/', discountCTRL.saveDiscount);
router.post('/filterData', discountCTRL.getDiscountByFilter)
router.get('/:id', discountCTRL.getDiscount)
router.put('/updateDiscount/:id', discountCTRL.updateDiscount)
router.delete('/:id/:status', discountCTRL.deleteDiscount)
router.post('/assignedProductDiscounts', discountCTRL.getProductDiscounts)

module.exports = router;
