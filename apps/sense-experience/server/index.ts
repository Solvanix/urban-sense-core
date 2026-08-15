import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createMysqlProviderInterestStore } from "./mysqlProviderInterestStore.js";
import { createMysqlReviewerIdentityStore } from "./mysqlReviewerIdentityStore.js";
import { createRejectingReviewerSubjectResolver } from "./reviewerIdentityService.js";
import { createSenseContext } from "./context.js";
import { appRouter } from "./router.js";

const connectionString = process.env.SENSE_EXPERIENCE_DATABASE_URL;
const acceptRealData = process.env.SENSE_EXPERIENCE_ACCEPT_REAL_DATA === "true";

if (!connectionString || !acceptRealData) {
  console.error("SENSE Experience API remains disabled. Set an independent SENSE_EXPERIENCE_DATABASE_URL and SENSE_EXPERIENCE_ACCEPT_REAL_DATA=true only after the readiness gate is approved.");
  process.exitCode = 1;
} else {
  const app = express();
  const store = createMysqlProviderInterestStore();
  const reviewerStore = createMysqlReviewerIdentityStore();
  const reviewerResolver = createRejectingReviewerSubjectResolver<express.Request>();
  const port = Number(process.env.PORT);
  if (!Number.isInteger(port) || port <= 0) throw new Error("PORT is required to start the SENSE Experience API.");

  app.get("/health", (_req, res) => res.status(200).json({ status: "ready", application: "sense-experience" }));
  app.use("/api/trpc", createExpressMiddleware({
    router: appRouter,
    createContext: ({ req }) => createSenseContext(req, store, reviewerResolver, reviewerStore)
  }));
  app.listen(port, () => console.log(`SENSE Experience API listening on ${port}`));
}
