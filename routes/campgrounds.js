const express = require('express');
const router = express.Router();
const CatchAsync = require('../utils/CatchAsync')
const campgrounds = require('../controllers/campgrounds')

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const Campground = require('../models/campground')

router.route('/')
    .get(CatchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, CatchAsync(campgrounds.createCampground))


// Creating New Campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm)


// To show all campgrounds
router.route('/:id')
    .get(CatchAsync(campgrounds.showCampground))
    .put(isLoggedIn, validateCampground, isAuthor, CatchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, CatchAsync(campgrounds.deleteCampground))

// Update and edit
router.get('/:id/edit', isLoggedIn, isAuthor, CatchAsync(campgrounds.renderEditForm))


module.exports = router;