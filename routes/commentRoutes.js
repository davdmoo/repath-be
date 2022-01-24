const router = require('express').Router()
const commentController = require('../controller/commentController')

router.get('/:postId', commentController.findComments)
router.post('/:postId', commentController.addComment)
router.put('/:id', commentController.editComment)
router.delete('/:id', commentController.deleteComment)
router.get('/:postId/:id', commentController.findComment)
router.put('/:id', commentController.editComment)
router.delete('/:id', commentController.deleteComment)

module.exports = router