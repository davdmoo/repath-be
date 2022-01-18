const router = require('express').Router()
const postController = require('../controller/postController')

router.get('/', postController.findPosts)
router.post('/', postController.addPost)
router.get('/:id', postController.findPost)
router.patch('/:id', postController.editPost)
router.delete('/:id', postController.deletePost)

module.exports = router