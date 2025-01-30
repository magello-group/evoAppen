import express, { Express } from "express";
import swaggerUI from "swagger-ui-express";
import cors from "cors";
import yaml from "yamljs";
import { getConfig } from "./config";
import answerRound from "./routes/answerRound";
import viewRound from "./routes/viewRound";
import template from "./routes/template";
import templates from "./routes/templates";
import rounds from "./routes/rounds";
import round from "./routes/round";
import { configureMongoose } from "./models/mongoose";
import { observability } from "./config/observability";
import auth from "./auth";

// Use API_ALLOW_ORIGINS env var with comma separated urls like
// `http://localhost:300, http://otherurl:100`
// Requests coming to the api server from other urls will be rejected as per
// CORS.
const allowOrigins = "http://localhost:5173";

// Use NODE_ENV to change webConfiguration based on this value.
// For example, setting NODE_ENV=development disables CORS checking,
// allowing all origins.
const environment = process.env.NODE_ENV;

const originList = (): string[] | string => {
  if (environment && environment === "development") {
    console.log(`Allowing requests from any origins. NODE_ENV=${environment}`);
    return "*";
  }

  const origins = ["https://portal.azure.com", "https://ms.portal.azure.com"];

  if (allowOrigins) {
    allowOrigins.split(",").forEach((origin) => {
      origins.push(origin);
    });
  }
  return origins;
};

export const createApp = async (): Promise<Express> => {
  const config = await getConfig();
  const app = express();

  // Configuration
  observability(config.observability);
  await configureMongoose(config.database);
  // Middleware
  app.use(express.json());

  app.use(
    cors({
      origin: originList(),
    })
  );

  app.use("/answer", answerRound);
  app.use("/view", auth, viewRound);

  app.use("/rounds", auth, rounds);
  app.use("/templates", auth, templates);

  app.use("/round", auth, round);
  app.use("/template", auth, template);

  // Swagger UI
  const swaggerDocument = yaml.load("./openapi.yaml");
  app.use("/", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

  return app;
};
