const { Router } = require('express')

const router = Router()
const categoryCTRL = require('../controllers/categories.controller')
const { isAuth, isAdminAuth } = require('../middlewares/authentication')

router.get('/', isAuth, categoryCTRL.getCategories)
router.post('/', isAuth, categoryCTRL.saveCategory)
router.get('/getCategory', isAuth, categoryCTRL.getCategory)
router.get('/getDescendants', isAuth, categoryCTRL.getDescendants)
router.post('/updateCategory', isAdminAuth, categoryCTRL.updateCategory)
router.post('/renameCategory', isAdminAuth, categoryCTRL.renameCategory)
router.post('/deleteCategory', isAdminAuth, categoryCTRL.deleteCategory)

module.exports = router
