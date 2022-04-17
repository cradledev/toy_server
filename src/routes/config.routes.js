const { Router } = require('express')

const router = Router()
const sliderCTRL = require('../controllers/config.controller')
const { isAuth, token_image } = require('../middlewares/authentication')

router.get('/slider', sliderCTRL.getSliders)
router.get('/slider/:id', sliderCTRL.getSlider)
router.post('/slider', sliderCTRL.saveSlider)
router.post('/slider/filterData', sliderCTRL.getSliderByFilter)
router.put('/updateSlider/:id', sliderCTRL.updateSlider)

router.delete('/slider/:id/:status', sliderCTRL.deleteSlider)

router.get('/sliderimage/:img', sliderCTRL.viewImage)
module.exports = router