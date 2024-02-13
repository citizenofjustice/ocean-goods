import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

export default class Server {
  constructor(app: Application) {
    this.config(app);
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin:
        process.env.IS_HOSTED_LOCALLY === "true"
          ? "http://localhost:5173"
          : "https://ocean-goods-client.vercel.app",
      credentials: true,
    };

    dotenv.config();
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(cookieParser());
    app.use(bodyParser.json({ limit: "5mb" }));
    app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
  }
}
