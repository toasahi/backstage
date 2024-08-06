import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { Router } from 'express';
import {
  RDSClient,
  StartDBClusterCommand,
  StopDBClusterCommand,
} from '@aws-sdk/client-rds';

const httpRouter = createBackendPlugin({
  pluginId: 'aws',
  register(env) {
    env.registerInit({
      deps: { http: coreServices.httpRouter,config: coreServices.rootConfig },
      async init({ http,config }) {
        const router = Router();
        const client = new RDSClient(config);
        router.get('/hello/:dbName', async(req, res) => {
          const param = req.params
          console.log(param)
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/rds/command/StartDBClusterCommand/
          const input = {
            // StartDBClusterMessage
            DBClusterIdentifier: 'STRING_VALUE', // required
          };
          const command = new StartDBClusterCommand(input);
          const response = await client.send(command);
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

export { httpRouter as default };
