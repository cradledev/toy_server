const { Router } = require('express')

const router = Router()
const categoryCTRL = require('../controllers/categories.controller')
//const { isAuth } = require('../middlewares/authentication')

router.get('/', categoryCTRL.getCategories)
router.post('/', categoryCTRL.saveCategory)
router.post('/getCategory', categoryCTRL.getCategory)
router.post('/getDescendants', categoryCTRL.getDescendants)
router.post('/updateCategory', categoryCTRL.updateCategory)
router.post('/renameCategory', categoryCTRL.renameCategory)
router.post('/deleteCategory', categoryCTRL.deleteCategory)

module.exports = router
