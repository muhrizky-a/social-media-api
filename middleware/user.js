const User = require('../models/user');

const InvariantError = require('../exceptions/InvariantError');
const AuthorizationError = require('../exceptions/AuthorizationError');

const verifyNewEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({
            attributes: ['email'],
            where: {
                email
            },
        });

        if (user) throw new InvariantError(
            "Bad Request",
            { email: "Email sudah digunakan." }
        );

        next();
    } catch (error) {
        next(error)
    }
}

const checkVerifiedStatus = async (req, res, next) => {
    try {
        const { email } = req.user;
        const user = await User.findOne({
            attributes: ['email', 'is_verified'],
            where: { email },
        });

        if (!user.is_verified) throw new AuthorizationError("Silahkan verifikasi akun terlebih dahulu.");

        next();
    } catch (error) {
        next(error)
    }
}

module.exports = {
    verifyNewEmail,
    checkVerifiedStatus
}