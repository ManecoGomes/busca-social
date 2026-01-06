import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Middleware para redirecionamentos (equivalente ao .htaccess do Apache)
app.use((req, res, next) => {
  const host = req.get('host') || '';
  const protocol = req.get('x-forwarded-proto') || req.protocol;
  
  // 1. Redirecionar www para não-www (sempre)
  if (host.startsWith('www.')) {
    const newHost = host.replace(/^www\./, '');
    return res.redirect(301, `${protocol}://${newHost}${req.originalUrl}`);
  }
  
  // 2. Redirecionar HTTP para HTTPS (apenas em produção)
  if (app.get('env') === 'production' && protocol === 'http') {
    return res.redirect(301, `https://${host}${req.originalUrl}`);
  }
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Headers para SEO e compatibilidade com crawlers (Google, Bing, Cloudflare, etc.)
app.use((req, res, next) => {
  // Permitir que crawlers acessem o conteúdo
  res.setHeader('X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  
  // Cache headers otimizados para crawlers
  if (req.path === '/robots.txt' || req.path === '/sitemap.xml') {
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 horas
  }
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Serve SEO files (robots.txt, sitemap.xml) before Vite catches all routes
  app.get('/robots.txt', (_req, res) => {
    res.type('text/plain');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 horas para crawlers
    res.sendFile('robots.txt', { root: './public' });
  });

  app.get('/sitemap.xml', (_req, res) => {
    res.type('application/xml');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 horas para crawlers
    res.sendFile('sitemap.xml', { root: './public' });
  });

  // Serve favicon before Vite catches all routes
  app.get('/favicon.png', (_req, res) => {
    res.type('image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 ano
    res.sendFile('favicon.png', { root: './public' });
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
