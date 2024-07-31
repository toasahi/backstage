import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { updateTemplateUsage } from '../otel/updateTemplateUsage';

const otelPlugin = createBackendPlugin({
  pluginId: 'otel',
  register(env) {
    env.registerInit({
      deps: {
        scheduler: coreServices.scheduler,
        config: coreServices.rootConfig
      },
      async init({ scheduler,config }) {
        await scheduler.scheduleTask({
          frequency: { seconds: 5 },
          timeout: { seconds: 30 },
          id: 'otel',
          fn: async () => {
            await updateTemplateUsage(config);
          },
        });
      },
    });
  },
});

export { otelPlugin as default };
