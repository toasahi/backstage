import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Card, CardContent, Chip, Typography, Link } from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder';
import useAsync from 'react-use/esm/useAsync';
import { EmptyState, ErrorPanel, Progress } from '@backstage/core-components';

export function SimpleCard() {
  const { entity } = useEntity();
  const scaffolderApi = useApi(scaffolderApiRef);
  // const scaffolderApi = createApiExtension({
  //   factory: createApiFactory({
  //     api: scaffolderApiRef,
  //     deps: {
  //       discoveryApi: discoveryApiRef,
  //       scmIntegrationsApi: scmIntegrationsApiRef,
  //       fetchApi: fetchApiRef,
  //       identityApi: identityApiRef,
  //     },
  //     factory: ({ discoveryApi, scmIntegrationsApi, fetchApi, identityApi }) =>
  //       new ScaffolderClient({
  //         discoveryApi,
  //         scmIntegrationsApi,
  //         fetchApi,
  //         identityApi,
  //       }),
  //   }),
  // });
  const { value, loading, error } = useAsync(() => {
    if (scaffolderApi.listTasks) {
      return scaffolderApi.listTasks?.({ filterByOwnership: 'all' });
    }

    // eslint-disable-next-line no-console
    console.warn(
      'listTasks is not implemented in the scaffolderApi, please make sure to implement this method.',
    );

    return Promise.resolve({ tasks: [] });
  }, [scaffolderApi]);

  const name = entity.metadata.name;
  const description = entity.metadata.description || 'No description provided';

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return (
      <>
        <ErrorPanel error={error} />
        <EmptyState
          missing="info"
          title="No information to display"
          description="There are no tasks or there was an issue communicating with backend."
        />
      </>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Simple Card</Typography>
        <Typography color="textSecondary" gutterBottom>
          {name} - {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
