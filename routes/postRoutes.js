const router = require('express').Router()
const commentRoutes = require('./commentRoutes')
const likesRoutes = require('./likesRoutes')
const postController = require('../controller/postController')
const authentication = require("../middlewares/authentication")

router.use(authentication)
router.get('/', postController.findPosts)
router.post('/', postController.addPost)
router.get('/:id', postController.findPost)
router.patch('/:id', postController.editPost)
router.delete('/:id', postController.deletePost)
// router.use('/:id/comments', commentRoutes)
// router.use('/:id/likes', likesRoutes)

module.exports = router