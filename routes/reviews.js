const express = require('express');
const router = express.Router({ mergeParams: true });
// whenever we try to submit review an error will occur "Cannot read property 'reviews' null" which basically means campground is null i.e it is not able to find any campground with id(req.params.id) as id is empty it is because express likes to keep params separate so we are setting mergeParams to be true

const { reviewSchema } = require('../ErrorSchemas')

const ExpressError = require('../utils/ExpressError')
const CatchAsync = require('../utils/CatchAsync')

const Campground = require('../models/campground')
const Review = require('../models/review')

// review validation middlewares
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// Review Routes
router.post('/', validateReview, CatchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    // To instantiate new Review model we need to import the module
    const review = new Review(req.body.review);
    // Here req.body.review is what we gave in show.ejs>form>review[rating] and review[body]
    // Now push the new review into campground.reviews array
    campground.reviews.push(review);
    campground.save();
    review.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

// delete reviews
router.delete('/reviewID', CatchAsync(async(req, res) => {
    const { id, reviewID } = req.params;
    // so the problem is our reviewID is assosciated to campgroundId so if we delete using reviewID the whole campground gets deleted.[13213,123123,141324] suupose this is an array of object ID's and we want to delete the specific ID that belogs to our review id so we will use an operator in mongo called $pull operator
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;