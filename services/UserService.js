const argon2 = require("argon2");
const User = require("../models/user");

class UserService {
    async createUser(payload) {
        const user = await User.create(payload);

        return {
            id: user.id
        };
    }

    async createHashedPassword(password) {
        const hashedPassword = await argon2.hash(
            password,
            {
                type: argon2.argon2id,
                raw: false
            }
        );

        return hashedPassword;
    }

    async getUsers() {
        const users = await User.findAll();

        return users;
    }

    async getUserById(id) {
        const user = await User.findOne({
            where: { id }
        });

        return user;
    }

    async getUserByEmail(email) {
        const user = await User.findOne({
            where: { email }
        });

        return user;
    }

    async updateUser(id, payload) {
        const user = await User.update(payload, {
            where: { id },
        });

        return user;
    }

    async deleteUser(id) {
        const user = await User.destroy({
            where: { id },
        });

        return user;
    }


}

module.exports = new UserService();