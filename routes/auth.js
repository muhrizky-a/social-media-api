const router = require('express').Router();
const authMiddleware = require('../middleware/AuthMiddleware');
const controller = require('../controllers/AuthController');

const AuthValidator = require('../validator/AuthValidator');
const validator = new AuthValidator();

router.post('/auth',
    validator.validate(validator.schema.loginPayload),
    authMiddleware.authenticate,
    controller.createAuth
);

module.exports = router;