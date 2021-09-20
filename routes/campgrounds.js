const express = require('express');
const router = express.Router();
const { campgroundSchema } = require('../ErrorSchemas')
const ExpressError = require('../utils/ExpressError')
const CatchAsync = require('../utils/CatchAsync')
const Campground = require('../models/campground')
const methodOverride = require('method-override');

router.get('/', CatchAsync(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))

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

// Creating New Campground
router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

router.post('/', validateCampground, CatchAsync(async(req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid campground data', 400);
    const campground = new Campground(req.body.campground)
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

// To show all campgrounds
router.get('/:id', CatchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    // We used .populate method so that review of that particular campground(because of id) can be shown
    res.render('campgrounds/show', { campground })
}))

// Update and edit
router.get('/:id/edit', CatchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id', validateCampground, CatchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`)
}))

// Delete
router.delete('/:id', CatchAsync(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds');
}))

module.exports = router;