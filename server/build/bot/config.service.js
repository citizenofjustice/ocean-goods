"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const dotenv_1 = require("dotenv");
class ConfigService {
    constructor() {
        const { error, parsed } = (0, dotenv_1.config)();
        if (error) {
            throw new Error("Not found .env file");
        }
        if (!parsed) {
            throw new Error("Empty .env file");
        }
        this.config = parsed;
    }
    get(key) {
        const res = this.config[key];
        if (!res) {
            throw new Error("Key not exists");
        }
        return res;
    }
}
exports.ConfigService = ConfigService;
