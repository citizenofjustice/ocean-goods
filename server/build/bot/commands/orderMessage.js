"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOrderMessage = void 0;
// Function to handle order messages
const handleOrderMessage = (bot, // Bot instance
order // Order details
) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructuring order details
        const { orderId, customerName, createdAt, totalOrderPrice } = order;
        // Formatting the date
        const date = new Date(createdAt);
        const formatDate = `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
        // Sending message to the chat
        yield bot.telegram
            .sendMessage(process.env.TELEGRAM_CHAT_ID, // Chat ID from environment variables
        `🛒 <b>Заказ №${orderId}</b>\n📆 <b>от</b>: ${formatDate}\n💁 <b>Заказчик</b>: ${customerName}\n💵 <b>На сумму</b>: ${totalOrderPrice} руб.`, {
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
        })
            .catch((error) => console.log("bot send order error: ", error)); // Logging any errors
    }
    catch (error) {
        console.error(error); // Logging any errors
        return error;
    }
});
exports.handleOrderMessage = handleOrderMessage;
