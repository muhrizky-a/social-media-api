const service = require("../services/UserService");
const NotFoundError = require("../exceptions/NotFoundError");

class UserController {
    constructor(service) {
        this._service = service;

        this.createUser = this.createUser.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.getUsersById = this.getUsersById.bind(this);
        this.updateEmail = this.updateEmail.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    async createUser(req, res, next) {
        try {
            const { email, password } = req.body;

            const hashedPassword = await this._service.createHashedPassword(password);

            const user = await this._service.createUser({
                email,
                password: hashedPassword
            });

            res.status(201).json({
                code: 201,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await this._service.getUsers();

            res.json({
                code: 200,
                data: users.map((user) => {
                    return {
                        id: user.id,
                        email: user.email,
                        imageUrl: `${req.headers.host}/uploads/users/${user.image ?? 'default.png'}`,
                    }
                })
            });
        } catch (error) {
            next(error);
        }
    }

    async getUsersById(req, res, next) {
        try {
            const { id } = req.params;

            const user = await this._service.getUserById(id);
            if (!user) throw new NotFoundError("User Not Found");

            res.json({
                code: 200,
                data: {
                    id: user.id,
                    email: user.email,
                    imageUrl: `${req.headers.host}/uploads/users/${user.image ?? 'default.png'}`,
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async updateEmail(req, res, next) {
        try {
            const { id } = req.user;
            const { email } = req.body;

            await this._service.updateUser(id, { email });

            res.status(200).json({
                code: 200,
                message: "Email Updated Succesfully",
                data: { email }
            });
        } catch (error) {
            next(error);
        }
    }

    async updatePassword(req, res, next) {
        try {
            const { id } = req.user;
            const { password } = req.body;

            const hashedPassword = await this._service.createHashedPassword(password);

            await this._service.updateUser(id, { password: hashedPassword });

            res.status(200).json({
                code: 200,
                message: "Password Updated Succesfully",
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const { id } = req.user;

            await this._service.deleteUser(id);

            res.status(200).json({
                code: 200,
                message: "User Deleted Succesfully"
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController(service);