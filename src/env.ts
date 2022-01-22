import dotenv from "dotenv";
import env from "env-var";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : undefined,
});

export const FEEDBIN_USERNAME = env
  .get("FEEDBIN_USERNAME")
  .required()
  .asString();

export const FEEDBIN_PASSWORD = env
  .get("FEEDBIN_PASSWORD")
  .required()
  .asString();
