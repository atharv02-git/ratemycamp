const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
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