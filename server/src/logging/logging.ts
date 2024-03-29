import * as winston from 'winston';
import { Config } from '../config/config';
import { S3StreamLogger } from 's3-streamlogger';
import * as os from 'os';

const logPath = `${__dirname}/../logs/`;
export const MAIN_LOGGER_ID = 'main-logger';

export default class Logging {
    public static initialize(): void {
        const format = winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.prettyPrint(),
        );

        const appFileTransport = new winston.transports.File({
            filename: 'app.log',
            level: 'info',
            dirname: logPath,
            format: format,
        });
        const errorFileTransport = new winston.transports.File({
            filename: 'error.log',
            level: 'error',
            dirname: logPath,
            format: format,
        });

        const logger = winston.loggers.add(MAIN_LOGGER_ID, {
            level: 'info',
        });

        logger.add(appFileTransport);
        logger.add(errorFileTransport);

        if (Config.getLoggingConfig().s3LoggingEnabled) {
            const s3AppLogTransport = new winston.transports.Stream({
                stream: new S3StreamLogger({
                    bucket: Config.getLoggingConfig().s3Bucket,
                    folder: 'app-logs',
                    name_format: `%Y-%m-%d-%H-%M-%S-%L-${process.env.NODE_ENV}-${os.hostname()}.log`,
                }),
                format: format,
                level: 'info',
            });
            const s3ErrorLogTransport = new winston.transports.Stream({
                stream: new S3StreamLogger({
                    bucket: Config.getLoggingConfig().s3Bucket,
                    folder: 'error-logs',
                    name_format: `%Y-%m-%d-%H-%M-%S-%L-${process.env.NODE_ENV}-${os.hostname()}.log`,
                }),
                format: format,
                level: 'error',
            });
            s3AppLogTransport.on('error', function (err) {
                logger.error('S3 App logging transport error', err);
            });

            s3ErrorLogTransport.on('error', function (err) {
                logger.error('S3 Error logging transport error', err);
            });
            logger.add(s3AppLogTransport);
            logger.add(s3ErrorLogTransport);
        } else {
            const consoleTransport = new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.errors({ stack: true }),
                    winston.format.colorize(),
                    winston.format.timestamp({
                        format: 'YYYY-MM-DD HH:mm:ss',
                    }),
                    winston.format.printf(({ level, message, timestamp, stack, durationMs }) => {
                        let msg = `${timestamp} ${level}: ${message}`;

                        if (durationMs) {
                            msg += ` @ ${durationMs}ms`;
                        }

                        if (stack) {
                            msg += ` ||| ${JSON.stringify(stack)}`;
                        }

                        return msg;
                    }),
                ),
            });
            logger.add(consoleTransport);
        }
    }
}
