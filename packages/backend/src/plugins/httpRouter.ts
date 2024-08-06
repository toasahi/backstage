import {
    coreServices,
    createBackendPlugin,
  } from '@backstage/backend-plugin-api';
  import { Router } from 'express';
  
  createBackendPlugin({
    pluginId: 'aws',
    register(env) {
      env.registerInit({
        deps: { http: coreServices.httpRouter },
        async init({ http }) {
          const router = Router();
          router.get('/hello', (_req, res) => {
            res.status(200).json({ hello: 'world' });
          });
          // Registers the router at the /api/example path
          http.use(router);
          http.addAuthPolicy({
            path: '/hello',
            allow: 'unauthenticated',
          });
        },
      });
    },
  });