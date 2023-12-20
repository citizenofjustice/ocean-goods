import express, { Application } from "express";
import Server from "./index";
import userRouter from "./routes/user.routes";
import catalogRouter from "./routes/catalog.routes";

const app: Application = express();
const server: Server = new Server(app);
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

app.use("/api/users", userRouter);
app.use("/api/catalog", catalogRouter);

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
