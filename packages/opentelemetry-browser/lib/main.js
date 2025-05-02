import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';


// TODO: this should work as if it was an SDK for web. but for now we're going to
// lock some configs to make sure we're not bundling packages that won't be used

// TODO: should configure for at least the 3 signals (logs, metrics & traces)

const provider = new WebTracerProvider();

provider.register({
    // Changing default contextManager to use ZoneContextManager - supports asynchronous operations - optional
    contextManager: new ZoneContextManager(),
});

// Registering instrumentations
registerInstrumentations({
    instrumentations: [new DocumentLoadInstrumentation()],
});