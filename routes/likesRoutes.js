const router = require('express').Router()
const likesController = require('../controller/likesController')

router.get('/', likesController.findLikes)
router.post('/', likesController.addLike)
router.get('/:id', likesController.findLike)
router.patch('/:id', likesController.editLike)
router.delete('/:id', likesController.deleteLike)

module.exports = router