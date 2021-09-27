module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // storing the url they are requesting
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in first')
        return res.redirect('/login')
    }
    next();
}