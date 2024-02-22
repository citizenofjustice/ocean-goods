import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express, { Application } from "express";

// Exporting a default class Server
export default class Server {
  // Constructor for the Server class
  constructor(app: Application) {
    // Configuring the app
    this.config(app);
  }

  // Private method to configure the app
  private config(app: Application): void {
    // Loading environment variables from .env file
    dotenv.config();

    // Defining CORS options
    const corsOptions: CorsOptions = {
      // Setting the origin based on whether the app is hosted locally
      origin: "https://ocean-goods-client.vercel.app",
      // Allowing credentials
      credentials: true,
      methods: "POST, GET, PUT, DELETE, OPTIONS",
    };

    app.use(cors(corsOptions)); // Using CORS with the defined options
    app.use(express.json()); // Using express.json middleware to parse JSON requests
    app.use(cookieParser()); // Using cookieParser middleware to parse cookies
    app.use(bodyParser.json({ limit: "5mb" })); // Using bodyParser.json middleware to parse JSON bodies with a limit of 5mb
    app.use(bodyParser.urlencoded({ limit: "5mb", extended: true })); // Using bodyParser.urlencoded middleware to parse URL-encoded bodies with a limit of 5mb
  }
}
