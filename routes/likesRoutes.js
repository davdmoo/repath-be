const router = require('express').Router()
const likesController = require('../controller/likesController')
const authentication = require("../middlewares/authentication");

router.use(authentication)
router.get('/:postId', likesController.findLikes)
router.get('/:userId', likesController.findLikesByUser)
router.post('/:postId', likesController.addLike)
router.get('/:id', likesController.findLike)
router.patch('/:id', likesController.editLike)
router.delete('/:id', likesController.deleteLike)

module.exports = router