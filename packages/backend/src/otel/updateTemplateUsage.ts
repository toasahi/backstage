import { DatabaseTaskStore } from '@backstage/plugin-scaffolder-backend';
import { templateUsageCount } from './instrumentation';
import { DatabaseManager } from '@backstage/backend-common';
import { RootConfigService } from '@backstage/backend-plugin-api';

export const updateTemplateUsage = async (
  config: RootConfigService,
  template = '',
) => {
  const manager = DatabaseManager.fromConfig(config).forPlugin('scaffolder');
  const databaseTaskStore = await DatabaseTaskStore.create({
    database: manager,
  });
  const { tasks } = await databaseTaskStore.list({});
  console.log(tasks);

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
