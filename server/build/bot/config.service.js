"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const dotenv_1 = require("dotenv");
// Defining the ConfigService class that implements the IConfigService interface
class ConfigService {
    // Constructor for the ConfigService class
    constructor() {
        // Using destructuring to get the parsed config object from the dotenv config function
        const { parsed } = (0, dotenv_1.config)();
        // Assigning the parsed config object or the process.env object to the config variable
        this.config = parsed || process.env;
    }
    // Method to get a value from the config variable using a key
    get(key) {
        // Getting the value associated with the key from the config variable
        const res = this.config[key];
        // If the value does not exist, throw an error
        if (!res) {
            throw new Error(`Key ${key} not exists`);
        }
        return res;
    }
}
exports.ConfigService = ConfigService;
