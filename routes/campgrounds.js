const express = require('express');
const router = express.Router();
const CatchAsync = require('../utils/CatchAsync')
const campgrounds = require('../controllers/campgrounds')

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const Campground = require('../models/campground')


router.get('/', CatchAsync(campgrounds.index))

// Creating New Campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.post('/', isLoggedIn, validateCampground, CatchAsync(campgrounds.createCampground))

// To show all campgrounds
router.get('/:id', CatchAsync(campgrounds.showCampground))

// Update and edit
router.get('/:id/edit', isLoggedIn, isAuthor, CatchAsync(campgrounds.renderEditForm))

router.put('/:id', isLoggedIn, validateCampground, isAuthor, CatchAsync(campgrounds.updateCampground))

// Delete
router.delete('/:id', isLoggedIn, isAuthor, CatchAsync(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground!')
    res.redirect('/campgrounds');
}))

module.exports = router;