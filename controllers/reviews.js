const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    // To instantiate new Review model we need to import the module
    const review = new Review(req.body.review);
    // Here req.body.review is what we gave in show.ejs>form>review[rating] and review[body]
    // Now push the new review into campground.reviews array
    review.author = req.user._id;
    campground.reviews.push(review);
    campground.save();
    review.save();
    req.flash('success', 'Successfully created a review!')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async(req, res) => {
    const { id, reviewID } = req.params;
    // so the problem is our reviewID is assosciated to campgroundId so if we delete using reviewID the whole campground gets deleted.[13213,123123,141324] suupose this is an array of object ID's and we want to delete the specific ID that belogs to our review id so we will use an operator in mongo called $pull operator
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Successfully deleted a review!')
    res.redirect(`/campgrounds/${id}`);
}