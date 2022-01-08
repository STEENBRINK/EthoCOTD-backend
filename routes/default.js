const express = require('express');
const headers = require('../middleware/headers');
const webController = require('../controllers/web');

//router initialization
const router = express.Router();

// CRUD
router.get('/', headers.checkAcceptHeaderForHTML, webController.index);

module.exports = router;