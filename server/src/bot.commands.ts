import { Telegraf } from "telegraf";
import { Order } from "./types/Order";
import { OrderItem } from "./types/OrderItem";

export const handleOrderMessage = async (bot: Telegraf, order: Order) => {
  const orderMessage = await bot.telegram.sendMessage(
    process.env.TELEGRAM_CHAT_ID,
    `<b>Заказ №${order.orderId}</b>\n<b>Заказчик</b>: ${order.customerName}, <b>от</b>: ${order.createdAt}\n<b>На сумму</b>: ${order.orderDetails.totalPrice}`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Детали заказа", callback_data: "orderDetails" },
            { text: "Контакты", callback_data: "contact" },
          ],
        ],
      },
    }
  );

  // console.log(orderMessage);

  bot.action("orderDetails", (ctx) => {
    // ctx.session.messages = [...ctx.session.messages, order];
    try {
      let resString = "";
      order.orderDetails.orderItems.map((item: OrderItem, index: number) => {
        resString =
          resString +
          `${index + 1}) ${item.productName}, ${item.amount} шт., ${
            item.totalProductPrice
          } руб.\n`;
        return item;
      });
      resString =
        resString + `<b>Общая сумма:</b> ${order.orderDetails.totalPrice} руб.`;

      bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, resString, {
        parse_mode: "HTML",
        reply_to_message_id: orderMessage.message_id,
      });
    } catch (error) {
      console.log("error", error);
    }
  });

  bot.action("contact", (ctx) => {
    // ctx.session.messages = [...ctx.session.messages, order];
    try {
      bot.telegram.sendMessage(
        process.env.TELEGRAM_CHAT_ID,
        `Тел.: ${order.customerPhone}\nЭл.почта: ${order.customerEmail}\nСпособ связи: ${order.contactMethod}\n`,
        {
          parse_mode: "HTML",
          reply_to_message_id: orderMessage.message_id,
        }
      );
    } catch (error) {
      console.log("error", error);
    }
  });
};
