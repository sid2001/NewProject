const express = require('express');
const authController = require("../controllers/auth");
const networkingController = require("../controllers/networking");
const router = express.Router();

router.get('/login',authController.getLogin);
router.post('/signup',authController.postSignup);
router.get('/chat',networkingController.getChat);
module.exports = router;