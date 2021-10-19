if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const router = express.Router();
const CatchAsync = require('../utils/CatchAsync');
const campgrounds = require('../controllers/campgrounds');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({
    storage,
    limits: { fileSize: 500000 }
    //filesize in bytes, in this case it's 500 kb 
});

const uploadFile = (req, res, next) => {
    const uploadProcess = upload.single('picture');

    uploadProcess(req, res, err => {
        if (err instanceof multer.MulterError) {
            return next(new Error(err, 500));
        } else if (err) {
            return next(new Error(err, 500));
        }
        next();
    });
};



const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const Campground = require('../models/campground')

router.route('/')
    .get(CatchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, CatchAsync(campgrounds.createCampground));

// Creating New Campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm)


// To show all campgrounds
router.route('/:id')
    .get(CatchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, CatchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, CatchAsync(campgrounds.deleteCampground))

// Update and edit
router.get('/:id/edit', isLoggedIn, isAuthor, CatchAsync(campgrounds.renderEditForm))

module.exports = uploadFile;
module.exports = router;