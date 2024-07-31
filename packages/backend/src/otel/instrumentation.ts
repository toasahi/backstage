import { NodeSDK } from '@opentelemetry/sdk-node';
import { metrics } from '@opentelemetry/api';
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { Resource } from '@opentelemetry/resources';
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';

const meterProvider = new MeterProvider({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'backstage',
    [SEMRESATTRS_SERVICE_VERSION]: '1.0',
  }),
  readers: [
    new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter(),
      exportIntervalMillis: 1000,
    }),
  ],
});
metrics.setGlobalMeterProvider(meterProvider);

// MeterProvider から Meter を生成する
const meter = meterProvider.getMeter('backstage', '0.0.1');

export const templateUsageCount = meter.createGauge('template_usage', {
  description: 'Count the number of times Template is executed',
});

const sdk = new NodeSDK({
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(),
    exportIntervalMillis: 1000,
  }),
  instrumentations: [],
});

sdk.start();
