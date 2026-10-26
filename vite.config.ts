import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

function stravaOAuthPlugin() {
  return {
    name: 'strava-oauth-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const rawUrl = req.url || '';
        const url = new URL(rawUrl, `http://${req.headers.host || 'localhost'}`);

        // 1. Strava OAuth callback handler (Conforms to OAuth Integration Skill)
        if (url.pathname === '/auth/strava/callback' || url.pathname === '/auth/strava/callback/') {
          const code = url.searchParams.get('code') || '';
          const error = url.searchParams.get('error') || '';
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(`
            <!DOCTYPE html>
            <html lang="fr">
              <head>
                <meta charset="utf-8" />
                <title>Connexion Strava</title>
                <style>
                  body { font-family: -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 90vh; background: #FFF7FA; color: #2B091C; text-align: center; margin: 0; }
                  .card { background: white; padding: 32px; border-radius: 24px; box-shadow: 0 10px 30px rgba(131,24,67,0.1); border: 1px solid #FBCFE8; max-width: 400px; }
                  .btn { margin-top: 16px; background: #FC4C02; color: white; border: none; padding: 10px 20px; border-radius: 9999px; font-weight: bold; cursor: pointer; }
                </style>
              </head>
              <body>
                <div class="card">
                  <h2 style="margin: 0 0 8px 0; color: #FC4C02;">Strava Connecté</h2>
                  <p style="font-size: 14px; color: #6E4F5D;">Synchronisation de tes courses en cours. Cette fenêtre va se fermer automatiquement.</p>
                  <button class="btn" onclick="window.close()">Fermer</button>
                </div>
                <script>
                  if (window.opener) {
                    window.opener.postMessage({
                      type: 'STRAVA_AUTH_SUCCESS',
                      code: ${JSON.stringify(code)},
                      error: ${JSON.stringify(error)}
                    }, '*');
                    setTimeout(() => window.close(), 700);
                  }
                </script>
              </body>
            </html>
          `);
          return;
        }

        // 2. Token exchange endpoint (/api/strava/exchange-token)
        if (url.pathname === '/api/strava/exchange-token' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => { body += chunk; });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const clientId = data.clientId || process.env.STRAVA_CLIENT_ID;
              const clientSecret = data.clientSecret || process.env.STRAVA_CLIENT_SECRET;
              const code = data.code;

              if (!clientId || !clientSecret || !code) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Identifiants Strava manquants (client_id, client_secret ou code)' }));
                return;
              }

              const stravaRes = await fetch('https://www.strava.com/api/v3/oauth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  client_id: clientId,
                  client_secret: clientSecret,
                  code,
                  grant_type: 'authorization_code'
                })
              });

              const tokenData = await stravaRes.json();
              res.statusCode = stravaRes.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(tokenData));
            } catch {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Erreur lors de l’échange du token Strava' }));
            }
          });
          return;
        }

        // 3. Proxy activities endpoint (/api/strava/activities)
        if (url.pathname === '/api/strava/activities' && req.method === 'GET') {
          try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
              res.statusCode = 401;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Token Strava non fourni' }));
              return;
            }

            const stravaRes = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=15', {
              headers: { Authorization: authHeader }
            });
            const activities = await stravaRes.json();
            res.statusCode = stravaRes.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(activities));
          } catch {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Erreur lors de la récupération des activités Strava' }));
          }
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      stravaOAuthPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: '/',
          name: 'Glow Up Lab',
          short_name: 'GlowUpLab',
          description: 'Application personnelle et esthétique de musculation et suivi de progression.',
          theme_color: '#fff1f2',
          background_color: '#fff8f9',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.', '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
