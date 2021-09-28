const express = require('express');
const router = express.Router();
const { campgroundSchema } = require('../ErrorSchemas')
const CatchAsync = require('../utils/CatchAsync')
const methodOverride = require('method-override');
const { isLoggedIn } = require('../middleware');

const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')

// validateCampground middleware
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', CatchAsync(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))

// Creating New Campground
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

router.post('/', isLoggedIn, validateCampground, CatchAsync(async(req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid campground data', 400);
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id;
    // here is some new user logs in it will detect its id so that they can upload the campground and author's name will pop up on the show page
    await campground.save();
    req.flash('success', 'Successfully created a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

// To show all campgrounds
router.get('/:id', CatchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    console.log(campground);
    // We used .populate method so that review of that particular campground(because of id) can be shown
    if (!campground) {
        req.flash('error', 'Oops :( Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}))

// Update and edit
router.get('/:id/edit', isLoggedIn, CatchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Oops :( Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id', isLoggedIn, validateCampground, CatchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

// Delete
router.delete('/:id', isLoggedIn, CatchAsync(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted a campground!')
    res.redirect('/campgrounds');
}))

module.exports = router;