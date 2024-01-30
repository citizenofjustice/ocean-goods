import { Telegraf } from "telegraf";

import { Command } from "./command.class";
import { BotContext } from "../context.interface";
import { OrderItem } from "../../types/OrderItem";
import { getOrderById } from "../../controllers/orders.controller";

export class SendCommand extends Command {
  constructor(bot: Telegraf<BotContext>) {
    super(bot);
  }

  handle(): void {
    this.bot
      .action(/^orderDetails-(\d+)$/, async (ctx) => {
        try {
          const orderId = Number(ctx.match[1]);
          const replyId = ctx.callbackQuery.message?.message_id;
          const foundOrder = await getOrderById(orderId);

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

          await this.bot.telegram.sendMessage(
            process.env.TELEGRAM_CHAT_ID,
            resString,
            {
              parse_mode: "HTML",
              reply_to_message_id: replyId,
            }
          );
        } catch (error) {
          console.log("orderDetails action bot error: ", error);
        }
      })
      .catch((error) => console.log("orderDetails action failed"));

    this.bot
      .action(/^contact-(\d+)$/, async (ctx) => {
        try {
          const orderId = Number(ctx.match[1]);
          const replyId = ctx.callbackQuery.message?.message_id;
          const foundOrder = await getOrderById(orderId);
          await this.bot.telegram.sendMessage(
            process.env.TELEGRAM_CHAT_ID,
            `Тел.: ${foundOrder.customerPhone}\nЭл.почта: ${foundOrder.customerEmail}\nСпособ связи: ${foundOrder.contactMethod}\n`,
            {
              parse_mode: "HTML",
              reply_to_message_id: replyId,
            }
          );
        } catch (error) {
          console.log("contact action bot error: ", error);
        }
      })
      .catch((error) => console.log("contact action failed"));
  }
}
