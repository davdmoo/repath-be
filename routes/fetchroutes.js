const router = require('express').Router()
const fetchController = require('../controller/fetchcontroller')


router.get('/musics',fetchController.showAllMusic)
router.get('/locations',fetchController.showAllLocations)

module.exports = router