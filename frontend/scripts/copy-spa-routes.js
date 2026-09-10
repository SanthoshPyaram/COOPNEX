import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, "../dist");
const indexPath = path.join(distDir, "index.html");

if (fs.existsSync(indexPath)) {
  const routes = [
    "admin",
    "admin/login",
    "society",
    "federation",
    "worker",
    "worker/login",
    "app",
    "demo"
  ];

  for (const route of routes) {
    const routeDir = path.join(distDir, route);
    fs.mkdirSync(routeDir, { recursive: true });
    fs.copyFileSync(indexPath, path.join(routeDir, "index.html"));
    console.log(`[SPA Route] Created physical fallback: ${route}/index.html`);
  }

  // Ensure 404.html also contains index.html fallback
  fs.copyFileSync(indexPath, path.join(distDir, "404-fallback.html"));
  console.log("[SPA Route] Created dist/404-fallback.html");
} else {
  console.warn("[SPA Route] dist/index.html not found, skipping SPA route duplication.");
}
