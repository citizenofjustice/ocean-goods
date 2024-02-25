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
    // method to authenticate user
    authUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract email and password from request body
                const { email, password } = req.body;
                // Check if email and password are provided
                if (!email || !password)
                    return res.status(400).json({
                        error: {
                            message: "Одно из полей формы авторизации осталось пустым",
                        },
                    });
                // Query to select user from database
                const foundUser = yield db_1.prisma.users.findUnique({
                    where: {
                        login: email,
                    },
                });
                // Check if user exists
                if (!foundUser)
                    return res.status(400).json({
                        error: { message: "Введена неверная эл. почта" },
                    });
                const isValid = yield bcrypt_1.default.compare(password, foundUser.passwordHash);
                if (!isValid)
                    return res.status(400).json({
                        error: { message: "Введен неверный пароль" },
                    });
                // Create JWTs
                const accessToken = jsonwebtoken_1.default.sign({
                    userInfo: {
                        user: foundUser.id,
                        role: foundUser.roleId,
                    },
                }, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: "10m",
                });
                const refreshToken = jsonwebtoken_1.default.sign({
                    userInfo: {
                        user: foundUser.id,
                        role: foundUser.roleId,
                    },
                }, process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn: "1d",
                });
                // Update the user's refresh token in the database
                const userWithToken = yield db_1.prisma.users.update({
                    where: {
                        id: foundUser.id,
                    },
                    data: {
                        refreshToken: refreshToken,
                    },
                    select: {
                        login: true,
                        roleId: true,
                    },
                });
                if (!userWithToken)
                    return res.status(400).json({
                        error: { message: "Проблема с сохранением токена авторизации" },
                    });
                // Send the response with the access token, refresh token, and user info
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
                // Pass the error to the errorHandler middleware
                next(error);
            }
        });
    }
    // method to handle refresh token
    handleRefreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract the refresh token from the cookies
                const cookies = req.cookies;
                // If no refresh token, return 401 status
                if (!(cookies === null || cookies === void 0 ? void 0 : cookies.token))
                    return res.status(401).json({
                        error: { message: "Доступ запрещен. Отсутствует токен авторизации" },
                    });
                const refreshToken = cookies.token;
                // Query the database for the user with the provided refresh token
                const foundUser = yield db_1.prisma.users.findFirst({
                    where: {
                        refreshToken: refreshToken,
                    },
                });
                // Check if user exists
                if (!foundUser)
                    return res.status(403).json({
                        error: {
                            message: "Возникла проблема при обновлении токена авторизации",
                        },
                    });
                // Verify the refresh token
                jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
                    // If token is invalid or user ID does not match, return 403 status
                    if (!decoded)
                        return res.status(403).json({
                            error: { message: "Доступ запрещен" },
                        });
                    if (error || foundUser.id !== decoded.userInfo.user)
                        return res.status(403).json({
                            error: { message: "Доступ запрещен" },
                        });
                    // Create a new access token
                    const accessToken = jsonwebtoken_1.default.sign({
                        userInfo: {
                            user: decoded.userInfo.user,
                            role: decoded.userInfo.role,
                        },
                    }, process.env.ACCESS_TOKEN_SECRET, {
                        expiresIn: "10m",
                    });
                    // Send the response with the access token and user info
                    res.json({
                        user: foundUser.login,
                        accessToken,
                        role: foundUser.roleId,
                    });
                });
            }
            catch (error) {
                // Pass the error to the errorHandler middleware
                next(error);
            }
        });
    }
    // method to log out a user
    logoutUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract the refresh token from the cookies
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
                // Query the database for the user with the provided refresh token
                const foundUser = yield db_1.prisma.users.findFirst({
                    where: {
                        refreshToken: refreshToken,
                    },
                });
                // If no user found, clear the cookie and return
                if (!foundUser) {
                    res.clearCookie("token", {
                        httpOnly: true,
                        sameSite: "none",
                        secure: true,
                    });
                    return res.sendStatus(204);
                }
                // Delete refresh token in the database
                yield db_1.prisma.users.updateMany({
                    where: {
                        refreshToken: refreshToken,
                    },
                    data: {
                        refreshToken: "",
                    },
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
                // Pass the error to the errorHandler middleware
                next(error);
            }
        });
    }
}
exports.default = new AuthController();
