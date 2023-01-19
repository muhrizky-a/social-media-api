const router = require('express').Router();
const userMiddleware = require('../middleware/user');
const authMiddleware = require('../middleware/AuthMiddleware');
const controller = require('../controllers/UserController');

const UserValidator = require('../validator/UserValidator');
const validator = new UserValidator();

router.post('/users',
    validator.validate(validator.schema.registerPayload),
    userMiddleware.verifyNewEmail,
    controller.createUser
);

router.get('/users', controller.getUsers);

router.get('/users/:id', controller.getUsersById);

router.put('/users/email',
    validator.validate(validator.schema.emailPayload),
    authMiddleware.verifyAccessToken,
    controller.updateEmail
);

router.put('/users/password',
    validator.validate(validator.schema.passwordPayload),
    authMiddleware.verifyAccessToken,
    controller.updatePassword
);

router.delete('/users',
    authMiddleware.verifyAccessToken,
    controller.deleteUser
);

module.exports = router;