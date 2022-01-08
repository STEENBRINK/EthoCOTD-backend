const checkAcceptHeaderForJSON = (req, res, next) => {
    const contentType = req.headers['accept'];
    if(contentType && !(contentType === 'application/json')) return res.status(400).json({message: "Accept header with application/json required"});
    next();
}

const checkAcceptHeaderForHTML = (req, res, next) => {
    const contentType = req.headers['accept'];
    if(contentType && !(contentType.includes('text/html'))) return res.status(400).json({message: "Accept header with text/html required"});
    next();
}

module.exports = {checkAcceptHeaderForJSON, checkAcceptHeaderForHTML}