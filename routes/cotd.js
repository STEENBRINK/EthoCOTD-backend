const express = require('express');
const cotdController = require('../controllers/cotd');
const authToken = require('../middleware/authToken');
const headers = require('../middleware/headers');

//router initialization
const router = express.Router();

// CRUD
//get all
router.get('/', [headers.checkAcceptHeader], cotdController.getAllCOTD);

router.get('/:id', [headers.checkAcceptHeader], cotdController.getCOTD);

router.get('/find/:searchtag', [headers.checkAcceptHeader], cotdController.findCOTD);

router.post('/', [authToken.verifyToken, headers.checkAcceptHeader], cotdController.createCOTD);

router.put('/:id', [authToken.verifyToken, headers.checkAcceptHeader], cotdController.updateCOTD);

router.delete('/:id', [authToken.verifyToken, headers.checkAcceptHeader], cotdController.deleteCOTD);

module.exports = router;