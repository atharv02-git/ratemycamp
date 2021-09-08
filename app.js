const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi')
const { campgroundSchema, reviewSchema } = require('./ErrorSchemas')
const ExpressError = require('./utils/ExpressError')
const CatchAsync = require('./utils/CatchAsync')
const Campground = require('./models/campground')
const Review = require('./models/review')
const methodOverride = require('method-override');
const review = require('./models/review');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once("open", () => {
    console.log('Database Connected')
})

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', CatchAsync(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))

// Creating New Campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', validateCampground, CatchAsync(async(req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid campground data', 400);
    const campground = new Campground(req.body.campground)
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

// To show all campgrounds
app.get('/campgrounds/:id', CatchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    // We used .populate method so that review of that particular campground(because of id) can be shown
    res.render('campgrounds/show', { campground })
}))

// Update and edit
app.get('/campgrounds/:id/edit', CatchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
}))

app.put('/campgrounds/:id', validateCampground, CatchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`)
}))

// Delete
app.delete('/campgrounds/:id', CatchAsync(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds');
}))

// Review Routes
app.post('/campgrounds/:id/reviews', validateReview, CatchAsync(async(req, res) => {
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
app.delete('/campgrounds/:id/reviews/:reviewID', CatchAsync(async(req, res) => {
    const { id, reviewID } = req.params;
    // so the problem is our reviewID is assosciated to campgroundId so if we delete using reviewID the whole campground gets deleted.       [13213,123123,141324] suupose this is an array of object ID's adn we wamt to delete the specific ID that belogs to our review id so we will use an poerator in mongo called $pull operator
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/campgrounds/${id}`);
}))

// handling errors

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 400));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, Something went wrong!!'
        // instead of destructuring passing the entire err
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})