import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
} from "@opentelemetry/semantic-conventions";

let sdk: NodeSDK | null = null;

export function initTelemetry(): void {
  const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;

  if (!otlpEndpoint) {
    return;
  }

  if (process.env.DISABLE_TELEMETRY === "true") {
    return;
  }

  const resource = resourceFromAttributes({
    [SEMRESATTRS_SERVICE_NAME]: "ai0fy",
    [SEMRESATTRS_SERVICE_VERSION]: process.env.APP_VERSION ?? "0.1.0",
    [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV ?? "development",
  });

  const traceExporter = new OTLPTraceExporter({
    url: `${otlpEndpoint}/v1/traces`,
  });

  sdk = new NodeSDK({
    resource,
    traceExporter,
    instrumentations: [
      getNodeAutoInstrumentations({
        "@opentelemetry/instrumentation-fs": { enabled: false },
        "@opentelemetry/instrumentation-net": { enabled: false },
        "@opentelemetry/instrumentation-dns": { enabled: false },
      }),
    ],
  });

  try {
    sdk.start();
    console.log("OpenTelemetry initialized");
  } catch (err) {
    console.error("Failed to initialize OpenTelemetry", err);
  }

  process.on("SIGTERM", () => {
    sdk
      ?.shutdown()
      .then(() => console.log("OpenTelemetry shut down"))
      .catch(console.error);
  });
}

export function shutdownTelemetry(): Promise<void> | undefined {
  return sdk?.shutdown();
}
