const express = require('express');
const router = express.Router();
const passport = require('passport')
const catchAsync = require('../utils/CatchAsync')
const User = require('../models/user')
const usersControllers = require('../controllers/usersControllers')

// User Register get & post route:
router.route('/register')
    .get(usersControllers.renderRegister)
    .post(catchAsync(usersControllers.register))


// User Login get and post route:
router.route('/login')
    .get(usersControllers.renderLogin)
    .post(passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), usersControllers.login)

// User logout
router.get('/logout', usersControllers.logout)
module.exports = router;