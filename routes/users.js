const express = require('express');
const router = express.Router();
const passport = require('passport')
const catchAsync = require('../utils/CatchAsync')
const User = require('../models/user')
const usersControllers = require('../controllers/usersControllers')

// User Register get & post route:
router.get('/register', usersControllers.renderRegister)

router.post('/register', catchAsync(usersControllers.register));

// User Login get and post route:
router.get('/login', usersControllers.renderLogin)

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), usersControllers.login)

// User logout
router.get('/logout', usersControllers.logout)
module.exports = router;