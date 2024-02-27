import { Telegraf } from "telegraf";
import { Order } from "../../types/Order";
import { BotContext } from "../context.interface";

// Function to handle order messages
export const handleOrderMessage = async (
  bot: Telegraf<BotContext>, // Bot instance
  order: Order // Order details
) => {
  try {
    // Destructuring order details
    const { orderId, customerName, createdAt, totalPrice } = order;

    // Formatting the date
    const date = new Date(createdAt);
    const formatDate = `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;

    // Sending message to the chat
    await bot.telegram
      .sendMessage(
        process.env.TELEGRAM_CHAT_ID, // Chat ID from environment variables
        `🛒 <b>Заказ №${orderId}</b>\n📆 <b>от</b>: ${formatDate}\n💁 <b>Заказчик</b>: ${customerName}\n💵 <b>На сумму</b>: ${totalPrice} руб.`,
        {
          parse_mode: "HTML", // Parsing mode set to HTML
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
      .catch((error) => console.log("bot send order error: ", error)); // Logging any errors
  } catch (error) {
    console.error(error); // Logging any errors
    return error;
  }
};
