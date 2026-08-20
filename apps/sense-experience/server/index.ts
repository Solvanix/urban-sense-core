import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createMysqlProviderInterestStore } from "./mysqlProviderInterestStore.js";
import { createMysqlReviewerIdentityStore } from "./mysqlReviewerIdentityStore.js";
import { createSignedReviewerSessionResolver } from "./reviewerSession.js";
import { readReviewerOidcConfig, registerReviewerOidcRoutes } from "./reviewerOidcAuth.js";
import { createSenseContext } from "./context.js";
import { appRouter } from "./router.js";

const connectionString = process.env.SENSE_EXPERIENCE_DATABASE_URL;
const acceptRealData = process.env.SENSE_EXPERIENCE_ACCEPT_REAL_DATA === "true";
const reviewerOidcConfig = readReviewerOidcConfig();

async function start() {
  if (!connectionString || !acceptRealData || !reviewerOidcConfig) {
    console.error("SENSE Experience API remains disabled. Before accepting real provider data, configure an independent database, explicit real-data approval, and the complete independent OIDC reviewer login boundary.");
    process.exitCode = 1;
    return;
  }
  const app = express();
  const store = createMysqlProviderInterestStore();
  const reviewerStore = createMysqlReviewerIdentityStore();
  if (!await reviewerStore.hasActiveReviewer()) {
    console.error("SENSE Experience API remains disabled. Create an active independent reviewer identity and active role assignment before accepting real provider data.");
    process.exitCode = 1;
    return;
  }
  const reviewerResolver = createSignedReviewerSessionResolver<express.Request>(reviewerOidcConfig.reviewerSessionSecret);
  const port = Number(process.env.PORT);
  if (!Number.isInteger(port) || port <= 0) throw new Error("PORT is required to start the SENSE Experience API.");

  registerReviewerOidcRoutes(app, reviewerOidcConfig);
  app.get("/health", (_req, res) => res.status(200).json({ status: "ready", application: "sense-experience" }));
  app.use("/api/trpc", createExpressMiddleware({
    router: appRouter,
    createContext: ({ req }) => createSenseContext(req, store, reviewerResolver, reviewerStore)
  }));
  app.listen(port, () => console.log(`SENSE Experience API listening on ${port}`));
}

void start();
