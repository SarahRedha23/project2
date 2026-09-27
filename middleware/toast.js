const toast = (req, res, next) => {

    res.locals.toast = req.session.toast

    delete req.session.toast

    next()
}

module.exports = toast