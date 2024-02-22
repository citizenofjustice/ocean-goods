"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
// Exporting a default class Server
class Server {
    // Constructor for the Server class
    constructor(app) {
        // Configuring the app
        this.config(app);
    }
    // Private method to configure the app
    config(app) {
        // Loading environment variables from .env file
        dotenv_1.default.config();
        // Defining CORS options
        const corsOptions = {
            origin: 
            // Setting the origin based on whether the app is hosted locally
            "https://ocean-goods-client.vercel.app",
            // Allowing credentials
            credentials: true,
        };
        app.use((0, cors_1.default)(corsOptions)); // Using CORS with the defined options
        app.use(express_1.default.json()); // Using express.json middleware to parse JSON requests
        app.use((0, cookie_parser_1.default)()); // Using cookieParser middleware to parse cookies
        app.use(body_parser_1.default.json({ limit: "5mb" })); // Using bodyParser.json middleware to parse JSON bodies with a limit of 5mb
        app.use(body_parser_1.default.urlencoded({ limit: "5mb", extended: true })); // Using bodyParser.urlencoded middleware to parse URL-encoded bodies with a limit of 5mb
    }
}
exports.default = Server;
