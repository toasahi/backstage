import React from 'react';
import {
  StatusError,
  StatusOK,
  StatusWarning,
  Table,
  InfoCard,
} from '@backstage/core-components';
import useAsync from 'react-use/esm/useAsync';

const data = [
  {
    status: <StatusOK>OK</StatusOK>,
    label: 'OK',
    usage: 'Deployment successful',
  },
  {
    status: <StatusWarning>Warning</StatusWarning>,
    usage: 'CPU utilization at 90%',
  },
  {
    status: <StatusError>Error</StatusError>,
    usage: 'Service could not be created',
  },
];

const columns = [
  { field: 'status', title: 'Status' },
  { field: 'usage', title: 'Example usage' },
];

const containerStyle = { width: 600 };

export default function RDSStop() {
  useAsync(async () => {
    const response = await fetch('http://localhost:7007/api/aws/hello/test');
    console.log(response);
  }, []);
  return (
    <div style={containerStyle}>
      <InfoCard title="Available status types" noPadding>
        <Table
          options={{
            search: false,
            paging: false,
            toolbar: false,
          }}
          data={data}
          columns={columns}
        />
      </InfoCard>
    </div>
  );
}
