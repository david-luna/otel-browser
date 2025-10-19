import { ZoneContextManager } from '@opentelemetry/context-zone';

/**
 * TODO: check if something can be done with one fo these
 * - https://github.com/tc39/proposal-async-context
 * - https://github.com/signalfx/splunk-otel-js-web/blob/main/packages/web/src/splunk-context-manager.ts
 * @returns {import('@opentelemetry/api').ContextManager}
 */
export function getContextManager() {
    return new ZoneContextManager();
}