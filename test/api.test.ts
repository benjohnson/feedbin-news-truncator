import nock from "nock";
import {
  FEEDBIN_API_URL,
  fetchTaggings,
  fetchEntriesFromFeed,
  markEntriesAsRead,
} from "../src/api";

describe("API Endpoints", () => {
  test("fetchTaggings()", async () => {
    const expected = [{ id: 123, feed_id: 456, name: "foobar" }];
    nock(FEEDBIN_API_URL)
      .get("/v2/taggings.json")
      .reply(200, JSON.stringify(expected));
    const actual = await fetchTaggings();
    expect(actual).toEqual(expected);
  });

  test("fetchEntriesFromFeed() fetches entries", async () => {
    const expected = [
      { id: 123, title: "foobar", created_at: "2021-11-06T18:34:44.447255Z" },
    ];
    nock(FEEDBIN_API_URL)
      .get("/v2/feeds/1/entries.json?read=false")
      .reply(200, JSON.stringify(expected));
    const entries = await fetchEntriesFromFeed(1);
    expect(entries).toEqual([
      {
        id: 123,
        title: "foobar",
        createdAt: new Date("2021-11-06T18:34:44.447255Z"),
      },
    ]);
  });

  test("fetchEntriesFromFeed() ignores additional keys", async () => {
    const expected = [
      { id: 123, title: "foobar", created_at: "2021-11-06T18:34:44.447255Z", somekey: "true" },
    ];
    nock(FEEDBIN_API_URL)
      .get("/v2/feeds/1/entries.json?read=false")
      .reply(200, JSON.stringify(expected));
    const entries = await fetchEntriesFromFeed(1);
    expect(entries).toEqual([
      {
        id: 123,
        title: "foobar",
        createdAt: new Date("2021-11-06T18:34:44.447255Z"),
      },
    ]);
  });


  test("markEntriesAsRead() marks entries as read", async () => {
    const mock = nock(FEEDBIN_API_URL)
      .delete(
        "/v2/unread_entries.json",
        JSON.stringify({ unread_entries: [1, 2, 3] })
      )
      .reply(201);
    await markEntriesAsRead([1, 2, 3]);
    expect(mock.isDone()).toEqual(true);
  });
});
