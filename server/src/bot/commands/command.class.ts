import { Telegraf } from "telegraf";
import { BotContext } from "../context.interface";

// Defining an abstract Command class
export abstract class Command {
  // Constructor for the Command class
  // It takes a bot of type Telegraf with BotContext as a parameter
  constructor(public bot: Telegraf<BotContext>) {}

  // Abstract handle method to be implemented by subclasses
  abstract handle(): void;
}
