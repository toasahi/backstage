import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { DatabaseManager } from '@backstage/backend-common';
import { DatabaseTaskStore } from '@backstage/plugin-scaffolder-backend';
import { ConfigReader } from '@backstage/config';

export function useTemplateMemory() {
  return createTemplateAction<{
    myParameter: string;
  }>({
    id: 'use:Memory',
    description: 'use:Memory',
    schema: {},
    async handler(ctx) {
      // MEMO: https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend/src/scaffolder/tasks/DatabaseTaskStore.test.ts
      // app-config.yamlの環境変数から設定を読み取れるのではないか？デフォルトのKnexの設定を見る
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
      const test = await databaseTaskStore.list({});
      console.log(test);
    },
  });
}
