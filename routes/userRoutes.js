const router = require('express').Router()
const userController = require('../controller/userController')

router.get('/', userController.findUsers)
router.post('/', userController.addUser)

module.exports = router