"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersBot = void 0;
const express_1 = __importDefault(require("express"));
const server_1 = __importDefault(require("./server"));
// Importing Bot and ConfigService from "./bot"
const index_1 = require("./bot/index");
const config_service_1 = require("./bot/config.service");
// Importing middleware functions from "./middleware"
const verifyRole_1 = require("./middleware/verifyRole");
const verifyToken_1 = require("./middleware/verifyToken");
const errorHandler_1 = require("./middleware/errorHandler");
// Importing various routers from "./routes"
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const roles_routes_1 = __importDefault(require("./routes/roles.routes"));
const orders_routes_1 = __importDefault(require("./routes/orders.routes"));
const catalog_routes_1 = __importDefault(require("./routes/catalog.routes"));
const priveleges_routes_1 = __importDefault(require("./routes/priveleges.routes"));
const productTypes_routes_1 = __importDefault(require("./routes/productTypes.routes"));
// Creating an express application
const app = (0, express_1.default)();
// Creating a new Server instance
const server = new server_1.default(app);
// Defining the port number
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
// Creating a new Bot instance
exports.ordersBot = new index_1.Bot(new config_service_1.ConfigService());
// Catching any errors from the bot
exports.ordersBot.bot.catch((error) => console.log(error));
// Initializing the bot
exports.ordersBot.init();
// Using various routers for different API endpoints
app.use("/api", auth_routes_1.default);
app.use("/api/catalog", catalog_routes_1.default);
app.use("/api/product-types", productTypes_routes_1.default);
app.use("/api/orders", orders_routes_1.default);
// Using middleware functions, routes below will use it
app.use(verifyToken_1.verifyToken);
app.use(verifyRole_1.verifyRole);
// Using more routers for different API endpoints
app.use("/api/users", user_routes_1.default);
app.use("/api/roles", roles_routes_1.default);
app.use("/api/priveleges", priveleges_routes_1.default);
// Using the error handler as the last middleware
app.use(errorHandler_1.errorHandler);
// Starting the server
app
    .listen(PORT, "localhost", function () {
    console.log(`Server is running on port ${PORT}.`);
})
    .on("error", (err) => {
    // Handling any errors when starting the server
    if (err.code === "EADDRINUSE") {
        console.log("Error: address already in use");
    }
    else {
        console.log(err);
    }
});
