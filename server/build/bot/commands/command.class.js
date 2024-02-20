"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
// Defining an abstract Command class
class Command {
    // Constructor for the Command class
    // It takes a bot of type Telegraf with BotContext as a parameter
    constructor(bot) {
        this.bot = bot;
    }
}
exports.Command = Command;
