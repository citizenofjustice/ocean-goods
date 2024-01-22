import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

export default class Server {
  constructor(app: Application) {
    this.config(app);
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: "http://localhost:5173",
      credentials: true,
      methods: "GET, POST, PUT, DELETE",
      allowedHeaders: "Content-Type, *",
    };

    dotenv.config();
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(bodyParser.json({ limit: "5mb" }));
    app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
  }
}
