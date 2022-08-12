
const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin');
const isauth = require('../middleware/is-auth');
const islogged = require('../middleware/any-auth');

router.get('/login', adminController.getlogin);
router.post('/login', adminController.postlogin);
router.get('/listofusers',islogged, adminController.listofusers);
router.post('/link',isauth, adminController.postlink);
router.get('/manageprofile',isauth, adminController.manageprofile);
router.post('/manageprofile',isauth, adminController.postmanageprofile);
router.get('/logout', adminController.logout);
module.exports = router;