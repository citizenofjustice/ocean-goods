import express, { Application } from "express";

import Server from "./server";
// Importing Bot and ConfigService from "./bot"
import { Bot } from "./bot/index";
import { ConfigService } from "./bot/config.service";

// Importing middleware functions from "./middleware"
import { verifyRole } from "./middleware/verifyRole";
import { verifyToken } from "./middleware/verifyToken";
import { errorHandler } from "./middleware/errorHandler";

// Importing various routers from "./routes"
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import rolesRouter from "./routes/roles.routes";
import ordersRouter from "./routes/orders.routes";
import catalogRouter from "./routes/catalog.routes";
import privelegesRouter from "./routes/priveleges.routes";
import productTypesRouter from "./routes/productTypes.routes";

// Creating an express application
const app: Application = express();
// Creating a new Server instance
const server: Server = new Server(app);
// Defining the port number
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

// Creating a new Bot instance
export const ordersBot = new Bot(new ConfigService());
// Catching any errors from the bot
ordersBot.bot.catch((error) => console.log(error));
// Initializing the bot
ordersBot.init();

// Using various routers for different API endpoints
app.use("/api", authRouter);
app.use("/api/catalog", catalogRouter);
app.use("/api/product-types", productTypesRouter);
app.use("/api/orders", ordersRouter);

// Using middleware functions, routes below will use it
app.use(verifyToken);
app.use(verifyRole);
// Using more routers for different API endpoints
app.use("/api/users", userRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/priveleges", privelegesRouter);

// Using the error handler as the last middleware
app.use(errorHandler);

// Starting the server
app
  .listen(PORT, "localhost", function () {
    console.log(`Server is running on port ${PORT}.`);
  })
  .on("error", (err: any) => {
    // Handling any errors when starting the server
    if (err.code === "EADDRINUSE") {
      console.log("Error: address already in use");
    } else {
      console.log(err);
    }
  });
