var express = require('express');
var router = express.Router();

var sport = require('../controllers/SportController.js');

// Page accueil
router.get('/sport', sport.list);


// Edit employee
router.get('/sport/edit/:id', sport.edit);

// Edit update
router.post('/sport/update/:id', sport.update);

// Edit update
router.post('/sport/delete/:id', sport.delete);

module.exports = router;