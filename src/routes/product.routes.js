const { Router } = require('express')

const router = Router()
const productCTRL = require('../controllers/products.controller')
const { isAuth, token_image } = require('../middlewares/authentication')

router.post('/getProducts', productCTRL.getProducts)
router.get('/:id', productCTRL.getProduct)
router.post('/', productCTRL.saveProduct)
router.put('/updateProduct/:id', productCTRL.updateProduct)
router.put('/asrecommend/:id/:flag', productCTRL.asRecommend)

router.delete('/:id/:status', productCTRL.deleteProduct)

router.get('/image/:img', productCTRL.viewImage)
// get products according to the categroy from mobile
router.post('/newarrival', productCTRL.getNewArrival)
router.post('/getProductsByCategroySlug', productCTRL.getProductsByCategorySlug)
router.post('/getRecommendProducts', productCTRL.getRecommendProducts)
router.post('/searchProduct', productCTRL.searhProductsByName)
module.exports = router