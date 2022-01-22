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
import { FEEDBIN_API_URL, fetchTaggings, fetchEntriesFromFeed, markEntriesAsRead, } from "../src/api";
describe("API Endpoints", () => {
    test("fetchTaggings()", () => __awaiter(void 0, void 0, void 0, function* () {
        const expected = [{ id: 123, feed_id: 456, name: "foobar" }];
        nock(FEEDBIN_API_URL)
            .get("/v2/taggings.json")
            .reply(200, JSON.stringify(expected));
        const actual = yield fetchTaggings();
        expect(actual).toEqual(expected);
    }));
    test("fetchEntriesFromFeed() fetches entries", () => __awaiter(void 0, void 0, void 0, function* () {
        const expected = [
            { id: 123, title: "foobar", created_at: "2021-11-06T18:34:44.447255Z" },
        ];
        nock(FEEDBIN_API_URL)
            .get("/v2/feeds/1/entries.json?read=false")
            .reply(200, JSON.stringify(expected));
        const entries = yield fetchEntriesFromFeed(1);
        expect(entries).toEqual([
            {
                id: 123,
                title: "foobar",
                createdAt: new Date("2021-11-06T18:34:44.447255Z"),
            },
        ]);
    }));
    test("markEntriesAsRead() marks entries as read", () => __awaiter(void 0, void 0, void 0, function* () {
        const mock = nock(FEEDBIN_API_URL)
            .delete("/v2/unread_entries.json", JSON.stringify({ unread_entries: [1, 2, 3] }))
            .reply(201);
        yield markEntriesAsRead([1, 2, 3]);
        expect(mock.isDone()).toEqual(true);
    }));
});
