import nock from "nock";
import { Response } from "node-fetch";
import { fetcher, makeApiParser } from "../src/api-helpers";

describe("fetcher()", () => {
  test("returns an error when it gets a 400 range status code", async () => {
    nock("http://test.com").get("/").reply(404);

    await expect(fetcher("http://test.com")).rejects.toThrow(
      "Recieved 404 from http://test.com"
    );
  });

  test("returns an error when it gets a 500 range status code", async () => {
    nock("http://test.com").get("/").reply(500);

    await expect(fetcher("http://test.com")).rejects.toThrow(
      "Recieved 500 from http://test.com"
    );
  });

  test("returns a response object when a request is successful", async () => {
    nock("http://test.com").get("/").reply(200);

    const res = await fetcher("http://test.com");
    expect(res).toBeInstanceOf(Response);
    expect(res.url).toEqual("http://test.com/");
  });
});

describe("makeApiParser()", () => {
  test("can parse a Response into a valid defined type", async () => {
    type ExampleType = { id: number };

    const parser = makeApiParser<ExampleType>({
      elements: {
        properties: {
          id: { type: "int32" },
        },
      },
    });

    nock("http://test.com")
      .get("/")
      .reply(200, JSON.stringify([{ id: 123 }]));

    const res = await fetcher("http://test.com");
    const parsed = await parser(res);

    expect(parsed).toEqual([{ id: 123 }]);
  });

  test("throws an error when parsing an invalid response from an API", async () => {
    type ExampleType = { id: number };

    const parser = makeApiParser<ExampleType>({
      elements: {
        properties: {
          id: { type: "int32" },
        },
      },
    });

    nock("http://test.com")
      .get("/")
      .reply(200, JSON.stringify([{ id: "foobar" }]));

    const res = await fetcher("http://test.com");

    await expect(parser(res)).rejects.toThrow(
      "Error parsing from http://test.com/"
    );
  });
});
