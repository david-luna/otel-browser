import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import {
    AlwaysOffSampler,
    AlwaysOnSampler,
    TraceIdRatioBasedSampler,
} from '@opentelemetry/sdk-trace-base';

/**
 * @param {import('./sdk').BrowserSdkConfiguration} cfg
 * @returns {import('@opentelemetry/sdk-trace-base').SpanProcessor[]}
 */
export function getSpanProcessors(cfg) {
    const tracesEndpoint = cfg.otlpTracesEndpoint ?? cfg.otlpEndpoint ?? 'http://localhost:4318/v1/traces';
    const spanProcessors = [
        new BatchSpanProcessor(new OTLPTraceExporter({
            headers: cfg.exportHeaders || {},
            url: tracesEndpoint,
        })),
    ];
    // TODO: add option for console span exporter?
    return spanProcessors;
}

/**
 * @typedef {'always_on' | 'always_off' | 'traceidratio'} SamplerType
 * NOTE: add parent based samplers
 */
/**
 * @typedef {Object} SamplerConfig
 * @property {string} type
 * @property {any} arg
 */
/**
 * 
 * @param {SamplerConfig | undefined} cfg
 * @returns {import('@opentelemetry/sdk-trace-base').Sampler}
 */
export function getSampler(cfg) {
    if (cfg) {
        switch (cfg.type) {
            case 'always_on':
                return new AlwaysOnSampler();
            case 'always_off':
                return new AlwaysOffSampler();
            case 'traceidratio':
                return new TraceIdRatioBasedSampler(getSampleRate(cfg.arg));
            default:
                // TODO: log here something
        }
    }
    // TODO: discuss what should be the default
    return new AlwaysOnSampler();
}

const DEFAULT_SAMPLE_RATE = 1;
/**
 * @param {any} num 
 * @returns {number}
 */
function getSampleRate(num) {
    if (
        // must be a whole positive integer
        typeof num === 'number' &&
        Number.isSafeInteger(num) &&
        num >= 0
    ) {
        return num;
    }

    return DEFAULT_SAMPLE_RATE;
};