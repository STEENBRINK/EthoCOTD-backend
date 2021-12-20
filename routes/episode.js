const express = require('express');
const episodeController = require('../controllers/episode')

//router initialization
const router = express.Router();

// CRUD
//get all
router.get('/', episodeController.getAllEpisodes);

module.exports = router;