const express = require('express');
const router = express.Router({ mergeParams: true });
// whenever we try to submit review an error will occur "Cannot read property 'reviews' null" which basically means campground is null i.e it is not able to find any campground with id(req.params.id) as id is empty it is because express likes to keep params separate so we are setting mergeParams to be true.
const ExpressError = require('../utils/ExpressError')
const CatchAsync = require('../utils/CatchAsync')
const Campground = require('../models/campground')
const Review = require('../models/review')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const reviews = require('../controllers/reviews')

// Review Routes
router.post('/', isLoggedIn, validateReview, CatchAsync(reviews.createReview))

// delete reviews
router.delete('/:reviewID', isLoggedIn, isReviewAuthor, CatchAsync(reviews.deleteReview))

module.exports = router;