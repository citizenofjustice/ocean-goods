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
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Exporting an async function verifyToken
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the Authorization header from the request
        let authHeader = req.header("Authorization") || req.header("authorization");
        // If the Authorization header does not start with "Bearer ", deny access
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")))
            return res.status(403).send("Доступ запрещен");
        // Extract the token from the Authorization header
        const token = authHeader.split(" ")[1];
        // Verify the token
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
            // If there is an error (invalid token), return a 403 status
            if (error)
                return res.sendStatus(403);
            // If the token is valid, set the user and role in the request
            req.user = decoded.userInfo.user;
            req.role = decoded.userInfo.role;
            // Call the next middleware
            next();
        });
    }
    catch (error) {
        // If there is an error, return a 500 status and the error message
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
    }
});
exports.verifyToken = verifyToken;
