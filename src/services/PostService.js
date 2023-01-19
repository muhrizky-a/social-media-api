const argon2 = require("argon2");
const Post = require("../models/post");

class PostService {
    async createPost(payload) {
        const post = await Post.create(payload);

        return {
            id: post.id
        };
    }

    async getPosts(userId) {
        const posts = await Post.findAll({
            where: { user_id: userId }
        });

        return posts;
    }

    async getPostById(id) {
        const post = await Post.findOne({
            where: { id }
        });

        return post;
    }

    async updatePost(id, payload) {
        const post = await Post.update(payload, {
            where: { id }
        });

        return post;
    }

    async deletePost(id) {
        const post = await Post.destroy({
            where: { id }
        });

        return post;
    }
}

module.exports = new PostService();