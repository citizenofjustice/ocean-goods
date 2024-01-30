import { Telegraf, session } from "telegraf";
import { IConfigService } from "./config.interface";
import { BotContext } from "./context.interface";
import { SendCommand } from "./commands/send.command";

export class Bot {
  bot: Telegraf<BotContext>;

  constructor(private readonly configService: IConfigService) {
    this.bot = new Telegraf<BotContext>(
      this.configService.get("TELEGRAM_BOT_API_KEY")
    );
    this.bot.use(session());
  }

  init() {
    const command = new SendCommand(this.bot);
    command.handle();
    this.bot.launch().catch((error) => console.log("Error on launch: ", error));
  }
}
