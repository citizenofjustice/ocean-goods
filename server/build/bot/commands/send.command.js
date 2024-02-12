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
class SendCommand extends command_class_1.Command {
    constructor(bot) {
        super(bot);
    }
    handle() {
        this.bot
            .action(/^orderDetails-(\d+)$/, (ctx) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const orderId = Number(ctx.match[1]);
                const replyId = (_a = ctx.callbackQuery.message) === null || _a === void 0 ? void 0 : _a.message_id;
                const foundOrder = yield (0, orders_controller_1.getOrderById)(orderId);
                let resString = yield foundOrder.orderDetails.orderItems
                    .map((item, i) => {
                    return `${i + 1}) ${item.productName}, ${item.amount} шт., ${item.totalProductPrice} руб.;`;
                })
                    .join("\n");
                resString =
                    resString +
                        `\n💰 <b>Общая сумма:</b> ${foundOrder.orderDetails.totalPrice} руб.`;
                yield this.bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, resString, {
                    parse_mode: "HTML",
                    reply_to_message_id: replyId,
                });
            }
            catch (error) {
                console.log("orderDetails action bot error: ", error);
            }
        }))
            .catch((error) => console.log("orderDetails action failed"));
        this.bot
            .action(/^contact-(\d+)$/, (ctx) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            try {
                const orderId = Number(ctx.match[1]);
                const replyId = (_b = ctx.callbackQuery.message) === null || _b === void 0 ? void 0 : _b.message_id;
                const foundOrder = yield (0, orders_controller_1.getOrderById)(orderId);
                yield this.bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, `Тел.: ${foundOrder.customerPhone}\nЭл.почта: ${foundOrder.customerEmail}\nСпособ связи: ${foundOrder.contactMethod}\n`, {
                    parse_mode: "HTML",
                    reply_to_message_id: replyId,
                });
            }
            catch (error) {
                console.log("contact action bot error: ", error);
            }
        }))
            .catch((error) => console.log("contact action failed"));
    }
}
exports.SendCommand = SendCommand;
