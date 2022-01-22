var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
jest.mock("../src/api");
import { sub } from "date-fns";
import * as api from "../src/api";
import { main } from "../src/main";
const mockedApi = api;
test("marks entries older than two days as read", () => __awaiter(void 0, void 0, void 0, function* () {
    const mockTaggings = [
        { id: 111, feed_id: 333, name: "_News" },
        { id: 222, feed_id: 444, name: "_Sports" },
    ];
    mockedApi.fetchTaggings.mockResolvedValue(mockTaggings);
    const now = new Date();
    const twoDaysAgo = sub(now, { days: 2 });
    const mockEntries = [
        {
            id: 111,
            title: "older than two days ago",
            createdAt: twoDaysAgo,
        },
        {
            id: 222,
            title: "newer than two days ago",
            createdAt: now,
        },
    ];
    mockedApi.fetchEntriesFromFeed.mockResolvedValue(mockEntries);
    yield main();
    expect(mockedApi.markEntriesAsRead.mock.calls[0][0]).toEqual([111]);
}));
