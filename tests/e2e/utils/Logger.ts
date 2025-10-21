import * as winston from 'winston';
import * as path from 'path';

/**
 * Logger utility for test automation
 * Uses Winston for structured logging
 */
export class Logger {
  private logger: winston.Logger;

  constructor() {
    const logLevel = process.env.LOG_LEVEL || 'info';
    const logDir = 'logs';

    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: 'orangehrm-automation' },
      transports: [
        // Console transport
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
            })
          ),
        }),
        // File transport for all logs
        new winston.transports.File({
          filename: path.join(logDir, 'test-execution.log'),
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        // File transport for errors only
        new winston.transports.File({
          filename: path.join(logDir, 'errors.log'),
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      ],
    });
  }

  /**
   * Log info message
   */
  public info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  /**
   * Log debug message
   */
  public debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  /**
   * Log warning message
   */
  public warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  /**
   * Log error message
   */
  public error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }

  /**
   * Log step execution
   */
  public step(stepName: string, status: 'started' | 'passed' | 'failed', meta?: any): void {
    const emoji = status === 'started' ? '▶️' : status === 'passed' ? '✅' : '❌';
    this.logger.info(`${emoji} Step ${status}: ${stepName}`, meta);
  }

  /**
   * Log scenario execution
   */
  public scenario(scenarioName: string, status: 'started' | 'passed' | 'failed', meta?: any): void {
    const emoji = status === 'started' ? '🎬' : status === 'passed' ? '✅' : '❌';
    this.logger.info(`${emoji} Scenario ${status}: ${scenarioName}`, meta);
  }

  /**
   * Log feature execution
   */
  public feature(featureName: string, status: 'started' | 'passed' | 'failed', meta?: any): void {
    const emoji = status === 'started' ? '📋' : status === 'passed' ? '✅' : '❌';
    this.logger.info(`${emoji} Feature ${status}: ${featureName}`, meta);
  }
}
