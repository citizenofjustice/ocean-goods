import { Telegraf } from "telegraf";
import { Order } from "../../types/Order";
import { BotContext } from "../context.interface";

export const handleOrderMessage = async (
  bot: Telegraf<BotContext>,
  order: Order
) => {
  try {
    const { orderId, customerName, createdAt, orderDetails } = order;
    const date = new Date(createdAt);
    const formatDate = `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
    await bot.telegram
      .sendMessage(
        process.env.TELEGRAM_CHAT_ID,
        `🛒 <b>Заказ №${orderId}</b>\n📆 <b>от</b>: ${formatDate}\n💁 <b>Заказчик</b>: ${customerName}\n💵 <b>На сумму</b>: ${orderDetails.totalPrice} руб.`,
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Детали заказа",
                  callback_data: `orderDetails-${orderId}`,
                },
                { text: "Контакты", callback_data: `contact-${orderId}` },
              ],
            ],
          },
        }
      )
      .catch((error) => console.log("bot send order error: ", error));
  } catch (error) {
    console.log(error);
  }
};
