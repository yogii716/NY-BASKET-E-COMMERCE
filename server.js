/**
 * NyBasket – E-Commerce Sales & Customer Analytics Platform
 * Zero-Dependency Node.js Server & Static Host Launcher
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 5000;
const FRONTEND_DIR = path.join(__dirname, 'frontend');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // Default route
    if (pathname === '/') {
        pathname = '/index.html';
    }

    let filePath = path.join(FRONTEND_DIR, pathname);

    // Clean URL resolution (e.g. /dashboard -> /dashboard.html)
    if (!path.extname(filePath)) {
        if (fs.existsSync(filePath + '.html')) {
            filePath += '.html';
        }
    }

    // Security check: prevent directory traversal outside FRONTEND_DIR
    const safePath = path.resolve(filePath);
    if (!safePath.startsWith(path.resolve(FRONTEND_DIR))) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(safePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Fallback for SPA/routing or 404
            const fallbackPath = path.join(FRONTEND_DIR, 'index.html');
            fs.readFile(fallbackPath, (fallbackErr, content) => {
                if (fallbackErr) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('404 Not Found');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(content);
                }
            });
            return;
        }

        const ext = path.extname(safePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        fs.readFile(safePath, (readErr, data) => {
            if (readErr) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
                return;
            }

            res.writeHead(200, {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            });
            res.end(data);
        });
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log("============================================================");
    console.log(">> Starting NyBasket - E-Commerce & Analytics Platform (Node.js)");
    console.log("============================================================");
    console.log(`\n* NyBasket Web Application is live at:`);
    console.log(`   -> http://127.0.0.1:${PORT}/`);
    console.log(`   -> http://localhost:${PORT}/`);
    console.log(`\n* Key Pages Available:`);
    console.log(`   - Storefront Home:     http://127.0.0.1:${PORT}/index.html`);
    console.log(`   - Product Catalog:     http://127.0.0.1:${PORT}/products.html`);
    console.log(`   - Shopping Cart:       http://127.0.0.1:${PORT}/cart.html`);
    console.log(`   - Executive Dashboard: http://127.0.0.1:${PORT}/dashboard.html`);
    console.log(`   - Customer Analytics:  http://127.0.0.1:${PORT}/customers.html`);
    console.log(`   - Deep-Dive Analytics: http://127.0.0.1:${PORT}/analytics.html`);
    console.log("============================================================\n");
});
