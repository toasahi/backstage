import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { DatabaseManager } from '@backstage/backend-common';
import { DatabaseTaskStore } from '@backstage/plugin-scaffolder-backend';
import { ConfigReader, Config } from '@backstage/config';
import { loadBackendConfig } from '@backstage/backend-common';

export function useTemplateMetrics() {
  return createTemplateAction({
    id: 'use:Metrics',
    description: 'use:Metrics',
    async handler(ctx) {
      // MEMO: https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend/src/scaffolder/tasks/DatabaseTaskStore.test.ts
      const manager = DatabaseManager.fromConfig(
        new ConfigReader({
          backend: {
            database: {
              client: 'pg',
              connection: {
                host: process.env.POSTGRES_HOST,
                port: process.env.POSTGRES_PORT,
                user: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
              },
            },
          },
        }),
      ).forPlugin('scaffolder');
      //   const manager = DatabaseManager.fromConfig(
      //     new ConfigReader({
      //       backend: {
      //         database: {
      //           client: 'better-sqlite3',
      //           connection: ':memory:',
      //         },
      //       },
      //     }),
      //   ).forPlugin('scaffolder');
      const databaseTaskStore = await DatabaseTaskStore.create({
        database: manager,
      });
      const tasks = await databaseTaskStore.list({});
      ctx.logger.info(tasks);
    },
  });
}
