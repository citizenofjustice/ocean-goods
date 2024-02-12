"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersBot = void 0;
const express_1 = __importDefault(require("express"));
const server_1 = __importDefault(require("./server"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const roles_routes_1 = __importDefault(require("./routes/roles.routes"));
const priveleges_routes_1 = __importDefault(require("./routes/priveleges.routes"));
const catalog_routes_1 = __importDefault(require("./routes/catalog.routes"));
const productTypes_routes_1 = __importDefault(require("./routes/productTypes.routes"));
const orders_routes_1 = __importDefault(require("./routes/orders.routes"));
const verifyToken_1 = require("./middleware/verifyToken");
const verifyRole_1 = require("./middleware/verifyRole");
const index_1 = require("./bot/index");
const config_service_1 = require("./bot/config.service");
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
const server = new server_1.default(app);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
exports.ordersBot = new index_1.Bot(new config_service_1.ConfigService());
exports.ordersBot.bot.catch((error) => console.log(error));
exports.ordersBot.init();
app.use("/api", auth_routes_1.default);
app.use("/api/catalog", catalog_routes_1.default);
app.use("/api/product-types", productTypes_routes_1.default);
app.use("/api/orders", orders_routes_1.default);
app.use(verifyToken_1.verifyToken);
app.use(verifyRole_1.verifyRole);
app.use("/api/users", user_routes_1.default);
app.use("/api/roles", roles_routes_1.default);
app.use("/api/priveleges", priveleges_routes_1.default);
// last middleware should be error handler
app.use(errorHandler_1.errorHandler);
app
    .listen(PORT, "localhost", function () {
    console.log(`Server is running on port ${PORT}.`);
})
    .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.log("Error: address already in use");
    }
    else {
        console.log(err);
    }
});
