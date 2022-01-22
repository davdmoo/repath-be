const router = require('express').Router()
const fetchController = require('../controller/fetchcontroller')


router.post('/musics',fetchController.showAllMusic)
router.post('/locations',fetchController.showAllLocations)

module.exports = router