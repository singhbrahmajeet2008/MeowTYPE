// Secure, production-ready static file server for meow-typing (Zero external dependencies)
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.sql': 'text/plain; charset=UTF-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Access-Control-Allow-Origin': '*'
};

const server = http.createServer((req, res) => {
  // 1. Only allow safe methods: GET, HEAD
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=UTF-8', ...SECURITY_HEADERS });
    return res.end('405 Method Not Allowed');
  }

  // 2. Safely decode URL path to prevent URI malformed crashes
  let reqPath = '/';
  try {
    reqPath = decodeURI(req.url.split('?')[0]);
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=UTF-8', ...SECURITY_HEADERS });
    return res.end('400 Bad Request');
  }

  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  // 3. Strict directory traversal protection
  const safePath = path.resolve(PUBLIC_DIR, '.' + path.normalize(reqPath));
  if (!safePath.toLowerCase().startsWith(PUBLIC_DIR.toLowerCase())) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=UTF-8', ...SECURITY_HEADERS });
    return res.end('403 Forbidden');
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8', ...SECURITY_HEADERS });
      return res.end('<h1>404 Not Found</h1><p><a href="/">Return to meow-typing</a></p>');
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
      ...SECURITY_HEADERS
    });

    if (req.method === 'HEAD') {
      return res.end();
    }

    const stream = fs.createReadStream(safePath);
    stream.on('error', () => {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain', ...SECURITY_HEADERS });
      }
      res.end('500 Internal Server Error');
    });
    stream.pipe(res);
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`\n🚀 meow-typing is running securely at: http://localhost:${PORT}`);
    console.log(`💡 Press Ctrl+C to stop the server\n`);
  });
}

module.exports = (req, res) => {
  server.emit('request', req, res);
};
