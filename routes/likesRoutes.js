const router = require('express').Router()
const likesController = require('../controller/likesController')

router.get('/', likesController.findLikesByUser)
router.get('/:postId', likesController.findLikes)
router.post('/:postId', likesController.addLike)
// router.get('/:id', likesController.findLike)
// router.put('/:id', likesController.editLike)
router.delete('/:id', likesController.deleteLike)

module.exports = router