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
            images: [{
                    url: 'https://res.cloudinary.com/dig5tdmg2/image/upload/v1633438702/RateMyCamp/dpme3stxglbs8spuyuvo.jpg',
                    filename: 'RateMyCamp/dpme3stxglbs8spuyuvo'
                },
                {
                    url: 'https://res.cloudinary.com/dig5tdmg2/image/upload/v1633438704/RateMyCamp/g1ykuaanxmdpooimdix8.jpg',
                    filename: 'RateMyCamp/g1ykuaanxmdpooimdix8'
                },
                {
                    url: 'https://res.cloudinary.com/dig5tdmg2/image/upload/v1633438706/RateMyCamp/xkjsmjt88zuzl6yjuxwr.jpg',
                    filename: 'RateMyCamp/xkjsmjt88zuzl6yjuxwr'
                }
            ]
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})