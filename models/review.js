const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
            // here campground model only have an id so just like to get reviews we populate the same way we will populate for author in routes/campgrounds
    },
})

module.exports = mongoose.model('Review', reviewSchema);