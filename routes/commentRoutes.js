const router = require('express').Router()
const commentController = require('../controller/commentController')
const authentication = require('../middlewares/authentication')

router.use(authentication)
router.get('/:postId', commentController.findComments)
router.post('/:postId', commentController.addComment)
router.get('/:postId/:id', commentController.findComment)
router.put('/:postId/:id', commentController.editComment)
router.delete('/:postId/:id', commentController.deleteComment)

module.exports = router