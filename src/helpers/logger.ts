import { ILogger } from 'discordx';

import { AxiosResponse } from "axios";
import { getReasonPhrase } from "http-status-codes";

import { createLogger, format, LogEntry, transports } from "winston";

const { printf, combine, colorize, timestamp, errors } = format;

const loggerFormat = printf((log) => {
  let msg = `${log.timestamp} ${log.level} ${log.message}`;

  if (log.stack) {
    msg += log.stack;
  }

  return msg;
});

export const logger = createLogger({
  level: "debug",
  format: combine(
    timestamp({ format: "DD-MM-YYYY hh:mm:ss A" }),
    format((logLevel: LogEntry) => {
      logLevel.level = logLevel.level.toUpperCase();

      return logLevel;
    })(),
    errors({ stack: true }),
    colorize(),
    loggerFormat,
  ),
  transports: [
    new transports.Console({ level: "debug" }),
    new transports.File({ filename: "logs/combined.log", level: "debug" }),
  ],
});

export const axiosLogInterceptor = (res: AxiosResponse<any>): AxiosResponse<any, any> => {
  const response = JSON.stringify(res.data);

  logger.verbose(
    `AXIOS > [${res.status}] [${getReasonPhrase(res.status)}] data:[${
      response.length > 2048 ? " hidden" : response
    }]`,
  );

  return res;
};

export class ExpressLogger {
	public static write = (message: string): void => {
		const msg = `EXPRESS > ${message.trim()}`;

		logger.http(msg);
	};
}

export class DiscordLogger implements ILogger {
	public error(...args: unknown[]): void {
		logger.error(args);
	}

	public info(...args: unknown[]): void {
		logger.info(args);
	}

	public log(...args: unknown[]): void {
		logger.debug(args);
	}

	public warn(...args: unknown[]): void {
		logger.warn(args);
	}

	public debug(...args: unknown[]): void {
		logger.debug(args);
	}

	public verbose(...args: unknown[]): void {
		logger.verbose(args);
	}

	public silly(...args: unknown[]): void {
		logger.silly(args);
	}

	public http(...args: unknown[]): void {
		logger.http(args);
	}
}
