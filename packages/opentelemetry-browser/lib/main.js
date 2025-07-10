import { diag } from '@opentelemetry/api';
import { parseKeyPairsIntoRecord, diagLogLevelFromString } from '@opentelemetry/core';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { LongTaskInstrumentation } from '@opentelemetry/instrumentation-long-task';
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction'
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { resourceFromAttributes, defaultResource } from '@opentelemetry/resources';

/**
 * @typedef {Object} WebSdkConfig
 * @property {boolean} [sdkDisabled]
 * @property {string} [logLevel]         // enum?
 * @property {string} [resourceAttributes]
 * @property {string} [serviceName]
 * // sampler
 * @property {string} [tracesSampler]    // enum?
 * @property {string} [tracesSamplerArg] // type depends on tracesSample value
 * // batch span processor
 * @property {number} [bspScheduleDelay]
 * @property {number} [bspexportTimeout]
 * @property {number} [bspMaxQueueSize]
 * @property {number} [bspMaxExportBatchSize]
 * // exporters
 * @property {string} [exporterOtlpHeaders]
 * @property {string} [exporterOtlpEndpoint]
 * @property {string} [exporterOtlpTracesEndpoint]
 */

// /**
//  * @param {WebSdkConfig} cfg 
//  */
function startSdk(cfg = {}) {
    /** @type {WebSdkConfig} */
    const defaultConfig = {
        // TODO: check what goes here
        logLevel: 'info',
        exporterOtlpEndpoint: 'http://localhost:4318',
    };

    const config = Object.assign(defaultConfig, cfg);

    /** @type {import('@opentelemetry/api').DiagLogger} */
    const logger = {
        error: console.error.bind(console),
        warn: console.warn.bind(console),
        info: console.info.bind(console),
        debug: console.debug.bind(console),
        verbose: console.debug.bind(console),
    }
    diag.setLogger(logger, { logLevel: diagLogLevelFromString(config.logLevel) });
    diag.info(`SDK intialization`, config);

    // TODO
    // The web EDOT should have all the necessary components to instrument the app
    // and get rid as much as it can from other optional things.    
    // - should configure for at least the 3 signals (logs, metrics & traces)
    // - should have some locked configs to help tree shaking the code. (eg. the exporter protocol)

    const contextManager = new ZoneContextManager();

    // TODO: any other resource detection? contrib seems to have only for node
    // https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/detectors
    const resourcePairs = parseKeyPairsIntoRecord(config.resourceAttributes);
    if (config.serviceName) {
        resourcePairs['service.name'] = config.serviceName;
    }

    const resource = defaultResource()
        .merge(resourceFromAttributes(resourcePairs))
        .merge(resourceFromAttributes({
            'telemetry.distro.name': 'elastic',
            // TODO: update this at build time
            'telemetry.distro.version': '0.1.0',
        }));

    // Traces section
    if (config.exporterOtlpEndpoint && !config.exporterOtlpTracesEndpoint) {
        config.exporterOtlpTracesEndpoint = `${config.exporterOtlpEndpoint}/v1/traces`;
    }

    // TODO: resolve exporter necessary config like endpoint
    const tracerProvider = new WebTracerProvider({
        resource,
        spanProcessors: [
            // new SimpleSpanProcessor(new ConsoleSpanExporter()),
            new BatchSpanProcessor(new OTLPTraceExporter({
                headers: parseKeyPairsIntoRecord(config.exporterOtlpHeaders),
                url: config.exporterOtlpTracesEndpoint,
            })),
        ],
    });

    tracerProvider.register({ contextManager });

    // TODO: logs section

    // TODO: metrics section

    // Registering instrumentations
    registerInstrumentations({
        instrumentations: [
            new DocumentLoadInstrumentation(),
            new FetchInstrumentation(),
            new LongTaskInstrumentation(),
            new UserInteractionInstrumentation(),
            new XMLHttpRequestInstrumentation(),
        ],
    });
}

// Set into global scope for user to acces it
globalThis.startSdk = startSdk;
