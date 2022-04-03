const { Router } = require('express')

const router = Router()
const productCTRL = require('../controllers/products.controller')
const { isAuth, token_image } = require('../middlewares/authentication')

router.post('/getProducts', productCTRL.getProducts)
router.get('/:id', productCTRL.getProduct)
router.post('/', productCTRL.saveProduct)
router.put('/updateProduct/:id', productCTRL.updateProduct)

router.delete('/:id/:status', productCTRL.deleteProduct)

router.get('/image/:img', productCTRL.viewImage)
module.exports = router