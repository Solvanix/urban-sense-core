import express from "express";
import path from "node:path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createMysqlProviderInterestStore } from "./mysqlProviderInterestStore.js";
import { createMysqlReviewerIdentityStore } from "./mysqlReviewerIdentityStore.js";
import { createSignedReviewerSessionResolver } from "./reviewerSession.js";
import { readReviewerOidcConfig, registerReviewerOidcRoutes } from "./reviewerOidcAuth.js";
import { createSenseContext } from "./context.js";
import { appRouter } from "./router.js";
import { resolveRuntimeReadiness } from "./runtimeReadiness.js";

const connectionString = process.env.SENSE_EXPERIENCE_DATABASE_URL;
const acceptRealData = process.env.SENSE_EXPERIENCE_ACCEPT_REAL_DATA === "true";
const reviewerOidcConfig = readReviewerOidcConfig();

async function start() {
  const app = express();
  const port = Number(process.env.PORT);
  if (!Number.isInteger(port) || port <= 0) throw new Error("PORT is required to start the SENSE Experience API.");

  const reviewerStore = connectionString && reviewerOidcConfig ? createMysqlReviewerIdentityStore() : null;
  const hasActiveReviewer = reviewerStore ? await reviewerStore.hasActiveReviewer() : false;
  const readiness = resolveRuntimeReadiness({
    databaseUrl: connectionString,
    realDataApproved: acceptRealData,
    reviewerOidcConfigured: Boolean(reviewerOidcConfig),
    hasActiveReviewer
  });

  app.get("/healthz", (_req, res) => res.status(200).json({
    application: "sense-experience",
    status: readiness.acceptsProviderData ? "ready" : "blocked",
    providerData: readiness.acceptsProviderData ? "enabled" : "disabled",
    reason: readiness.reason
  }));

  if (readiness.acceptsProviderData && reviewerOidcConfig && reviewerStore) {
    const store = createMysqlProviderInterestStore();
    const reviewerResolver = createSignedReviewerSessionResolver<express.Request>(reviewerOidcConfig.reviewerSessionSecret);
    registerReviewerOidcRoutes(app, reviewerOidcConfig);
    app.use("/api/trpc", createExpressMiddleware({
      router: appRouter,
      createContext: ({ req }) => createSenseContext(req, store, reviewerResolver, reviewerStore)
    }));
  } else {
    app.use("/api/trpc", (_req, res) => res.status(503).json({
      error: "SENSE Experience provider data is not open.",
      reason: readiness.reason
    }));
  }

  const staticDirectory = path.resolve(process.cwd(), "dist");
  app.use(express.static(staticDirectory));
  app.use((request, response, next) => {
    const excluded = request.path.startsWith("/api/") || request.path.startsWith("/auth/") || request.path === "/healthz";
    if (request.method !== "GET" || excluded) return next();
    response.sendFile(path.join(staticDirectory, "index.html"));
  });
  app.listen(port, () => console.log(`SENSE Experience API listening on ${port}`));
}

void start();
