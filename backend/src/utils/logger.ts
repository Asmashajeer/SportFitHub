import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define level based on environment
// const getLogLevel = () => {
//   const env = process.env.NODE_ENV || "development";
//   return env === "development" ? "debug" : "warn";
// };

// Define colors for each level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// Add colors to winston
winston.addColors(colors);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, stack, ...meta } = info;

    let log = `${timestamp} [${level}]: ${message}`;

    // Add stack trace for errors
    if (stack) {
      log += `\n${stack}`;
    }

    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }

    return log;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json() // Key-value pairs stay as JSON on one line
);

// Define which transports to use
const transports = [
  // Console transport
  new winston.transports.Console({    
     format: consoleFormat  
  }),

  // Daily rotate file for errors
  new DailyRotateFile({
    filename: path.join("logs", "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "error",
    format: fileFormat,
  }),

  // Daily rotate file for all logs
  new DailyRotateFile({
    filename: path.join("logs", "combined-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: fileFormat,
  }),

  // HTTP specific logs
  new DailyRotateFile({
    filename: path.join("logs", "http-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "http",
    format:fileFormat,
  }),
];

// Create the logger instance
const Logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels, 
  transports,
  exceptionHandlers: [
    new winston.transports.Console({ format: consoleFormat }),
    new DailyRotateFile({ filename: path.join("logs", "exceptions-%DATE%.log"),datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: fileFormat, })
  ],
  rejectionHandlers: [
    new winston.transports.Console({ format: consoleFormat }),
    new DailyRotateFile({ filename: path.join("logs", "rejections-%DATE%.log"),datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: fileFormat, })
  ],
  // Do not exit on handled exceptions
  // exitOnError: false,
});


// Create the stream for Morgan
export const stream = {
  write: (message: string) => Logger.http(message.trim()),
};
export default Logger;