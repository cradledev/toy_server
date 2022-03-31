const { Router } = require('express')

const router = Router()
const userCTRL = require('../controllers/users.controller')
const { isAuth, isAdminAuth} = require('../middlewares/authentication')

router.get('/', userCTRL.getUsers)
router.get('/:id', userCTRL.getUser)
router.post('/filterData', userCTRL.getUserByFilter)
router.post('/', userCTRL.saveUser)
router.put('/:id', userCTRL.updateUser)
router.delete('/:id/:status', userCTRL.deleteUser)


module.exports = router