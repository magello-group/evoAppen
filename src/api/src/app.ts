import express, { Express } from "express";
import swaggerUI from "swagger-ui-express";
import cors from "cors";
import yaml from "yamljs";
import { getConfig } from "./config";
import rounds from "./routes/editRounds";
import protectedRounds from "./routes/viewRounds";
import newOrEditRounds from "./routes/rounds";
import newTemplate from "./routes/newtemplate";
import roundList from "./routes/roundList";
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
  // round routes
  app.use("/round", rounds);
  app.use("/round", auth, protectedRounds);
  app.use("/rounds", auth, roundList);
  app.use("/newfeedbackround", auth, newOrEditRounds);
  //template routes
  app.use("/newtemplate", auth, newTemplate);

  // Swagger UI
  const swaggerDocument = yaml.load("./openapi.yaml");
  app.use("/", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

  return app;
};
