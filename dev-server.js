const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const clients = new Set();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8"
};

const liveReloadSnippet = `
<script>
(() => {
  const events = new EventSource("/__live-reload");
  events.addEventListener("reload", () => location.reload());
})();
</script>`;

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, headers);
  res.end(body);
}

function safePath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split("?")[0]);
  const requestPath = decodedPath === "/" ? "/index.html" : decodedPath;
  const filePath = path.normalize(path.join(root, requestPath));

  if (!filePath.startsWith(root)) {
    return null;
  }

  return filePath;
}

function serveFile(req, res) {
  const filePath = safePath(req.url);

  if (!filePath) {
    send(res, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, error.code === "ENOENT" ? 404 : 500, error.code === "ENOENT" ? "Not Found" : "Server Error");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const headers = { "Content-Type": mimeTypes[ext] || "application/octet-stream" };

    if (ext === ".html") {
      const html = data.toString("utf8").replace("</body>", `${liveReloadSnippet}\n</body>`);
      send(res, 200, html, headers);
      return;
    }

    send(res, 200, data, headers);
  });
}

const server = http.createServer((req, res) => {
  if (req.url === "/__live-reload") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    });
    res.write("\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }

  serveFile(req, res);
});

let reloadTimer;
fs.watch(root, { recursive: true }, (eventType, filename) => {
  if (!filename || filename.includes("node_modules") || filename.startsWith(".git")) {
    return;
  }

  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    for (const client of clients) {
      client.write("event: reload\ndata: now\n\n");
    }
  }, 100);
});

server.listen(port, () => {
  console.log(`Live reload server running at http://localhost:${port}`);
});
