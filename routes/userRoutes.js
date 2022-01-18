const router = require('express').Router()
const userController = require('../controller/userController')
const authentication = require("../middlewares/authentication")

router.post('/register', userController.addUser)
router.post('/login', userController.login)

router.use(authentication)

router.get('/', userController.findUsers)
router.patch('/:id', userController.editUser)
router.delete('/:id', userController.deleteUser)

module.exports = router

// 1 login register
// 2 setup sisa model
// 3 setup routes/controller (update/delete user & post)