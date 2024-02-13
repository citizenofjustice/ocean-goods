"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const dotenv_1 = require("dotenv");
class ConfigService {
    constructor() {
        const { parsed } = (0, dotenv_1.config)();
        this.config = parsed || process.env;
    }
    get(key) {
        const res = this.config[key];
        if (!res) {
            throw new Error(`Key ${key} not exists`);
        }
        return res;
    }
}
exports.ConfigService = ConfigService;
