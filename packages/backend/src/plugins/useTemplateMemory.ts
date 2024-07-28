import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { updateTemplateUsage } from '../otel/updateTemplateUsage';

export function useTemplateMemory() {
  return createTemplateAction<{
    myParameter: string;
  }>({
    id: 'use:Memory',
    description: 'use:Memory',
    schema: {},
    async handler(ctx) {
      await updateTemplateUsage(ctx.templateInfo?.entity?.metadata.name);
    },
  });
}
