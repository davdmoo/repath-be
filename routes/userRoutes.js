const router = require('express').Router()
const userController = require('../controller/userController')
const authentication = require("../middlewares/authentication")

router.post('/register', userController.addUser)
router.post('/login', userController.login)

router.use(authentication)

router.get('/', userController.findUsers)
router.put('/:id', userController.editUser)
router.delete('/:id', userController.deleteUser)

module.exports = router