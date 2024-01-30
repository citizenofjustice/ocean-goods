import express, { Application } from "express";
import Server from "./server";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import rolesRouter from "./routes/roles.routes";
import privelegesRouter from "./routes/priveleges.routes";
import catalogRouter from "./routes/catalog.routes";
import productTypesRouter from "./routes/productTypes.routes";
import ordersRouter from "./routes/orders.routes";
import { verifyToken } from "./middleware/verifyToken";
import { verifyRole } from "./middleware/verifyRole";
import { Bot } from "./bot/index";
import { ConfigService } from "./bot/config.service";

const app: Application = express();
const server: Server = new Server(app);
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

app.use("/api", authRouter);
app.use("/api/catalog", catalogRouter);
app.use("/api/product-types", productTypesRouter);
app.use("/api/order", ordersRouter);

app.use(verifyToken);
app.use(verifyRole);
app.use("/api/users", userRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/priveleges", privelegesRouter);

export const ordersBot = new Bot(new ConfigService());
ordersBot.bot.catch((error) => console.log(error));
ordersBot.init();

app
  .listen(PORT, "localhost", function () {
    console.log(`Server is running on port ${PORT}.`);
  })
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log("Error: address already in use");
    } else {
      console.log(err);
    }
  });
