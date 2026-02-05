/**
 * Logger utility
 * For production, consider upgrading to winston:
 * npm install winston
 */

const isDevelopment = process.env.NODE_ENV !== 'production';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const colors = {
  error: '\x1b[31m', // Red
  warn: '\x1b[33m',  // Yellow
  info: '\x1b[36m',  // Cyan
  debug: '\x1b[90m', // Gray
  reset: '\x1b[0m',
};

function formatMessage(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const color = colors[level] || '';
  const reset = colors.reset;

  let formatted = `${color}[${timestamp}] [${level.toUpperCase()}]${reset} ${message}`;

  if (Object.keys(meta).length > 0) {
    formatted += `\n${JSON.stringify(meta, null, 2)}`;
  }

  return formatted;
}

const logger = {
  error: (message, meta) => {
    console.error(formatMessage('error', message, meta));
  },

  warn: (message, meta) => {
    console.warn(formatMessage('warn', message, meta));
  },

  info: (message, meta) => {
    if (isDevelopment || process.env.LOG_LEVEL === 'info') {
      console.info(formatMessage('info', message, meta));
    }
  },

  debug: (message, meta) => {
    if (isDevelopment && process.env.LOG_LEVEL === 'debug') {
      console.debug(formatMessage('debug', message, meta));
    }
  },
};

// Production upgrade instructions
if (isDevelopment) {
  logger.info('Logger initialized in development mode');
  logger.info('For production, consider installing winston for file logging and log rotation');
}

module.exports = logger;
