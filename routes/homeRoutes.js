const express = require('express');
const authController = require("../controllers/auth");
const networkingController = require("../controllers/networking");
const router = express.Router();
const isAuth = require("../middlewares/isAuth");

router.get('/login',authController.getLogin);
router.post('/login',authController.postLogin);
router.post('/signup',authController.postSignup);
router.get('/chat',isAuth,networkingController.getChat);
router.post('/logout',authController.postLogout);
module.exports = router;