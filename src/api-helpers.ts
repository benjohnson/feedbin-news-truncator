import Ajv, { JTDSchemaType } from "ajv/dist/jtd";
import fetch, { RequestInfo, RequestInit, Response } from "node-fetch";
import { logger } from './logger';
import headers from "./api-headers";

// Handles out of bounds status codes on a fetch call.
export const fetcher = async (url: RequestInfo, init: RequestInit = {}) => {
  init.headers = headers;
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`Recieved ${res.status} from ${res.url}`);
  }
  return res;
};

// Given a Type and a JTDSchema, creates a function that parses/validates a
// fetch Response. Throws if API results are invalid.
export function makeApiParser<T>(
  schema: JTDSchemaType<T[]>
): (fetchRes: Response) => Promise<T[]> {
  const ajv = new Ajv();
  const parser = ajv.compileParser(schema);
  return async (fetchRes: Response) => {
    const text = await fetchRes.text();
    const parsed = parser(text);
    if (!parsed) {
      logger.error(`Error parsing: ${parser.message} at ${parser.position}`);
      throw new Error(`Error parsing from ${fetchRes.url}`);
    }
    return parsed;
  };
}
