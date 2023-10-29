const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtubeController');

router.get('/searchJs/:text?', youtubeController.search);
router.get('/channels/:userName?',youtubeController.channel);
router.get('/channelsearch',youtubeController.searchApi);
router.get('/search',youtubeController.searchPy);
router.get('/searchApi',youtubeController.searchApi);

module.exports = router;

