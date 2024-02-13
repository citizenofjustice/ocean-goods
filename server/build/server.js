"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
class Server {
    constructor(app) {
        this.config(app);
    }
    config(app) {
        const corsOptions = {
            origin: [
                "http://localhost:5173",
                "https://ocean-goods-client.vercel.app",
            ],
            credentials: true,
        };
        dotenv_1.default.config();
        app.use((0, cors_1.default)(corsOptions));
        app.use(express_1.default.json());
        app.use((0, cookie_parser_1.default)());
        app.use(body_parser_1.default.json({ limit: "5mb" }));
        app.use(body_parser_1.default.urlencoded({ limit: "5mb", extended: true }));
    }
}
exports.default = Server;
