import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { LongTaskInstrumentation } from '@opentelemetry/instrumentation-long-task';
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction'
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';

/**
 * @typedef {{
 *  "@opentelemetry/instrumentation-document-load": import('@opentelemetry/instrumentation-document-load').DocumentLoadInstrumentationConfig,
 *  "@opentelemetry/instrumentation-fetch": import('@opentelemetry/instrumentation-fetch').FetchInstrumentationConfig,
 *  "@opentelemetry/instrumentation-long-task": import('@opentelemetry/instrumentation-long-task').LongtaskInstrumentationConfig,
 *  "@opentelemetry/instrumentation-user-interaction": import('@opentelemetry/instrumentation-user-interaction').UserInteractionInstrumentationConfig,
 *  "@opentelemetry/instrumentation-xml-http-request": import('@opentelemetry/instrumentation-xml-http-request').XMLHttpRequestInstrumentationConfig,
 * }} InstrumentationConfigs
 */


// TODO: check how to pass config
/**
 * @param {Partial<InstrumentationConfigs>} cfg
 * @returns {import('@opentelemetry/instrumentation').Instrumentation[]}
 */
export function getInstrumentations(cfg) {
    return [
        new DocumentLoadInstrumentation(cfg['@opentelemetry/instrumentation-document-load']),
        new FetchInstrumentation(cfg['@opentelemetry/instrumentation-fetch']),
        new LongTaskInstrumentation(cfg['@opentelemetry/instrumentation-long-task']),
        new UserInteractionInstrumentation(cfg['@opentelemetry/instrumentation-user-interaction']),
        new XMLHttpRequestInstrumentation(cfg['@opentelemetry/instrumentation-xml-http-request']),
    ];
}