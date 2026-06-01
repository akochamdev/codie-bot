import winston, { Logger } from "winston";
import dotenv from "dotenv";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import "winston-daily-rotate-file";

dotenv.config();

const { combine, timestamp, json, errors } = winston.format;

const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: "app-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: '7d'
});

const logtail = new Logtail(process.env.LOGTAIL_TOKEN || "", {
    endpoint: `https://${process.env.LOGTAIL_INGESTING_HOST}`
});

const logger: Logger = winston.createLogger({
    level: "info",
    format: combine(
        timestamp(),
        errors({ stack: true }),
        json() 
    ),
    transports: [
        new winston.transports.Console({ handleExceptions: true }),
        fileRotateTransport,
        new LogtailTransport(logtail)
    ]
});

// Override console methods to pick up 3rd party logs
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.log = function(...args) {
    originalConsoleLog(...args);
    logger.info(args?.join(" "));
};

console.warn = function(...args) {
    originalConsoleWarn(...args);
    logger.warn(args?.join(" "));
};

console.error = function(...args) {
    originalConsoleError(...args);
    logger.error(args?.join(" "));
}

export const flushLogs = () => {
    logtail.flush();
};

export default logger;
