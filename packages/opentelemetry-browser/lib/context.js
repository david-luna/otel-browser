import { ZoneContextManager } from '@opentelemetry/context-zone';

/**
 * @returns {import('@opentelemetry/api').ContextManager}
 */
export function getContextManager() {
    return new ZoneContextManager();
}