const jwt = require('jsonwebtoken');
const nconf = require('nconf');
nconf.argv().env().file('keys.json');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.status(403).json({message: 'No Authorization Token'}).send();

    jwt.verify(token, nconf.get('secret'), (e, body) => {
        if(e || (body.token !== nconf.get('token'))) return res.status(403).json({message: 'Authorization Token invalid'}).send();
        next();
    });

}

module.exports = { verifyToken };