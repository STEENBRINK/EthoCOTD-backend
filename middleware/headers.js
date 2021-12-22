const checkAcceptHeader = (req, res, next) => {
    const contentType = req.headers['accept'];
    if(contentType && !(contentType === 'application/json')) return res.status(400).json({message: "Accept header with application/json required"});
    next();
}

module.exports = {checkAcceptHeader}