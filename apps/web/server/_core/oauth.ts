import { COOKIE_NAME, ONE_YEAR_MS, OAUTH_STATE_COOKIE, encodeOAuthState, decodeOAuthState } from "@shared/const";
import { parse as parseCookieHeader } from "cookie";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

type OidcDiscovery = {
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
};

function callbackUrl(req: Request) {
  if (ENV.appBaseUrl) return `${ENV.appBaseUrl.replace(/\/$/, "")}/api/oauth/callback`;
  return `${req.protocol}://${req.get("host")}/api/oauth/callback`;
}

function requireOidcConfiguration() {
  if (!ENV.oidcIssuerUrl || !ENV.oidcClientId || !ENV.oidcClientSecret) {
    throw new Error("OIDC_ISSUER_URL, OIDC_CLIENT_ID and OIDC_CLIENT_SECRET are required when AUTH_MODE=oidc");
  }
}

async function oidcDiscovery(): Promise<OidcDiscovery> {
  requireOidcConfiguration();
  const issuer = ENV.oidcIssuerUrl.replace(/\/$/, "");
  const response = await fetch(`${issuer}/.well-known/openid-configuration`);
  if (!response.ok) throw new Error("Unable to load OIDC discovery document");
  const discovery = await response.json() as Partial<OidcDiscovery>;
  if (!discovery.authorization_endpoint || !discovery.token_endpoint || !discovery.userinfo_endpoint) {
    throw new Error("OIDC discovery document is missing required endpoints");
  }
  return discovery as OidcDiscovery;
}

async function signInWithOidc(req: Request, code: string, state: string) {
  const discovery = await oidcDiscovery();
  const tokenResponse = await fetch(discovery.token_endpoint, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: callbackUrl(req),
      client_id: ENV.oidcClientId,
      client_secret: ENV.oidcClientSecret,
    }),
  });
  if (!tokenResponse.ok) throw new Error("OIDC token exchange failed");
  const tokens = await tokenResponse.json() as { access_token?: string };
  if (!tokens.access_token) throw new Error("OIDC token response has no access token");

  const userInfoResponse = await fetch(discovery.userinfo_endpoint, {
    headers: { authorization: `Bearer ${tokens.access_token}` },
  });
  if (!userInfoResponse.ok) throw new Error("OIDC userinfo request failed");
  const userInfo = await userInfoResponse.json() as { sub?: string; name?: string; email?: string };
  if (!userInfo.sub) throw new Error("OIDC userinfo response has no subject");

  await db.upsertUser({
    openId: userInfo.sub,
    name: userInfo.name ?? null,
    email: userInfo.email ?? null,
    loginMethod: "oidc",
    lastSignedIn: new Date(),
  });
  return sdk.createSessionToken(userInfo.sub, { name: userInfo.name ?? "", expiresInMs: ONE_YEAR_MS });
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/auth/start", async (req: Request, res: Response) => {
    const nonce = crypto.randomUUID();
    const state = encodeOAuthState({ redirectUri: callbackUrl(req), nonce });
    res.cookie(OAUTH_STATE_COOKIE, nonce, { path: "/", maxAge: 10 * 60 * 1000, secure: true, sameSite: "none", httpOnly: true });

    try {
      if (ENV.authMode === "oidc") {
        const discovery = await oidcDiscovery();
        const loginUrl = new URL(discovery.authorization_endpoint);
        loginUrl.searchParams.set("client_id", ENV.oidcClientId);
        loginUrl.searchParams.set("redirect_uri", callbackUrl(req));
        loginUrl.searchParams.set("response_type", "code");
        loginUrl.searchParams.set("scope", "openid profile email");
        loginUrl.searchParams.set("state", state);
        res.redirect(302, loginUrl.toString());
        return;
      }

      const loginUrl = new URL(`${ENV.oAuthServerUrl.replace(/\/$/, "")}/app-auth`);
      loginUrl.searchParams.set("appId", ENV.appId);
      loginUrl.searchParams.set("redirectUri", callbackUrl(req));
      loginUrl.searchParams.set("state", state);
      loginUrl.searchParams.set("type", "signIn");
      res.redirect(302, loginUrl.toString());
    } catch (error) {
      console.error("[Auth] Login start failed", error);
      res.status(500).json({ error: "Unable to start sign in" });
    }
  });

  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    // CSRF guard: the nonce in `state` must match the one-time cookie that
    // startLogin set in the browser that began this login. An attacker can
    // forge `state`, but cannot plant this cookie in the victim's browser.
    const { nonce } = decodeOAuthState(state);
    const expectedNonce = parseCookieHeader(req.headers.cookie ?? "")[OAUTH_STATE_COOKIE];
    if (!nonce || nonce !== expectedNonce) {
      res.status(403).json({ error: "invalid oauth state" });
      return;
    }
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/", secure: true, sameSite: "none" });

    try {
      if (ENV.authMode === "oidc") {
        const sessionToken = await signInWithOidc(req, code, state);
        const cookieOptions = getSessionCookieOptions(req);
        res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
        res.redirect(302, "/");
        return;
      }

      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
