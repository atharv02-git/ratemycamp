const mongoose = require('mongoose');
const cities = require('./cities')
const Campground = require('../models/campground')
const { places, descriptors } = require('./seedHelpers')

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

const sample = (array) => array[Math.floor(Math.random() * array.length)];


const seedDB = async() => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6151c933cbfca9b5612f45a3',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum aperiam magnam repellat, labore id voluptas quidem quam rerum voluptate aliquid nemo vero neque, modi accusamus! Non sed officia error sit?',
            price,
            geometry: {
                type: "Point",
                coordinates: [-113.1331, 47.0202]
            },
            images: [{
                    url: 'https://res.cloudinary.com/dig5tdmg2/image/upload/v1633683550/RateMyCamp/tzvqsfxqw6k4tshshzwt.jpg',
                    filename: 'RateMyCamp/tzvqsfxqw6k4tshshzwt'
                },
                {
                    url: 'https://res.cloudinary.com/dig5tdmg2/image/upload/v1633683552/RateMyCamp/hwytgpby6miu09jrutdb.jpg',
                    filename: 'RateMyCamp/hwytgpby6miu09jrutdb'
                },
                {
                    url: 'https://res.cloudinary.com/dig5tdmg2/image/upload/v1633684452/RateMyCamp/yfobuijuklsln7rrg0j8.jpg',
                    filename: 'RateMyCamp/yfobuijuklsln7rrg0j8'
                }
            ]
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})