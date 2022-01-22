jest.mock("../src/api");
import { sub } from "date-fns";
import * as api from "../src/api";
import { main } from "../src/main";

const mockedApi = api as jest.Mocked<typeof api>;

test("marks entries older than two days as read", async () => {
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

  await main();

  expect(mockedApi.markEntriesAsRead.mock.calls[0][0]).toEqual([111]);
});
