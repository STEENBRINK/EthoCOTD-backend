const express = require('express');
const cotdController = require('../controllers/cotd');
const authToken = require('../middleware/authToken');
const headers = require('../middleware/headers');

//router initialization
const router = express.Router();

// CRUD
//get all
router.get('/', [headers.checkAcceptHeaderForJSON], cotdController.getAllCOTD);

router.get('/:id', [headers.checkAcceptHeaderForJSON], cotdController.getCOTD);

router.get('/find/:searchtag', [headers.checkAcceptHeaderForJSON], cotdController.findCOTD);

router.post('/', [authToken.verifyToken, headers.checkAcceptHeaderForJSON], cotdController.createCOTD);

router.put('/:id', [authToken.verifyToken, headers.checkAcceptHeaderForJSON], cotdController.updateCOTD);

router.delete('/:id', [authToken.verifyToken, headers.checkAcceptHeaderForJSON], cotdController.deleteCOTD);

module.exports = router;