import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '..', 'dist');
const PORT = 4173;

// Simple static file server
function startServer() {
  return new Promise((res) => {
    const server = createServer((req, reply) => {
      let filePath = resolve(DIST, req.url === '/' ? 'index.html' : req.url.slice(1));
      try {
        const content = readFileSync(filePath);
        const ext = filePath.split('.').pop();
        const types = { html: 'text/html', js: 'application/javascript', css: 'text/css', svg: 'image/svg+xml', json: 'application/json' };
        reply.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
        reply.end(content);
      } catch {
        // SPA fallback
        const html = readFileSync(resolve(DIST, 'index.html'));
        reply.writeHead(200, { 'Content-Type': 'text/html' });
        reply.end(html);
      }
    });
    server.listen(PORT, () => res(server));
  });
}

async function prerender() {
  console.log('Pre-rendering: starting server...');
  const server = await startServer();

  console.log('Pre-rendering: launching browser...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
  // Wait for animations to settle and content to render
  await new Promise((r) => setTimeout(r, 3000));

  const html = await page.content();
  await browser.close();
  server.close();

  writeFileSync(resolve(DIST, 'index.html'), html);
  console.log('Pre-rendering: done! dist/index.html now contains rendered HTML.');
}

prerender().catch((err) => {
  console.error('Pre-rendering failed:', err);
  process.exit(1);
});
