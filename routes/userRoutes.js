const router = require('express').Router()
const userController = require('../controller/userController')

router.get('/', userController.findUsers)
router.post('/', userController.addUser)
router.post('/login', userController.login)
// update user
// delete user

module.exports = router

// 1 login register
// 2 setup sisa model
// 3 setup routes/controller (update/delete user & post)