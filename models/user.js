const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// Passport local passportLocalMongoose will add a Username,hash and salt field to store the username,the hashed password and the salt value.
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});


UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);