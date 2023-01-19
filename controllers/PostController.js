const service = require("../services/PostService");
const userService = require("../services/UserService");
const NotFoundError = require("../exceptions/NotFoundError");

class PostController {
    constructor(service) {
        this._service = service;
        this._userService = userService;

        this.createPost = this.createPost.bind(this);
        this.getPosts = this.getPosts.bind(this);
        this.getPostById = this.getPostById.bind(this);
        this.updatePost = this.updatePost.bind(this);
        this.deletePost = this.deletePost.bind(this);
    }

    async createPost(req, res, next) {
        try {
            const { id } = req.user;
            const { contents } = req.body;

            const post = await this._service.createPost({
                user_id: id,
                contents
            });

            res.status(201).json({
                code: 201,
                data: {
                    id: post.id,
                    userId: id,
                    contents,
                    createdAt: new Date()
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getPosts(req, res, next) {
        try {
            const { userId } = req.params;

            const user = await this._userService.getUserById(userId);
            if (!user) throw new NotFoundError("User Not Found");

            const posts = await this._service.getPosts(userId);

            res.json({
                code: 200,
                data: posts.map((post) => {
                    return {
                        id: post.id,
                        userId: post.user_id,
                        contents: post.contents,
                        createdAt: post.created_at,
                        updatedAt: post.updated_at
                    }
                })
            });
        } catch (error) {
            next(error);
        }
    }

    async getPostById(req, res, next) {
        try {
            const { id } = req.params;

            const post = await this._service.getPostById(id);
            if (!post) throw new NotFoundError("Post Not Found");

            res.json({
                code: 200,
                data: {
                    id: post.id,
                    userId: post.user_id,
                    contents: post.contents,
                    createdAt: post.created_at,
                    updatedAt: post.updated_at
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async updatePost(req, res, next) {
        try {
            const { id } = req.params;
            const { contents } = req.body;

            await this._service.updatePost(id, {
                contents,
                updated_at: new Date()
            });

            res.status(200).json({
                code: 200,
                message: "Post Updated Succesfully",
                data: {
                    contents
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async deletePost(req, res, next) {
        try {
            const { id } = req.params;

            await this._service.deletePost(id);

            res.status(200).json({
                code: 200,
                message: "Post Deleted Succesfully"
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PostController(service);