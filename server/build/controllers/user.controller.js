"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../db");
// Define a string to convert column names to camel case
const userCamelCase = `id as "userId", login, role_id as "roleId", refresh_token as "refreshToken"`;
class UserController {
    // Method to create a new user
    createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, roleId } = req.body;
                // Check if 'email', 'password', or 'roleId' is not provided
                if (!email || !password || !roleId)
                    return res.status(400).json({
                        error: {
                            message: "Одно из полей формы регистрации осталось пустым",
                        },
                    });
                // Encrypt the password
                const passwordHash = yield bcrypt_1.default.hash(password, 13);
                // Query the database to create a new user
                const newPerson = yield (0, db_1.dbQuery)({
                    text: `INSERT INTO users (login, password_hash, role_id) values ($1, $2, $3) RETURNING *`,
                    values: [email, passwordHash, roleId],
                });
                if (!newPerson.rows[0])
                    return res.status(400).json({
                        error: {
                            message: "Непредвиденная ошибка. Не удалось создать учетную запись.",
                        },
                    });
                res.sendStatus(201); // Return the created user with a 201 status code
            }
            catch (error) {
                next(error); // Pass the error to the errorHandler middleware
            }
        });
    }
    // Method to get all users
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the database to get all users
                const users = yield (0, db_1.dbQuery)({
                    text: `SELECT ${userCamelCase} FROM users`,
                });
                res.status(200).json(users.rows); // Return the users
            }
            catch (error) {
                next(error); // Pass the error to the errorHandler middleware
            }
        });
    }
    // Method to get one user
    getOneUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                // Query the database to get the user with the given ID
                const user = yield (0, db_1.dbQuery)({
                    text: `SELECT ${userCamelCase} FROM users WHERE id = $1`,
                    values: [id],
                });
                // Return error if user does not exist
                if (!user.rows[0])
                    return res.status(404).json({
                        error: {
                            message: "Пользователь с таким иденитификатором не существует",
                        },
                    });
                res.json(user.rows[0]); // Return the user
            }
            catch (error) {
                next(error); // Pass the error to the errorHandler middleware
            }
        });
    }
    // This function is not implemented yet
    updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.sendStatus(501);
            }
            catch (error) {
                next(error); // Pass the error to the errorHandler middleware
            }
        });
    }
    // Method to delete a user
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                // Query the database to check the user with the given ID exists
                const foundUser = yield (0, db_1.dbQuery)({
                    text: "SELECT id FROM users WHERE id = $1",
                    values: [id],
                });
                if (!foundUser.rows[0])
                    // If the user is not found, return a 404 error with a message
                    return res.status(404).json({
                        error: {
                            message: "Удаление невозможно. Пользователь с выбранным идентификатором не найден в базе данных",
                        },
                    });
                // Query the database to delete the user with the given ID
                yield (0, db_1.dbQuery)({
                    text: `DELETE FROM users WHERE id = $1`,
                    values: [id],
                });
                // Return a 204 status code (request has succeeded but returns no message body)
                res.sendStatus(204);
            }
            catch (error) {
                next(error); // Pass the error to the errorHandler middleware
            }
        });
    }
}
exports.default = new UserController();
