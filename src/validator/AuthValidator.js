const { body } = require('express-validator');
const InvariantError = require('../exceptions/InvariantError');
const Validator = require('.');

class AuthValidator extends Validator {
    constructor() {
        super();

        this._email = body('email')
            .exists().withMessage("Email payload doesn't exist")
            .notEmpty().withMessage("Email should not be empty")
            .isString().withMessage("Email should be string")
            .custom((email) => {
                const emailRegex = /^[\w\.]+@([\w-]+\.)+[\w]{2,4}$/;
                if (!emailRegex.test(email)) {
                    throw new InvariantError("Invalid email format (should looks like 'email@company.domain')")
                }

                return true;
            });

        this._password = body('password')
            .exists().withMessage("Password doesn't exist")
            .notEmpty().withMessage("Password should not be empty")
            .isString().withMessage("Password should be string");

        this.schema = {
            loginPayload: [
                this._email,
                this._password
            ]
        }
    }
}

module.exports = AuthValidator