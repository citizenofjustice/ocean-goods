import { Telegraf, session } from "telegraf";

// Importing necessary interfaces and commands
import { IConfigService } from "./config.interface";
import { BotContext } from "./context.interface";
import { SendCommand } from "./commands/send.command";

// Defining the Bot class
export class Bot {
  // Declaring the bot variable of type Telegraf with BotContext
  bot: Telegraf<BotContext>;

  // Constructor for the Bot class
  constructor(private readonly configService: IConfigService) {
    // Initializing the bot with the Telegram Bot API Key
    this.bot = new Telegraf<BotContext>(
      this.configService.get("TELEGRAM_BOT_API_KEY")
    );
    // Using the session middleware
    this.bot.use(session());
  }

  // Asynchronous init function to handle commands and launch the bot
  async init() {
    try {
      // Creating a new SendCommand instance
      const command = new SendCommand(this.bot);
      // Handling the command
      await command.handle();
      // Launching the bot and handling any errors
      await this.bot
        .launch()
        .catch((error) => console.log("Error on launch: ", error));
    } catch (error) {
      console.log("Error on bot launch: ", error);
    }
  }
}
