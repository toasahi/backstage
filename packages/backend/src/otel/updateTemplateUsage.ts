import { ConfigReader } from '@backstage/config';
import { DatabaseTaskStore } from '@backstage/plugin-scaffolder-backend';
import { templateUsageCount } from './instrumentation';
import { DatabaseManager } from '@backstage/backend-common';

export const updateTemplateUsage = async (template = '') => {

  const manager = DatabaseManager.fromConfig(
    new ConfigReader({
      backend: {
        database: {
          client: 'pg',
          connection: {
            host: 'localhost',
            port: 5432,
            user: 'postgres',
            password: 'postgres',
          },
        },
      },
    }),
  ).forPlugin('scaffolder');
  const databaseTaskStore = await DatabaseTaskStore.create({
    database: manager,
  });
  const { tasks } = await databaseTaskStore.list({});

  if (template !== '') {
    templateUsageCount.record(1, {
      template,
    });

    templateUsageCount.record(tasks.length, {
      template: 'all',
    });
  } else {
    templateUsageCount.record(tasks.length, {
      template: 'all',
    });
  }
};
