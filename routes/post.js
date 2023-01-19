const router = require('express').Router();
const authMiddleware = require('../middleware/AuthMiddleware');
const postMiddleware = require('../middleware/PostMiddleware');
const controller = require('../controllers/PostController');

const PostValidator = require('../validator/PostValidator');
const validator = new PostValidator();

router.post('/posts',
    validator.validate(validator.schema.postPayload),
    authMiddleware.verifyAccessToken,
    controller.createPost
);

router.get('/users/:userId/posts',
    controller.getPosts
);

router.get('/posts/:id',
    controller.getPostById
);

router.put('/posts/:id',
    validator.validate(validator.schema.postPayload),
    authMiddleware.verifyAccessToken,
    postMiddleware.verifyPostAccess,
    controller.updatePost
);

router.delete('/posts/:id',
    authMiddleware.verifyAccessToken,
    postMiddleware.verifyPostAccess,
    controller.deletePost
);

module.exports = router;