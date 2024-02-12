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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
class AuthController {
    authUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password)
                    res
                        .status(400)
                        .json({ message: "Одно из полей формы авторизации осталось пустым" });
                const selectQuery = yield (0, db_1.dbQuery)({
                    text: `SELECT * FROM users WHERE login = $1`,
                    values: [email],
                });
                const foundUser = selectQuery.rows[0];
                if (!foundUser)
                    throw new Error("Введена неверная эл. почта");
                const passwordHash = foundUser.password_hash;
                const isValid = yield bcrypt_1.default.compare(password, passwordHash);
                if (!isValid)
                    throw new Error("Введен неверный пароль");
                // create JWTs
                const accessToken = jsonwebtoken_1.default.sign({
                    userInfo: {
                        user: foundUser.id,
                        role: foundUser.role_id,
                    },
                }, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: "10m",
                });
                const refreshToken = jsonwebtoken_1.default.sign({
                    userInfo: {
                        user: foundUser.id,
                        role: foundUser.role_id,
                    },
                }, process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn: "1d",
                });
                delete foundUser.password_hash;
                const updateQuery = yield (0, db_1.dbQuery)({
                    text: `UPDATE users SET refresh_token = $1 WHERE id = $2 RETURNING login, role_id as "roleId"`,
                    values: [refreshToken, foundUser.id],
                });
                const userWithToken = updateQuery.rows[0];
                res.cookie("token", refreshToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 24 * 60 * 60 * 1000,
                });
                res.status(200).json({
                    user: userWithToken.login,
                    accessToken,
                    role: userWithToken.roleId,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    handleRefreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cookies = req.cookies;
                if (!(cookies === null || cookies === void 0 ? void 0 : cookies.token))
                    return res.sendStatus(401);
                const refreshToken = cookies.token;
                const selectQuery = yield (0, db_1.dbQuery)({
                    text: `SELECT * FROM users WHERE refresh_token = $1`,
                    values: [refreshToken],
                });
                const foundUser = selectQuery.rows[0];
                if (!foundUser)
                    return res.sendStatus(403);
                // evaluate token
                jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
                    if (!decoded)
                        return res.sendStatus(403);
                    if (error || foundUser.id !== decoded.userInfo.user)
                        return res.sendStatus(403);
                    const accessToken = jsonwebtoken_1.default.sign({
                        userInfo: {
                            user: decoded.userInfo.user,
                            role: decoded.userInfo.role,
                        },
                    }, process.env.ACCESS_TOKEN_SECRET, {
                        expiresIn: "10m",
                    });
                    res.json({
                        user: foundUser.login,
                        accessToken,
                        role: foundUser.role_id,
                    });
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    logoutUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token: refreshToken } = req.cookies;
                // If no refresh token, clear the cookie and return
                if (!refreshToken) {
                    res.clearCookie("token", {
                        httpOnly: true,
                        sameSite: "none",
                        secure: true,
                    });
                    return res.sendStatus(204);
                }
                // Check if refreshToken is in db
                const selectQuery = yield (0, db_1.dbQuery)({
                    text: `SELECT * FROM users WHERE refresh_token = $1`,
                    values: [refreshToken],
                });
                const foundUser = selectQuery.rows[0];
                // If no user found, clear the cookie and return
                if (!foundUser) {
                    res.clearCookie("token", {
                        httpOnly: true,
                        sameSite: "none",
                        secure: true,
                    });
                    return res.sendStatus(204);
                }
                // Delete refresh_token in db
                yield (0, db_1.dbQuery)({
                    text: `UPDATE users SET refresh_token = '' WHERE refresh_token = $1`,
                    values: [refreshToken],
                });
                // Clear the cookie and return
                res.clearCookie("token", {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                });
                res.sendStatus(204);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new AuthController();
