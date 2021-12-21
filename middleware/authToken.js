const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.status(403).json({message: 'No Authorization Token'}).send();

    jwt.verify(token, process.env.SECRET, (e, body) => {
        if(e || (body.token !== process.env.TOKEN)) return res.status(403).json({message: 'Authorization Token invalid'}).send();
        next();
    });

}

module.exports = { verifyToken };