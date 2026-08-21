import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();

function read(relativePath: string) {
  return readFileSync(path.join(projectRoot, relativePath), "utf8");
}

describe("independent deployment bundle", () => {
  it("provides a portable application image and a health endpoint", () => {
    expect(read("Dockerfile")).toContain('CMD ["node", "dist/index.js"]');
    expect(read("server/_core/index.ts")).toContain('app.get("/healthz"');
  });

  it("keeps runtime values outside versioned compose configuration", () => {
    const compose = read("compose.yaml");
    expect(compose).toContain(".env.runtime");
    expect(compose).toContain("MYSQL_PASSWORD: ${MYSQL_PASSWORD");
    expect(compose).not.toMatch(/MYSQL_PASSWORD:\s+[A-Za-z0-9]{12,}/);
  });

  it("documents a fresh demonstration bootstrap without committing real secrets", () => {
    expect(read(".env.runtime.example")).toContain("replace-with-a-unique-long-password");
    expect(read("ops/DEPLOYMENT.md")).toContain("قاعدة MySQL فارغة محلية");
  });
});
