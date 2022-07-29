
const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin');
const isauth = require('../middleware/is-auth');

router.get('/login', adminController.getlogin);
router.post('/login', adminController.postlogin);
router.get('/listofusers',isauth, adminController.listofusers);
router.get('/link',isauth, adminController.link);
router.post('/link',isauth, adminController.postlink);
router.get('/deleteplace/:place',isauth, adminController.deleteplace);

router.get('/winners',isauth, adminController.winners);
router.get('/sendmessage',isauth, adminController.sendmessage);
router.post('/sendmessage',isauth, adminController.postsendmessage);

router.get('/previousmessage',isauth, adminController.previousmessage);

router.get('/manageprofile',isauth, adminController.manageprofile);
router.post('/manageprofile',isauth, adminController.postmanageprofile);
router.get('/logout',isauth, adminController.logout);
module.exports = router;