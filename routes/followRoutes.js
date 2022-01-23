const router = require('express').Router()
const followController = require('../controller/followController')
const authentication = require('../middlewares/authentication')

router.use(authentication)
router.get('/', followController.findFollows)
router.post('/:followId', followController.addFollow)
router.delete('/:followId', followController.deleteFollow)
router.get('/followers', followController.findFollowers)

module.exports = router