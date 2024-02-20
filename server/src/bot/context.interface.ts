import { Context } from "telegraf";

import { Order } from "../types/Order";

// Defining the SessionData interface which includes an array of Order objects
interface SessionData {
  orders: Order[];
}

// Defining and exporting the BotContext interface which extends the Context interface from telegraf
// It includes an optional session property of type SessionData
export interface BotContext extends Context {
  session?: SessionData;
}
