const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/checkfields/email', authController.checkfieldsemail);

router.post('/checkfields/phoneno', authController.checkfieldsphoneno);


module.exports = router;
