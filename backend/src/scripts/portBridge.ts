import http from "http";

const PORT = 5173;
const TARGET_PORT = 3000;

const server = http.createServer((req, res) => {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>COOPNEX — Redirecting...</title>
  <script>
    var target = "http://localhost:${TARGET_PORT}" + window.location.pathname + window.location.search + window.location.hash;
    window.location.replace(target);
  </script>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 60px 20px; background: #0b1220; color: #f8fafc;">
  <div style="max-width: 480px; margin: 0 auto; background: #1e293b; padding: 32px; border-radius: 16px; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <div style="font-size: 36px; margin-bottom: 12px;">🤝</div>
    <h2 style="color: #38bdf8; margin: 0 0 8px 0; font-size: 22px;">COOPNEX Portal</h2>
    <p style="color: #94a3b8; font-size: 14px; margin: 0 0 20px 0;">Forwarding your authentication session to port ${TARGET_PORT}...</p>
    <a id="fallback" href="http://localhost:${TARGET_PORT}" style="display: inline-block; background: #0284c7; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Continue to COOPNEX &rarr;</a>
    <script>
      var t = "http://localhost:${TARGET_PORT}" + window.location.pathname + window.location.search + window.location.hash;
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

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[COOPNEX PORT BRIDGE] Listening on port ${PORT} -> Forwarding all traffic & auth hash to port ${TARGET_PORT}`);
});

server.on("error", (err: any) => {
  console.warn(`[COOPNEX PORT BRIDGE] Port ${PORT} bridge warning:`, err.message);
});

