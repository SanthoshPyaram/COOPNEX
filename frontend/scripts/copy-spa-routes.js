import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, "../dist");
const indexPath = path.join(distDir, "index.html");

if (fs.existsSync(indexPath)) {
  const routes = [
    "register",
    "login",
    "join-worker",
    "services",
    "how-it-works",
    "for-workers",
    "for-cooperatives",
    "about",
    "admin",
    "admin/login",
    "admin-portal",
    "society",
    "society-admin",
    "federation",
    "worker",
    "worker/login",
    "worker/register",
    "worker/dashboard",
    "customer",
    "app",
    "demo",
    "voice-test",
    "admin/voice-test"
  ];

  for (const route of routes) {
    // Physical route at dist/<route>/index.html
    const routeDir = path.join(distDir, route);
    fs.mkdirSync(routeDir, { recursive: true });
    fs.copyFileSync(indexPath, path.join(routeDir, "index.html"));

    // Physical route at dist/COOPNEX/<route>/index.html
    const coopnexRouteDir = path.join(distDir, "COOPNEX", route);
    fs.mkdirSync(coopnexRouteDir, { recursive: true });
    fs.copyFileSync(indexPath, path.join(coopnexRouteDir, "index.html"));

    console.log(`[SPA Route] Created physical fallback: ${route}/index.html`);
  }

  // Ensure dist/COOPNEX/index.html exists
  const coopnexDir = path.join(distDir, "COOPNEX");
  fs.mkdirSync(coopnexDir, { recursive: true });
  fs.copyFileSync(indexPath, path.join(coopnexDir, "index.html"));

  // Critical for GitHub Pages SPA routing: 404.html
  fs.copyFileSync(indexPath, path.join(distDir, "404.html"));
  fs.copyFileSync(indexPath, path.join(coopnexDir, "404.html"));
  fs.copyFileSync(indexPath, path.join(distDir, "404-fallback.html"));
  console.log("[SPA Route] Created dist/404.html and dist/404-fallback.html");
} else {
  console.warn("[SPA Route] dist/index.html not found, skipping SPA route duplication.");
}
