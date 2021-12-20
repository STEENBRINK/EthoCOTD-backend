const express = require('express');
const cotdController = require('../controllers/cotd')

//router initialization
const router = express.Router();

// CRUD
//get all
router.get('/', cotdController.getAllCOTD);

module.exports = router;