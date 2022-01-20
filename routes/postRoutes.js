const router = require('express').Router()
const commentRoutes = require('./commentRoutes')
const likesRoutes = require('./likesRoutes')
const postController = require('../controller/postController')
const authentication = require("../middlewares/authentication")
const multer = require('multer');
const imagekit = require('../middlewares/imagekit')
const {sizeValidation, typeValidation} = require('../middlewares/imageValidation')

const storage = multer.memoryStorage()
const upload = multer({
    storage,
})


router.get('/', postController.findPosts)
<<<<<<< HEAD
router.post('/',authentication, postController.addPost)
=======
router.post('/',authentication, upload.single('imgUrl'),imagekit,sizeValidation,typeValidation,postController.addPost)
>>>>>>> 9fb38e90fc3939dbf0cfc22b7819a52c0a80fb9b
router.get('/:id', postController.findPost)
router.patch('/:id', postController.editPost)
router.delete('/:id', postController.deletePost)
// router.use('/:id/comments', commentRoutes)
// router.use('/:id/likes', likesRoutes)

module.exports = router