const router = require('express').Router()
const postController = require('../controller/postController')

router.get('/', postController.findPosts)
router.get('/:id', postController.findPost)
router.post('/', postController.addPost)


module.exports = router