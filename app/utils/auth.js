const jwt = require('jsonwebtoken');
const config = require('../../config');


const verifyOptions = {
    issuer: config.auth.issuer,
    subject: config.auth.subject,
    audience: config.auth.audience,
    maxAge: config.auth.expiresIn
};


const extractUser = (req, res, next) => {
    if (req.session && req.session.token) {
        const { token } = req.session;
        jwt.verify(token, config.SESSION_SECRET_KEY, verifyOptions, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: 'Unauthenticated Request'
                });
            }
            req.user = decoded;
            return next();
        });
    } else {
        return res.status(403).json({
            message: 'Unauthenticated Request'
        });
    }
};


module.exports = { extractUser };
