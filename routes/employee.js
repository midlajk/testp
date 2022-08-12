
const express = require('express');
const router = express.Router();
const apicontroller = require('../controller/employee');
const isauth = require('../middleware/is-auth');
const islogged = require('../middleware/any-auth');

router.get('/delete/:id',isauth, apicontroller.deleteemployee);
router.get('/:id',islogged, apicontroller.viewemployee);
router.post('/update',isauth, apicontroller.updateemployee);

module.exports = router;