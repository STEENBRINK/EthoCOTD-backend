const checkAcceptHeader = (req, res, next) => {
    const contentType = req.headers['accept'];
    if(contentType && !(contentType === 'application/json' || contentType === 'application/x-www-form-urlencoded')) return res.status(400).json({message: "accept not allowed"});
    next();
}

module.exports = {checkAcceptHeader}