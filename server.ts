import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Development: Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve compiled static files with explicit, strict MIME types
    const distPath = path.join(process.cwd(), 'dist');

    app.use(
      express.static(distPath, {
        setHeaders: (res, filePath) => {
          // Guarantee strict JavaScript & WASM MIME types per HTML spec
          if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
            res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
          } else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css; charset=UTF-8');
          } else if (filePath.endsWith('.wasm')) {
            res.setHeader('Content-Type', 'application/wasm');
          } else if (filePath.endsWith('.json')) {
            res.setHeader('Content-Type', 'application/json');
          } else if (filePath.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html; charset=UTF-8');
          } else if (filePath.endsWith('.svg')) {
            res.setHeader('Content-Type', 'image/svg+xml');
          }
        },
      })
    );

    // Prevent missing asset requests from falling through to index.html
    app.get('/assets/*', (req, res) => {
      res.status(404).type('text/plain').send('Asset not found');
    });

    // SPA fallback to index.html for client-side routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
