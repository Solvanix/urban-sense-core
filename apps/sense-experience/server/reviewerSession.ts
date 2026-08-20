import { jwtVerify, SignJWT } from "jose";
import type { ReviewerSubjectResolver, ValidatedReviewerSubject } from "./reviewerIdentityService.js";

const SESSION_COOKIE = "sense_experience_reviewer";
const SESSION_ISSUER = "sense-experience";
const SESSION_AUDIENCE = "reviewer-session";
const MINIMUM_SECRET_LENGTH = 32;

type CookieRequest = {
  headers?: Record<string, string | string[] | undefined>;
};

export type ReviewerSession = ValidatedReviewerSubject & {
  expiresAt: Date;
};

function sessionKey(secret: string) {
  if (secret.length < MINIMUM_SECRET_LENGTH) {
    throw new Error("SENSE_EXPERIENCE_REVIEWER_SESSION_SECRET must be at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

function readCookie(request: CookieRequest, name: string): string | null {
  const header = request.headers?.cookie;
  const raw = Array.isArray(header) ? header[0] : header;
  if (!raw) return null;
  const prefix = `${name}=`;
  const value = raw.split(";").map((part) => part.trim()).find((part) => part.startsWith(prefix));
  return value ? decodeURIComponent(value.slice(prefix.length)) : null;
}

/**
 * Issues the short-lived, HTTP-only-cookie payload after an independent OIDC
 * callback has validated the provider identity. This function intentionally
 * accepts a validated subject rather than request headers or query values.
 */
export async function issueReviewerSession(
  subject: ValidatedReviewerSubject,
  secret: string,
  now = new Date(),
  lifetimeSeconds = 60 * 60 * 8
): Promise<ReviewerSession & { token: string }> {
  const expiresAt = new Date(now.getTime() + lifetimeSeconds * 1000);
  const token = await new SignJWT({ provider: subject.provider })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setSubject(subject.subject)
    .setIssuedAt(Math.floor(now.getTime() / 1000))
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(sessionKey(secret));
  return { ...subject, expiresAt, token };
}

/**
 * Resolves only an independently issued, signed reviewer session from an
 * HTTP cookie. It never trusts a caller supplied role, subject, header, or
 * query string. A valid session still requires an active identity and role
 * assignment in the SENSE Experience database before tRPC grants access.
 */
export function createSignedReviewerSessionResolver<Request extends CookieRequest>(
  secret: string,
  now = () => new Date()
): ReviewerSubjectResolver<Request> {
  const key = sessionKey(secret);
  return {
    async resolve(request) {
      const token = readCookie(request, SESSION_COOKIE);
      if (!token) return null;
      try {
        const { payload } = await jwtVerify(token, key, {
          issuer: SESSION_ISSUER,
          audience: SESSION_AUDIENCE,
          currentDate: now()
        });
        if (
          (payload.provider !== "external_oidc" && payload.provider !== "manus_oauth") ||
          typeof payload.sub !== "string" ||
          !payload.sub.trim() ||
          payload.sub.length > 191
        ) {
          return null;
        }
        return { provider: payload.provider, subject: payload.sub };
      } catch {
        return null;
      }
    }
  };
}

export function reviewerSessionCookieName() {
  return SESSION_COOKIE;
}
