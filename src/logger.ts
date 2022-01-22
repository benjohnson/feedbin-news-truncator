import winston from "winston";

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "test" ? "warning" : "info",
  transports: [new winston.transports.Console()],
});
