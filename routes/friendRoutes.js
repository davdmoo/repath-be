const router = require('express').Router()
const friendController = require('../controller/friendController')

router.get('/', friendController.findFriends)
router.post('/:friendId', friendController.addFriend)
router.delete('/:friendId', friendController.deleteFriend)

module.exports = router