"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const telegraf_1 = require("telegraf");
const send_command_1 = require("./commands/send.command");
class Bot {
    constructor(configService) {
        this.configService = configService;
        this.bot = new telegraf_1.Telegraf(this.configService.get("TELEGRAM_BOT_API_KEY"));
        this.bot.use((0, telegraf_1.session)());
    }
    init() {
        const command = new send_command_1.SendCommand(this.bot);
        command.handle();
        this.bot.launch().catch((error) => console.log("Error on launch: ", error));
    }
}
exports.Bot = Bot;
