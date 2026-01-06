import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for structured logging
const structuredFormat = winston.format.printf(({ timestamp, level, message, ...metadata }) => {
  let meta = '';
  if (Object.keys(metadata).length > 0) {
    // Filter out Symbol keys and format metadata
    const cleanMeta = {};
    for (const [key, value] of Object.entries(metadata)) {
      if (typeof key === 'string' && !key.startsWith('Symbol')) {
        cleanMeta[key] = value;
      }
    }
    if (Object.keys(cleanMeta).length > 0) {
      meta = ` ${JSON.stringify(cleanMeta)}`;
    }
  }
  return `${timestamp} [${level.toUpperCase()}]: ${message}${meta}`;
});

// JSON format for production (easier to parse)
const jsonFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Pretty format for development
const prettyFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  structuredFormat
);

// Determine log level from environment
const getLogLevel = () => {
  if (process.env.LOG_LEVEL) return process.env.LOG_LEVEL;
  if (process.env.NODE_ENV === 'production') return 'info';
  if (process.env.NODE_ENV === 'test') return 'error';
  return 'debug';
};

// Create base logger
const logger = winston.createLogger({
  level: getLogLevel(),
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.errors({ stack: true })
  ),
  defaultMeta: { service: 'moovie-api' },
  transports: [
    // Console transport with pretty formatting
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? jsonFormat : prettyFormat
    })
  ],
  // Don't exit on handled exceptions
  exitOnError: false
});

// Add file transports in production
if (process.env.NODE_ENV === 'production' || process.env.LOG_TO_FILE === 'true') {
  // Error log - only errors and above
  logger.add(
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: jsonFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
      tailable: true
    })
  );

  // Combined log - all levels
  logger.add(
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: jsonFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
      tailable: true
    })
  );

  // Access log - HTTP requests only
  logger.add(
    new winston.transports.File({
      filename: path.join(logsDir, 'access.log'),
      level: 'http',
      format: jsonFormat,
      maxsize: 20 * 1024 * 1024, // 20MB
      maxFiles: 5,
      tailable: true
    })
  );

  // Security log - security related events
  logger.add(
    new winston.transports.File({
      filename: path.join(logsDir, 'security.log'),
      level: 'warn',
      format: jsonFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
      tailable: true
    })
  );
}

// Request ID tracking for distributed tracing
let requestIdCounter = 0;
const generateRequestId = () => {
  requestIdCounter = (requestIdCounter + 1) % 1000000;
  return `${Date.now()}-${requestIdCounter.toString().padStart(6, '0')}`;
};

// Create child logger with request context
const createRequestLogger = (req) => {
  const requestId = req.headers['x-request-id'] || generateRequestId();
  req.requestId = requestId;

  return logger.child({
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip || req.connection?.remoteAddress,
    userAgent: req.get('user-agent')?.substring(0, 100),
    userId: req.user?.id
  });
};

// Specialized logging functions
const loggers = {
  // HTTP request logging
  http: (req, res, duration) => {
    const logData = {
      type: 'http',
      method: req.method,
      path: req.path,
      query: Object.keys(req.query).length > 0 ? req.query : undefined,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('content-length'),
      requestId: req.requestId,
      userId: req.user?.id,
      ip: req.ip
    };

    if (res.statusCode >= 500) {
      logger.error('HTTP Request Error', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('HTTP Request Warning', logData);
    } else {
      logger.http('HTTP Request', logData);
    }
  },

  // Security event logging
  security: (event, data = {}) => {
    logger.warn(`Security Event: ${event}`, {
      type: 'security',
      event,
      ...data,
      timestamp: new Date().toISOString()
    });
  },

  // Database operation logging
  database: (operation, data = {}) => {
    logger.debug(`Database: ${operation}`, {
      type: 'database',
      operation,
      ...data
    });
  },

  // Cache operation logging
  cache: (operation, data = {}) => {
    logger.debug(`Cache: ${operation}`, {
      type: 'cache',
      operation,
      ...data
    });
  },

  // Authentication logging
  auth: (event, data = {}) => {
    const level = ['login_failed', 'token_invalid', 'unauthorized'].includes(event) ? 'warn' : 'info';
    logger[level](`Auth: ${event}`, {
      type: 'auth',
      event,
      ...data
    });
  },

  // Admin action logging
  admin: (action, data = {}) => {
    logger.info(`Admin Action: ${action}`, {
      type: 'admin',
      action,
      ...data
    });
  },

  // Performance logging
  performance: (metric, value, data = {}) => {
    logger.info(`Performance: ${metric}`, {
      type: 'performance',
      metric,
      value,
      ...data
    });
  },

  // Video/transcoding logging
  video: (event, data = {}) => {
    logger.info(`Video: ${event}`, {
      type: 'video',
      event,
      ...data
    });
  },

  // Payment/subscription logging
  payment: (event, data = {}) => {
    logger.info(`Payment: ${event}`, {
      type: 'payment',
      event,
      ...data
    });
  },

  // Application lifecycle logging
  lifecycle: (event, data = {}) => {
    logger.info(`Lifecycle: ${event}`, {
      type: 'lifecycle',
      event,
      ...data
    });
  },

  // Error with stack trace
  errorWithStack: (message, error, data = {}) => {
    logger.error(message, {
      type: 'error',
      errorMessage: error.message,
      stack: error.stack,
      ...data
    });
  }
};

// Middleware for request logging
const requestLoggerMiddleware = (req, res, next) => {
  const startTime = Date.now();
  req.logger = createRequestLogger(req);

  // Log request start in debug mode
  if (process.env.NODE_ENV !== 'production') {
    req.logger.debug('Request started');
  }

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    loggers.http(req, res, duration);
  });

  next();
};

// Stream for Morgan integration
const morganStream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

// Export everything
export {
  logger,
  loggers,
  createRequestLogger,
  requestLoggerMiddleware,
  morganStream,
  generateRequestId
};

export default logger;
