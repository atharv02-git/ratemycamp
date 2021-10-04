const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// specifying our credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// making the new instance of cloudinary storage and passing cloudinary through multer instead of storing images to our local pc
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'RateMyCamp',
        allowedformats: ['jpeg', 'jpg', 'png']
    }
});

module.exports = {
    cloudinary,
    storage
}