import config from "../config.js";

import express, { Application } from "express";

import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import router from "./router.js";

import { logger, ExpressLogger } from "../helpers/logger.js";
import { morganProdOptions } from "../helpers/express.js";

export default class API {
  private api: Application;
  private portNumber: string | number;

  constructor() {
    this.api = express();
    this.portNumber = config.env.API_PORT;

    this.setup();
  }

  private setup(): void {
    this.api.disable("x-powered-by");

    this.api.set("trust proxy", 1);
    this.api.set("json spaces", 2);

    this.api.use(
      cors({
        origin: "*",
        allowedHeaders: ["content-type"],
        credentials: true,
        optionsSuccessStatus: 200,
      }),
    );

    this.api.use(
      morgan(config.env.NODE_ENV !== "production" ? "dev" : morganProdOptions, {
        stream: ExpressLogger,
      }),
    );
    this.api.use(helmet({ contentSecurityPolicy: false }));
    this.api.use(cookieParser());
    this.api.use(express.json({ limit: "10mb" }));
    this.api.use(bodyParser.json());
    this.api.use(bodyParser.urlencoded({ extended: true }));
    this.api.use(compression());

    // Temporary disabled.
    // this.api.use(authHandler);
    this.api.use(config.env.API_VERSION, router());

    this.start();
  }

  private async start(): Promise<void> {
    this.api.listen(this.portNumber, () => {
      logger.info(`API > Listening on http://localhost:${this.portNumber}${config.env.API_VERSION}`);
    });
  }
}

process.once("SIGTERM", () => {
  logger.error("API > SIGTERM received, shutting down...");

  process.exit(1);
});
