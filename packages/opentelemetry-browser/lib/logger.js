// Code adapted from 
// https://github.com/elastic/elastic-otel-node/blob/main/packages/opentelemetry-node/lib/luggite.js

const VERBOSE = 10;
const DEBUG = 20;
const INFO = 30;
const WARN = 40;
const ERROR = 50;

/** @type {Record<string, number>} */
var levelFromName = {
    verbose: VERBOSE,
    debug: DEBUG,
    info: INFO,
    warn: WARN,
    error: ERROR,
};

/**
 * 
 * @param {Object} cfg
 * @param {string} [cfg.logLevel]
 * @param {Record<string,any>} [cfg.fields]
 * @returns {import('@opentelemetry/api').DiagLogger}
 */
export function createLogger(cfg) {
    const logLevel = levelFromName[cfg.logLevel] || levelFromName['info'];

    return {
        // @ts-ignore
        _fields: cfg.fields || {},
        _level: logLevel,
        error: makeLogFunction(ERROR, console.error.bind(console)),
        warn: makeLogFunction(ERROR, console.warn.bind(console)),
        info: makeLogFunction(ERROR, console.info.bind(console)),
        debug: makeLogFunction(ERROR, console.debug.bind(console)),
        verbose: makeLogFunction(ERROR, console.trace.bind(console)),
    };
}

/**
 * Build a record object suitable for emitting from the arguments
 * provided to the a log emitter.
 *
 * @param {any} log
 * @param {number} minLevel
 * @param {Array<any>} args
 * @returns {object}
 */
function makeRecord(log, minLevel, args) {
    let excludeFields, fields, msgArgs;
    if (args[0] instanceof Error) {
        // `log.<level>(err, ...)`
        fields = {
            err: errSerializer(args[0]),
        };
        excludeFields = {err: true};
        if (args.length === 1) {
            msgArgs = [fields.err.message];
        } else {
            msgArgs = args.slice(1);
        }
    } else if (typeof args[0] !== 'object' || Array.isArray(args[0])) {
        // `log.<level>(msg, ...)`
        fields = null;
        msgArgs = args.slice();
    } else {
        // `log.<level>(fields, msg, ...)`
        fields = args[0];
        if (
            fields &&
            args.length === 1 &&
            fields.err &&
            fields.err instanceof Error
        ) {
            msgArgs = [fields.err.message];
        } else {
            msgArgs = args.slice(1);
        }
    }

    // Build up the record object.
    const record = Object.assign({}, log._fields, fields || {});
    record.level = minLevel;
    record.msg = formatter.apply(null, msgArgs);
    record.time = record.time || new Date();
    return record;
}

/**
 * Build a log emitter function for level minLevel. I.e. this is the
 * creator of `log.info`, `log.error`, etc.
 *
 * @param {number} minLevel
 * @param {(...args: any[]) => void} emitFn
 * @returns {function(Record<string, any> | string, ...any): void}
 */
function makeLogFunction(minLevel, emitFn) {
    return function LOG(...args) {
        var log = this;

        if (args.length === 0) {
            // `log.<level>()`
            return this._level >= minLevel;
        }

        if (this._level >= minLevel) {
            emitFn(makeRecord(log, minLevel, args));
        }
    };
}

/**
 * A serializer is a function that serializes a JavaScript object to a
 * JSON representation for logging. 
 *
 * Serialize an Error object
 * @param {Error | Object} err
 * @returns {Object}
 */
function errSerializer(err) {
    if (!err || !err.stack) return err;
    var obj = {
        message: err.message,
        name: err.name,
        stack: err.stack,
        code: err.code,
        signal: err.signal,
    };
    return obj;
}

/**
 * formatter function like https://nodejs.org/api/util.html#utilformatformat-args
 * but with some differences
 * @param {string} msg 
 * @param {...any} values
 */
function formatter(msg, ...values) {
    if (typeof msg !== 'string') {
        return [].slice.call(arguments).map(v => JSON.stringify(v)).join(' ');
    }
    let result = '';
    for (let i = 0; i < msg.length; i++) {
        if (msg[i] === '%' && /[sdijo]/.test(msg[i+1])) {
            const val = values.shift();
            switch(msg[i+1]) {
                case 's':
                    result += `${val}`;
                    break;
                case 'd':
                    result += `${Number(val)}`;
                    break;
                case 'i':
                    result += `${parseInt(val, 10)}`;
                    break;
                case 'f':
                    result += `${parseFloat(val)}`;
                    break;
                case 'j':
                case 'o':
                    result += `${JSON.stringify(val)}`;
                    break;
            }
            i = i + 1;
        } else {
            result += msg[i];
        }
    }
    if (values.length > 0) {
        result += ' ' + values.map(v => JSON.stringify(v)).join(' ');
    }
    return result;
}
