import { createHash, randomUUID } from "node:crypto";
import type { Express, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { issueReviewerSession, reviewerSessionCookieName } from "./reviewerSession.js";

const OIDC_STATE_COOKIE = "sense_experience_oidc_state";
const OIDC_SCOPE = "openid profile email";

type OidcDiscovery = {
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
  issuer: string;
};

export type ReviewerOidcConfig = {
  issuer: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  webOrigin: string;
  reviewerSessionSecret: string;
};

type PendingAuthorization = {
  state: string;
  verifier: string;
};

function required(name: string, value: string | undefined) {
  if (!value?.trim()) throw new Error(`${name} is required before SENSE Experience accepts real provider data.`);
  return value.trim();
}

export function readReviewerOidcConfig(env: Record<string, string | undefined> = process.env): ReviewerOidcConfig | null {
  const oidcKeys = [
    "SENSE_EXPERIENCE_OIDC_ISSUER",
    "SENSE_EXPERIENCE_OIDC_CLIENT_ID",
    "SENSE_EXPERIENCE_OIDC_CLIENT_SECRET",
    "SENSE_EXPERIENCE_OIDC_REDIRECT_URI",
    "SENSE_EXPERIENCE_REVIEWER_SESSION_SECRET"
  ] as const;
  const configured = oidcKeys.filter((key) => Boolean(env[key]?.trim()));
  if (configured.length === 0) return null;

  const config: ReviewerOidcConfig = {
    issuer: required("SENSE_EXPERIENCE_OIDC_ISSUER", env.SENSE_EXPERIENCE_OIDC_ISSUER).replace(/\/$/, ""),
    clientId: required("SENSE_EXPERIENCE_OIDC_CLIENT_ID", env.SENSE_EXPERIENCE_OIDC_CLIENT_ID),
    clientSecret: required("SENSE_EXPERIENCE_OIDC_CLIENT_SECRET", env.SENSE_EXPERIENCE_OIDC_CLIENT_SECRET),
    redirectUri: required("SENSE_EXPERIENCE_OIDC_REDIRECT_URI", env.SENSE_EXPERIENCE_OIDC_REDIRECT_URI),
    webOrigin: required("SENSE_EXPERIENCE_WEB_ORIGIN", env.SENSE_EXPERIENCE_WEB_ORIGIN).replace(/\/$/, ""),
    reviewerSessionSecret: required("SENSE_EXPERIENCE_REVIEWER_SESSION_SECRET", env.SENSE_EXPERIENCE_REVIEWER_SESSION_SECRET)
  };
  for (const url of [config.issuer, config.redirectUri, config.webOrigin]) new URL(url);
  return config;
}

function cookieValue(request: Request, name: string) {
  const prefix = `${name}=`;
  const value = request.headers.cookie?.split(";").map((part) => part.trim()).find((part) => part.startsWith(prefix));
  return value ? decodeURIComponent(value.slice(prefix.length)) : null;
}

function serializePendingAuthorization(pending: PendingAuthorization) {
  return Buffer.from(JSON.stringify(pending), "utf8").toString("base64url");
}

function parsePendingAuthorization(value: string | null): PendingAuthorization | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<PendingAuthorization>;
    return typeof parsed.state === "string" && typeof parsed.verifier === "string" ? { state: parsed.state, verifier: parsed.verifier } : null;
  } catch {
    return null;
  }
}

function pkceChallenge(verifier: string) {
  return createHash("sha256").update(verifier).digest("base64url");
}

async function discover(issuer: string): Promise<OidcDiscovery> {
  const response = await fetch(`${issuer}/.well-known/openid-configuration`, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error("Unable to load the configured independent OIDC discovery document.");
  const body = await response.json() as Partial<OidcDiscovery>;
  if (!body.authorization_endpoint || !body.token_endpoint || !body.jwks_uri || !body.issuer) {
    throw new Error("Configured OIDC discovery document is incomplete.");
  }
  return body as OidcDiscovery;
}

async function exchangeCode(discovery: OidcDiscovery, config: ReviewerOidcConfig, code: string, verifier: string) {
  const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`, "utf8").toString("base64");
  const body = new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: config.redirectUri, code_verifier: verifier });
  const response = await fetch(discovery.token_endpoint, {
    method: "POST",
    headers: { authorization: `Basic ${credentials}`, "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
    body
  });
  if (!response.ok) throw new Error("The OIDC provider rejected the reviewer authorization code.");
  const tokenSet = await response.json() as { id_token?: string };
  if (!tokenSet.id_token) throw new Error("The OIDC provider did not return an ID token for the reviewer session.");
  const keys = createRemoteJWKSet(new URL(discovery.jwks_uri));
  const { payload } = await jwtVerify(tokenSet.id_token, keys, { issuer: config.issuer, audience: config.clientId });
  if (typeof payload.sub !== "string" || !payload.sub.trim() || payload.sub.length > 191) {
    throw new Error("The OIDC token does not contain a usable reviewer subject.");
  }
  return { provider: "external_oidc" as const, subject: payload.sub };
}

function secureCookieOptions() {
  return { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" };
}

function allowConfiguredOrigin(config: ReviewerOidcConfig) {
  return (request: Request, response: Response, next: () => void) => {
    const origin = request.headers.origin;
    if (origin && origin !== config.webOrigin) {
      response.status(403).json({ error: "Origin is not allowed for SENSE Experience." });
      return;
    }
    if (origin === config.webOrigin) {
      response.setHeader("access-control-allow-origin", config.webOrigin);
      response.setHeader("access-control-allow-credentials", "true");
      response.setHeader("access-control-allow-headers", "content-type");
      response.setHeader("vary", "origin");
    }
    if (request.method === "OPTIONS") {
      response.status(204).end();
      return;
    }
    next();
  };
}

/** Registers an authorization-code + PKCE flow for independent reviewer login. */
export function registerReviewerOidcRoutes(app: Express, config: ReviewerOidcConfig) {
  app.use(allowConfiguredOrigin(config));

  app.get("/auth/reviewer/start", async (_request, response) => {
    try {
      const pending = { state: randomUUID(), verifier: `${randomUUID()}${randomUUID()}` };
      const discovery = await discover(config.issuer);
      const authorizationUrl = new URL(discovery.authorization_endpoint);
      authorizationUrl.search = new URLSearchParams({
        client_id: config.clientId,
        response_type: "code",
        scope: OIDC_SCOPE,
        redirect_uri: config.redirectUri,
        state: pending.state,
        code_challenge: pkceChallenge(pending.verifier),
        code_challenge_method: "S256"
      }).toString();
      response.cookie(OIDC_STATE_COOKIE, serializePendingAuthorization(pending), { ...secureCookieOptions(), maxAge: 10 * 60 * 1000 });
      response.redirect(302, authorizationUrl.toString());
    } catch {
      response.status(503).json({ error: "Reviewer sign-in is unavailable until the independent OIDC provider is reachable." });
    }
  });

  app.get("/auth/reviewer/callback", async (request, response) => {
    response.clearCookie(OIDC_STATE_COOKIE, secureCookieOptions());
    const pending = parsePendingAuthorization(cookieValue(request, OIDC_STATE_COOKIE));
    const state = typeof request.query.state === "string" ? request.query.state : "";
    const code = typeof request.query.code === "string" ? request.query.code : "";
    if (!pending || pending.state !== state || !code) {
      response.status(400).json({ error: "The independent reviewer sign-in could not be validated." });
      return;
    }
    try {
      const identity = await exchangeCode(await discover(config.issuer), config, code, pending.verifier);
      const session = await issueReviewerSession(identity, config.reviewerSessionSecret);
      response.cookie(reviewerSessionCookieName(), session.token, { ...secureCookieOptions(), expires: session.expiresAt });
      response.redirect(302, `${config.webOrigin}/مراجعة`);
    } catch {
      response.status(403).json({ error: "The independent reviewer identity was not accepted." });
    }
  });
}
