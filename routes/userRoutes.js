const router = require('express').Router()
const userController = require('../controller/userController')

router.get('/', userController.findUsers)
router.post('/register', userController.addUser)
router.post('/login', userController.login)
router.patch('/:id', userController.editUser)
router.delete('/:id', userController.deleteUser)

module.exports = router