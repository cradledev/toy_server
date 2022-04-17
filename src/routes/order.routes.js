const { Router } = require('express')

const router = Router()

const orderCTRLS = require('../controllers/orders.controller')

router.get('/', orderCTRLS.getOrders)
router.post('/', orderCTRLS.saveOrder)
router.post('/addCart', orderCTRLS.addCart)
router.get('/getCart/:id', orderCTRLS.getCart)
router.post('/emptyCart/:id', orderCTRLS.emptyCart)
router.post('/removeCartItem', orderCTRLS.removeCart)
router.post('/getCartByProductId', orderCTRLS.getCartByProductId)
module.exports = router