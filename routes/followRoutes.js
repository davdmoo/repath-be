const router = require('express').Router()
const followController = require('../controller/followController')

router.get('/', followController.findFollows)
router.post('/:followId', followController.addFollow)
router.delete('/:followId', followController.deleteFollow)
router.get('/followers', followController.findFollowers)

module.exports = router