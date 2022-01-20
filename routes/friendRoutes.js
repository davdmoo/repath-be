const router = require('express').Router()
const friendController = require('../controller/friendController')
const authentication = require("../middlewares/authentication");

router.use(authentication)
router.get('/', friendController.findFriends)
router.post('/:friendId', friendController.addFriend)
router.delete('/:friendId', friendController.deleteFriend)

module.exports = router