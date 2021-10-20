const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

// By default, Mongoose does not include virtuals when you convert a document to JSON. For example, if you pass a document to Express' res.json() function, virtuals will not be included by default.

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
            // here campground model only have an id so just like to get reviews we populate the same way we will populate for author in routes/campgrounds
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>`
})

//so we the below code is for, if we decide to delete any campground but reviews assosciated to that particular campground does not get deleted...

CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

// so to be particularly clear if i change the way i delete a particular campground at app.js below code i am doing findByIdAndDelete but if i do something else in middleware like remove method or deleteMany it will not trigger the below middleware so findByIdAndDelete only calls findOneAndDelete()
// app.delete('/campgrounds/:id', CatchAsync(async(req, res) => {
//     const { id } = req.params;
//     await Campground.findByIdAndDelete(id)
//     res.redirect('/campgrounds');
// }))


module.exports = mongoose.model('Campground', CampgroundSchema)