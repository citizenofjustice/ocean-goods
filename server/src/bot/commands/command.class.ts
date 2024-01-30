import { Telegraf } from "telegraf";
import { BotContext } from "../context.interface";

export abstract class Command {
  constructor(public bot: Telegraf<BotContext>) {}

  abstract handle(): void;
}
