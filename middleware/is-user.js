module.exports = (req, res, next) => {
    if (!req.session.userlogged) {
        return res.redirect('/controller/login');
    }
    next();
}