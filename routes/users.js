const express = require('express');
const router = express.Router();
const passport = require('passport')
const catchAsync = require('../utils/CatchAsync')
const User = require('../models/user')

// User Register get & post route:
router.get('/register', (req, res) => {
    res.render('users/register');
})
router.post('/register', catchAsync(async(req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.flash('success', `Welcome to ratemycamp, ${username}`)
        res.redirect('/campgrounds');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register')
    }
}));

// User Login get and post route:
router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res) => {
    const { username } = req.body;
    req.flash('success', `Welcome back, ${username}!`);
    res.redirect('/campgrounds');
})

module.exports = router;