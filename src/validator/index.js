const { validationResult } = require('express-validator');
const lodash = require('lodash');

const InvariantError = require('../exceptions/InvariantError');

class Validator {
    throwValidationError(errors) {
        const newError = lodash(errors.errors)
            .groupBy('param')
            .mapValues(group => lodash.map(group, 'msg'))
            .value()

        throw new InvariantError(
            "Bad Request",
            newError
        )
    }

    validate(schema) {
        return [
            ...schema,
            (req, res, next) => {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    this.throwValidationError(errors);
                }
                next();
            }
        ];
    }
}

module.exports = Validator;