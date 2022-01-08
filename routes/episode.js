const express = require('express');
const episodeController = require('../controllers/episode');
const authToken = require('../middleware/authToken');
const headers = require('../middleware/headers');

//router initialization
const router = express.Router();

// CRUD
router.get('/', headers.checkAcceptHeaderForJSON, episodeController.getAllEpisodes);

router.get('/:id', headers.checkAcceptHeaderForJSON, episodeController.getEpisode);

router.get('/find/:searchtag', headers.checkAcceptHeaderForJSON, episodeController.findEpisode);

router.post('/', [authToken.verifyToken, headers.checkAcceptHeaderForJSON], episodeController.createEpisode);

router.put('/:id', [authToken.verifyToken, headers.checkAcceptHeaderForJSON], episodeController.updateEpisode)

router.delete('/:id', [authToken.verifyToken, headers.checkAcceptHeaderForJSON], episodeController.deleteEpisode)

module.exports = router;