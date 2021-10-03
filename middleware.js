const { campgroundSchema, reviewSchema } = require('./ErrorSchemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review')

// isLoggedin Middleware
module.exports.isLoggedIn = (req, res, next) => {
    const { id } = req.params;
    if (!req.isAuthenticated()) {
        // storing the url they are requesting
        req.session.returnTo = (req.query._method === 'DELETE' ? `/campgrounds/${id}` : req.originalUrl);
        req.flash('error', 'You must be logged in first')
        return res.redirect('/login')
    }
    next();
}

// validateCampground middleware
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// isAuthor middleware
module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', "You do not have permission to do that!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

// isReviewAuthor middleware
module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewID } = req.params;
    const review = await Review.findById(reviewID);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// review validation middlewares
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}