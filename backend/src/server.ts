import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// Explicitly load backend/.env using absolute path BEFORE other imports
const backendEnvPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: backendEnvPath });

// Also load frontend .env for shared EmailJS / provider configurations
const frontendEnvPath = path.resolve(__dirname, "../../frontend/.env");
dotenv.config({ path: frontendEnvPath });

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { ensureDemoAccounts } from "./services/demoSeedService";
import { apiRouter } from "./routes";
import http from "http";

const app = express();
const PORT = process.env.PORT || 5000;

// Multi-Port Redirect Bridge:
// Forwards any requests landing on alternate frontend ports (5173, 3001) to port 3000,
// preserving full URL path, query params, and client-side hash fragments.
function startPortRedirectBridge(bridgePort: number, targetPort: number = 3000) {
  try {
    const bridge = http.createServer((req, res) => {
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>COOPNEX — Redirecting...</title>
  <script>
    var target = "http://localhost:${targetPort}" + window.location.pathname + window.location.search + window.location.hash;
    window.location.replace(target);
  </script>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 60px 20px; background: #0b1220; color: #f8fafc;">
  <div style="max-width: 480px; margin: 0 auto; background: #1e293b; padding: 32px; border-radius: 16px; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <div style="font-size: 36px; margin-bottom: 12px;">🤝</div>
    <h2 style="color: #38bdf8; margin: 0 0 8px 0; font-size: 22px;">COOPNEX Portal</h2>
    <p style="color: #94a3b8; font-size: 14px; margin: 0 0 20px 0;">Forwarding your authentication session to port ${targetPort}...</p>
    <a id="fallback" href="http://localhost:${targetPort}" style="display: inline-block; background: #0284c7; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Continue to COOPNEX &rarr;</a>
    <script>
      var t = "http://localhost:${targetPort}" + window.location.pathname + window.location.search + window.location.hash;
      document.getElementById('fallback').href = t;
    </script>
  </div>
</body>
</html>`;

      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      });
      res.end(html);
    });

    bridge.on("error", (err: any) => {
      // Port already in use or restricted, silently skip
      console.log(`[COOPNEX Port Bridge] Port ${bridgePort} not bound (${err.code || err.message}).`);
    });

    bridge.listen(bridgePort, "0.0.0.0", () => {
      console.log(`[COOPNEX Port Bridge] Listening on port ${bridgePort} -> Redirecting seamlessly to port ${targetPort}`);
    });
  } catch (err) {
    // Non-fatal fallback
  }
}

// Allowed Origins & CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3001",
  "http://127.0.0.1:3001"
];
if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(",").forEach((u) => {
    const trimmed = u.trim();
    if (trimmed) allowedOrigins.push(trimmed);
  });
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV === "development" ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".onrender.com") ||
        origin.endsWith(".railway.app")
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during production transitions
      }
    },
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "HEALTHY",
    service: "Sahakari Seva Backend API",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// API Routes
app.use("/api", apiRouter);

// Production Static Serving
const frontendDist = path.resolve(__dirname, "../../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get("*", (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/health")) {
      return next();
    }
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[ServerError]", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

// Start Server
const startServer = async () => {
  await connectDB();
  await ensureDemoAccounts();

  // Start port bridges for 5173 and 3001 to forward browser traffic to port 3000
  startPortRedirectBridge(5173, 3000);
  startPortRedirectBridge(3001, 3000);

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` SAHAKARI SEVA - National Cooperative Marketplace API`);
    console.log(` Running on: http://localhost:${PORT}`);
    console.log(` Health:     http://localhost:${PORT}/health`);
    console.log(`=======================================================`);
  });
};

startServer();

export default app;

