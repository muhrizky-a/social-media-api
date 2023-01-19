const AuthorizationError = require('../exceptions/AuthorizationError');
const NotFoundError = require('../exceptions/NotFoundError');
const service = require("../services/PostService");

class PostMiddleware {
    constructor(service) {
        this._service = service;

        this.verifyPostAccess = this.verifyPostAccess.bind(this);
    }

    async verifyPostAccess(req, res, next) {
        try {
            const { id } = req.params;
            const { userId } = req.user;

            const post = await this._service.getPostById(id);
            if (!post) throw new NotFoundError("Post Not Found");
            if (userId != post.user_id) throw new AuthorizationError("Unauthorized");

            next();
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new PostMiddleware(service);