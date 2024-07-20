import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { metrics } from '@opentelemetry/api';

// MeterProvider は Meter を生成するためのエントリーポイント
const meterProvider = new MeterProvider({
  // resource は必須
  // ここではサービス名を指定している
  resource: new Resource({
    // OpenTelemetry では SemanticConventions として予め語彙が定義されている。
    // https://opentelemetry.io/docs/concepts/semantic-conventions/
    [SEMRESATTRS_SERVICE_NAME]: 'basic-metric-service',
  }),
  readers: [
    new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter(),
      exportIntervalMillis: 1000,
    }),
  ],
});

// // MeterProvider から Meter を生成する
const meter = meterProvider.getMeter('custom-exporter-collector');

const templateCount = meter.createCounter('template', {
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

for (let i = 0; i < 10; i++) {
  templateCount.add(i, {
    environment: 'production',
  });
}
