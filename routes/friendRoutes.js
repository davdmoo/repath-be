const router = require('express').Router()
const friendController = require('../controller/friendController')

router.get('/', friendController.findFriends)
router.get('/requests', friendController.getRequest)
router.post('/:followId', friendController.addFriend)
router.patch('/:followId', friendController.accFriend)
router.delete('/:followId', friendController.delFriend)

module.exports = router