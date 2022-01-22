var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import nock from "nock";
import { Response } from "node-fetch";
import { fetcher, makeApiParser } from "../src/api-helpers";
describe("fetcher()", () => {
    test("returns an error when it gets a 400 range status code", () => __awaiter(void 0, void 0, void 0, function* () {
        nock("http://test.com").get("/").reply(404);
        yield expect(fetcher("http://test.com")).rejects.toThrow("Recieved 404 from http://test.com");
    }));
    test("returns an error when it gets a 500 range status code", () => __awaiter(void 0, void 0, void 0, function* () {
        nock("http://test.com").get("/").reply(500);
        yield expect(fetcher("http://test.com")).rejects.toThrow("Recieved 500 from http://test.com");
    }));
    test("returns a response object when a request is successful", () => __awaiter(void 0, void 0, void 0, function* () {
        nock("http://test.com").get("/").reply(200);
        const res = yield fetcher("http://test.com");
        expect(res).toBeInstanceOf(Response);
        expect(res.url).toEqual("http://test.com/");
    }));
});
describe("makeApiParser()", () => {
    test("can parse a Response into a valid defined type", () => __awaiter(void 0, void 0, void 0, function* () {
        const parser = makeApiParser({
            elements: {
                properties: {
                    id: { type: "int32" },
                },
            },
        });
        nock("http://test.com")
            .get("/")
            .reply(200, JSON.stringify([{ id: 123 }]));
        const res = yield fetcher("http://test.com");
        const parsed = yield parser(res);
        expect(parsed).toEqual([{ id: 123 }]);
    }));
    test("throws an error when parsing an invalid response from an API", () => __awaiter(void 0, void 0, void 0, function* () {
        const parser = makeApiParser({
            elements: {
                properties: {
                    id: { type: "int32" },
                },
            },
        });
        nock("http://test.com")
            .get("/")
            .reply(200, JSON.stringify([{ id: "foobar" }]));
        const res = yield fetcher("http://test.com");
        yield expect(parser(res)).rejects.toThrow("Error parsing from http://test.com/");
    }));
});
