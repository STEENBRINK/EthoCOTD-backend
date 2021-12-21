const express = require('express');
const episodeController = require('../controllers/episode');
const authToken = require('../middleware/authToken');
const headers = require('../middleware/headers');

//router initialization
const router = express.Router();

// CRUD
router.get('/', headers.checkAcceptHeader, episodeController.getAllEpisodes);

router.get('/:id', headers.checkAcceptHeader, episodeController.getEpisode);

router.get('/find/:searchtag', headers.checkAcceptHeader, episodeController.findEpisode);

router.post('/', [authToken.verifyToken, headers.checkAcceptHeader], episodeController.createEpisode);

router.put('/:id', [authToken.verifyToken, headers.checkAcceptHeader], episodeController.updateEpisode)

router.delete('/:id', [authToken.verifyToken, headers.checkAcceptHeader], episodeController.deleteEpisode)

module.exports = router;