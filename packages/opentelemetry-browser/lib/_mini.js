import { diag, DiagConsoleLogger } from '@opentelemetry/api';
import { diagLogLevelFromString } from '@opentelemetry/core';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

diag.setLogger(new DiagConsoleLogger(), { logLevel: diagLogLevelFromString('info') });
diag.info(`SDK intialization`);