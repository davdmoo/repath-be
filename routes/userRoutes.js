const router = require('express').Router()
const userController = require('../controller/userController')
const authentication = require("../middlewares/authentication")

const multer = require('multer');
const imagekit = require('../middlewares/imagekit')
const {sizeValidation, typeValidation} = require('../middlewares/imageValidation')

const storage = multer.memoryStorage()
const upload = multer({
    storage,
})

router.post('/googleLogin', userController.googleLogin)
router.post('/register', userController.addUser)
router.post('/login', userController.login)

router.use(authentication)

router.get('/', userController.findUsers)
router.get('/:id', userController.findUserById)
router.put('/:id',upload.single('imgUrl'),imagekit,sizeValidation,typeValidation, userController.editUser)
router.delete('/:id', userController.deleteUser)

module.exports = router