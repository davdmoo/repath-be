const router = require('express').Router()
const friendController = require('../controller/friendController')

router.get('/', friendController.findFriends)
router.get('/requests', friendController.getRequest)
router.post('/:followId', friendController.addFriend)
router.patch('/:reqId', friendController.accFriend)
router.delete('/:reqId', friendController.delFriend)

module.exports = router