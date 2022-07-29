
const express = require('express');
const router = express.Router();
const apicontroller = require('../controller/api');
router.post('/registeruser', apicontroller.registeruser);
router.post('/verifyotp', apicontroller.verifyotp);
router.post('/Prizecheck', apicontroller.Prizecheck);

module.exports = router;