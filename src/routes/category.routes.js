const { Router } = require('express')

const router = Router()
const categoryCTRL = require('../controllers/categories.controller')
const { isAuth, isAdminAuth } = require('../middlewares/authentication')

router.get('/', categoryCTRL.getCategories)
router.post('/', categoryCTRL.saveCategory)
router.get('/:id', categoryCTRL.getCategory)
router.post('/getCategoryBySlug', categoryCTRL.getCategoryBySlug)
router.get('/getDescendants', categoryCTRL.getDescendants)
router.post('/updateCategory', categoryCTRL.updateCategory)
router.post('/renameCategory', categoryCTRL.renameCategory)
router.delete('/:id', categoryCTRL.deleteCategory)

module.exports = router
