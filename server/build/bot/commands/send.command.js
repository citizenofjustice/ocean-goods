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
exports.SendCommand = void 0;
const command_class_1 = require("./command.class");
const orders_controller_1 = require("../../controllers/orders.controller");
// Defining the SendCommand class that extends the Command class
class SendCommand extends command_class_1.Command {
    // Constructor for the SendCommand class
    constructor(bot) {
        super(bot);
    }
    // Method to handle the bot actions
    handle() {
        // Action for order details
        this.bot
            .action(/^orderDetails-(\d+)$/, (ctx) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Extracting the order ID from the action
                const orderId = Number(ctx.match[1]);
                // Getting the message ID for the reply
                const replyId = (_a = ctx.callbackQuery.message) === null || _a === void 0 ? void 0 : _a.message_id;
                // Fetching the order by its ID
                const foundOrder = yield (0, orders_controller_1.getOrderById)(orderId);
                const orderItems = foundOrder.orderItems;
                // Constructing the response string with the order details
                let resString;
                resString = orderItems
                    .map((item, i) => {
                    if (!item.itemSnapshot)
                        throw new Error("Order item does not exist");
                    const { price, discount, productName } = JSON.parse(item.itemSnapshot.toString());
                    if (!price || !discount || !productName)
                        throw new Error("Order data not found");
                    const totalProductPrice = price * ((100 - discount) / 100);
                    return `${i + 1}) ${productName}, ${item.amount} шт., ${totalProductPrice} руб.;`;
                })
                    .join("\n");
                resString =
                    resString +
                        `\n💰 <b>Общая сумма:</b> ${foundOrder.totalPrice} руб.`;
                // Sending the response message
                yield this.bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, resString, {
                    parse_mode: "HTML",
                    reply_to_message_id: replyId,
                });
            }
            catch (error) {
                // Logging any errors
                console.log("orderDetails action bot error: ", error);
            }
        }))
            .catch((error) => console.log("orderDetails action failed"));
        // Action for contact details
        this.bot
            .action(/^contact-(\d+)$/, (ctx) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            try {
                // Extracting the order ID from the action
                const orderId = Number(ctx.match[1]);
                // Getting the message ID for the reply
                const replyId = (_b = ctx.callbackQuery.message) === null || _b === void 0 ? void 0 : _b.message_id;
                // Fetching the order by its ID
                const foundOrder = yield (0, orders_controller_1.getOrderById)(orderId);
                // Sending the contact details
                yield this.bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, `Тел.: ${foundOrder.customerPhone}\nЭл.почта: ${foundOrder.customerEmail}\nСпособ связи: ${foundOrder.contactMethod}\n`, {
                    parse_mode: "HTML",
                    reply_to_message_id: replyId,
                });
            }
            catch (error) {
                // Logging any errors
                console.log("contact action bot error: ", error);
            }
        }))
            .catch((error) => console.log("contact action failed"));
    }
}
exports.SendCommand = SendCommand;
