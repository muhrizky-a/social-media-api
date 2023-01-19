const argon2 = require('argon2');
const NotFoundError = require('../exceptions/NotFoundError');
const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require('../exceptions/AuthenticationError');

const service = require("../services/AuthService");
const userService = require("../services/UserService");

class AuthMiddleware {
    constructor(service, userService) {
        this._service = service;
        this._userService = userService;

        this.authenticate = this.authenticate.bind(this);
        this.verifyAccessToken = this.verifyAccessToken.bind(this);
    }


    async authenticate(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await this._userService.getUserByEmail(email);

            if (!user) throw new NotFoundError("User Not Found");

            // Password verification
            const isPasswordMatch = await argon2.verify(user.password, password);
            if (!isPasswordMatch) throw new AuthenticationError("Invalid Password");

            req.user = user;
            next();
        } catch (error) {
            next(error)
        }
    }

    async verifyAccessToken(req, res, next) {
        try {
            const authHeader = req.headers.authorization;

            try {
                authHeader.split("Bearer ");
            } catch (err) {
                throw new InvariantError(
                    "Bad Request",
                    { auth: "No Credentials Sent" }
                );
            }

            const accessToken = authHeader.split("Bearer ")[1];

            this._service.verifyJWT(
                req, res,
                accessToken,
                process.env.ACCESS_TOKEN_SECRET
            );

            next();
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AuthMiddleware(service, userService);