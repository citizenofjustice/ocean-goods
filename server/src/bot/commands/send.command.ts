import { Telegraf } from "telegraf";

import { Command } from "./command.class";
import { BotContext } from "../context.interface";
import { OrderItem } from "../../types/OrderItem";
import { getOrderById } from "../../controllers/orders.controller";

// Defining the SendCommand class that extends the Command class
export class SendCommand extends Command {
  // Constructor for the SendCommand class
  constructor(bot: Telegraf<BotContext>) {
    super(bot);
  }

  // Method to handle the bot actions
  handle(): void {
    // Action for order details
    this.bot
      .action(/^orderDetails-(\d+)$/, async (ctx) => {
        try {
          // Extracting the order ID from the action
          const orderId = Number(ctx.match[1]);
          // Getting the message ID for the reply
          const replyId = ctx.callbackQuery.message?.message_id;
          // Fetching the order by its ID
          const foundOrder = await getOrderById(orderId);

          // Constructing the response string with the order details
          let resString = await foundOrder.orderDetails.orderItems
            .map((item: OrderItem, i: number) => {
              return `${i + 1}) ${item.productName}, ${item.amount} шт., ${
                item.totalProductPrice
              } руб.;`;
            })
            .join("\n");
          resString =
            resString +
            `\n💰 <b>Общая сумма:</b> ${foundOrder.orderDetails.totalPrice} руб.`;

          // Sending the response message
          await this.bot.telegram.sendMessage(
            process.env.TELEGRAM_CHAT_ID,
            resString,
            {
              parse_mode: "HTML",
              reply_to_message_id: replyId,
            }
          );
        } catch (error) {
          // Logging any errors
          console.log("orderDetails action bot error: ", error);
        }
      })
      .catch((error) => console.log("orderDetails action failed"));

    // Action for contact details
    this.bot
      .action(/^contact-(\d+)$/, async (ctx) => {
        try {
          // Extracting the order ID from the action
          const orderId = Number(ctx.match[1]);
          // Getting the message ID for the reply
          const replyId = ctx.callbackQuery.message?.message_id;
          // Fetching the order by its ID
          const foundOrder = await getOrderById(orderId);

          // Sending the contact details
          await this.bot.telegram.sendMessage(
            process.env.TELEGRAM_CHAT_ID,
            `Тел.: ${foundOrder.customerPhone}\nЭл.почта: ${foundOrder.customerEmail}\nСпособ связи: ${foundOrder.contactMethod}\n`,
            {
              parse_mode: "HTML",
              reply_to_message_id: replyId,
            }
          );
        } catch (error) {
          // Logging any errors
          console.log("contact action bot error: ", error);
        }
      })
      .catch((error) => console.log("contact action failed"));
  }
}
