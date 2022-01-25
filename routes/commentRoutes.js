const router = require('express').Router()
const commentController = require('../controller/commentController')

// router.get('/:id', commentController.findComment)
router.get('/:postId', commentController.findComments)
router.post('/:postId', commentController.addComment)
router.put('/:id', commentController.editComment)
router.delete('/:id', commentController.deleteComment)
router.put('/:id', commentController.editComment)
router.delete('/:id', commentController.deleteComment)

module.exports = router