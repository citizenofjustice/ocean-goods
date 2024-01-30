import { Context } from "telegraf";
import { Order } from "../types/Order";

interface SessionData {
  orders: Order[];
}

export interface BotContext extends Context {
  session?: SessionData;
}
