const jwt = require("jsonwebtoken");
const User = require('../models/user');

const AuthorizationError = require("../exceptions/AuthorizationError");

class AuthService {
    generateAccessToken(payload, secret, expiresIn) {
        const token = jwt.sign(
            {
                id: payload.id
            },
            secret,
            { expiresIn }
        );

        return token;
    }

    verifyJWT(req, res, token, secret) {
        try {
            const decoded = jwt.verify(token, secret);
            res.locals.decoded = decoded;
            req.user = decoded;
            req.user.userId = decoded.id;
        } catch (err) {
            throw new AuthorizationError("Unauthorized");
        }
    }
}

module.exports = new AuthService();