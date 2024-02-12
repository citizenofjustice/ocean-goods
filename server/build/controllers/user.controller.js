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
const db_1 = require("../db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const pg_protocol_1 = require("pg-protocol");
const userCamelCase = `id as "userId", login, role_id as "roleId", refresh_token as "refreshToken"`;
class UserController {
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, roleId } = req.body;
                if (!email || !password || !roleId)
                    res
                        .status(400)
                        .json({ message: "Одно из полей формы регистрации осталось пустым" });
                // encrypt the password
                const passwordHash = yield bcrypt_1.default.hash(password, 13);
                // create new user
                const newPerson = yield (0, db_1.dbQuery)({
                    text: `INSERT INTO users (login, password_hash, role_id) values ($1, $2, $3) RETURNING *`,
                    values: [email, passwordHash, roleId],
                });
                res.status(201).json(newPerson.rows[0]);
            }
            catch (error) {
                if (error instanceof pg_protocol_1.DatabaseError && error.code === "23505") {
                    res.status(409).json({
                        error: "Учетная запись с указанной почтой уже существует",
                    });
                }
                else if (error instanceof Error) {
                    res.status(409).json({ error: error.message });
                }
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield (0, db_1.dbQuery)({ text: `SELECT ${userCamelCase} FROM users` });
            res.json(users.rows);
        });
    }
    getOneUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const user = yield (0, db_1.dbQuery)({
                text: `SELECT * FROM users WHERE id = $1`,
                values: [id],
            });
            res.json(user.rows[0]);
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, login, password } = req.body;
            const user = yield (0, db_1.dbQuery)({
                text: `UPDATE users SET login = $1, password_hash = $2 WHERE id = $3 RETURNING *`,
                values: [login, password, id],
            });
            res.json(user.rows[0]);
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const user = yield (0, db_1.dbQuery)({
                text: `DELETE FROM users WHERE id = $1`,
                values: [id],
            });
            res.json(user.rows[0]);
        });
    }
}
exports.default = new UserController();
