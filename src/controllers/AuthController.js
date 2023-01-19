const service = require("../services/AuthService");

class AuthController {
    constructor(service) {
        this._service = service;

        this.createAuth = this.createAuth.bind(this);
    }

    async createAuth(req, res, next) {
        try {
            const user = req.user;

            const accessToken = this._service.generateAccessToken(
                user,
                process.env.ACCESS_TOKEN_SECRET,
                '1h'
            );

            res.cookie('auth', `Bearer ${accessToken}`);
            res.status(201).json({
                code: 201,
                data: {
                    accessToken
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController(service);