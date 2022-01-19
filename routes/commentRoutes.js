const router = require('express').Router()
const commentController = require('../controller/commentController')

router.get('/:postId', commentController.findComments)
router.post('/:postId', commentController.addComment)
router.get('/:postId/:id', commentController.findComment)
router.patch('/:postId/:id', commentController.editComment)
router.delete('/:postId/:id', commentController.deleteComment)

module.exports = router