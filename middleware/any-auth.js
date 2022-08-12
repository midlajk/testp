module.exports = (req, res, next) => {
    if (req.session.isLoggedIn || req.session.userlogged) {
        next();

    }else{
        return res.redirect('/controller/login');

    }
}