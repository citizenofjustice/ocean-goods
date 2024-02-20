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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const telegraf_1 = require("telegraf");
const send_command_1 = require("./commands/send.command");
// Defining the Bot class
class Bot {
    // Constructor for the Bot class
    constructor(configService) {
        this.configService = configService;
        // Initializing the bot with the Telegram Bot API Key
        this.bot = new telegraf_1.Telegraf(this.configService.get("TELEGRAM_BOT_API_KEY"));
        // Using the session middleware
        this.bot.use((0, telegraf_1.session)());
    }
    // Asynchronous init function to handle commands and launch the bot
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Creating a new SendCommand instance
                const command = new send_command_1.SendCommand(this.bot);
                // Handling the command
                yield command.handle();
                // Launching the bot and handling any errors
                yield this.bot
                    .launch()
                    .catch((error) => console.log("Error on launch: ", error));
            }
            catch (error) {
                console.log("Error on bot launch: ", error);
            }
        });
    }
}
exports.Bot = Bot;
