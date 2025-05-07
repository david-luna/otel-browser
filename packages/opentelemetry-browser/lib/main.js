import { resourceFromAttributes, defaultResource } from '@opentelemetry/resources';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { SimpleSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';


// TODO
// The web EDOT should have all the necessary components to instrument the app
// and get rid as much as it can from other optional things. 
// - should configure for at least the 3 signals (logs, metrics & traces)
// - should have some locked configs to help tree shaking the code. (eg. the exporter protocol)

const contextManager = new ZoneContextManager();

// TODO: any other resource detection? contrib seems to have only for node
// https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/detectors
const defaultRes = defaultResource();
const distroRes = resourceFromAttributes({
    'telemetry.distro.name': 'elastic',
    // TODO: update this at build time
    'telemetry.distro.version': '0.1.0',
});

// Traces section

// TODO: resolve exporter necessary config like endpoint
const tracerProvider = new WebTracerProvider({
    resource: defaultRes.merge(distroRes),
    spanProcessors: [
        new SimpleSpanProcessor(new ConsoleSpanExporter()),
    ],
});

tracerProvider.register({contextManager});

// TODO: logs section

// TODO: metrics section

// Registering instrumentations
registerInstrumentations({
    instrumentations: [new DocumentLoadInstrumentation()],
});