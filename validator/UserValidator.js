const { body, param } = require('express-validator');
const InvariantError = require('../exceptions/InvariantError');
const Validator = require('.');

class UserValidator extends Validator {
    constructor() {
        super();

        this._id = param('id')
            .exists().withMessage("ID params doesn't exist")
            .notEmpty().withMessage("ID should not be empty")
            .isInt().withMessage("ID should be string");

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

        this._confirmPassword = body('confirmPassword')
            .exists().withMessage("Password confirmation payload doesn't exist")
            .notEmpty().withMessage("Password confirmation should not be empty")
            .isString().withMessage("Password confirmation should be string")
            .custom((confirmPassword, { req }) => {
                // Check for password confirmation match
                if (req.body.password != confirmPassword) {
                    throw new InvariantError("Password confirmation doesn't match")
                }

                return true;
            });

        this._password = body('password')
            .exists().withMessage("Password payload doesn't exist")
            .notEmpty().withMessage("Password should not be empty")
            .isString().withMessage("Password should be string")
            .custom((password) => {
                // Check lowercase letter
                const lowercase = /[a-z]/;
                if (!lowercase.test(password)) {
                    throw new InvariantError("Password should include lowercase letter")
                }

                return true;
            })
            .custom((password) => {
                // Check uppercase letter
                const uppercase = /[A-Z]/;
                if (!uppercase.test(password)) {
                    throw new InvariantError("Password should include uppercase letter")
                }

                return true;
            })
            .custom((password) => {
                // Check for number
                const numeric = /[\d]/;
                if (!numeric.test(password)) {
                    throw new InvariantError("Password should include number")
                }

                return true;
            })
            .custom((password) => {
                // Check for symbol
                const nonAlphanumeric = /[\W]/;
                if (!nonAlphanumeric.test(password)) {
                    throw new InvariantError("Password should include symbol")
                }

                return true;
            })
            .custom((password) => {
                // Check for minimal characters
                const minCharacter = /.{8,}/;
                if (!minCharacter.test(password)) {
                    throw new InvariantError("Password should have minimun 8 characters")
                }

                return true;
            });

        this._image = body('image')
            .exists().withMessage("Image payload doesn't exist")
            .notEmpty().withMessage("Image should not be empty")
            .isString().withMessage("Image should be string");

        this.schema = {
            userId: [
                this._id
            ],
            registerPayload: [
                this._email,
                this._confirmPassword,
                this._password
            ],
            emailPayload: [this._email],
            passwordPayload: [
                this._confirmPassword,
                this._password
            ],
            imagePayload: [this._image]
        }
    }
}

module.exports = UserValidator