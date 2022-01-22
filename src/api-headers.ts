import * as env from "./env";
import { Headers } from "node-fetch";

const username = env.FEEDBIN_USERNAME;
const password = env.FEEDBIN_PASSWORD;

const token = Buffer.from(`${username}:${password}`).toString("base64");
const headers = new Headers();
headers.append("Authorization", `Basic ${token}`);
headers.append("Content-Type", "application/json");

export default headers;
