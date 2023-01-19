const { body } = require('express-validator');
const Validator = require('.');

class PostValidator extends Validator {
    constructor() {
        super();

        this._contents = body('contents')
            .exists().withMessage("Content payload doesn't exist")
            .notEmpty().withMessage("Content should not be empty")
            .isString().withMessage("Content should be string");

        this.schema = {
            postPayload: [
                this._contents
            ]
        }
    }
}

module.exports = PostValidator