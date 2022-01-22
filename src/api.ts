import { fetcher, makeApiParser } from "./api-helpers";

export const FEEDBIN_API_URL = "https://api.feedbin.com"

type FeedTaggings = {
  id: number;
  feed_id: number;
  name: string;
};

const parseTaggings = makeApiParser<FeedTaggings>({
  elements: {
    properties: {
      id: { type: "int32" },
      feed_id: { type: "int32" },
      name: { type: "string" },
    },
  },
});

export const fetchTaggings = async (): Promise<FeedTaggings[]> => {
  const res = await fetcher("https://api.feedbin.com/v2/taggings.json");
  return parseTaggings(res);
};

type Entry = {
  id: number;
  title: string;
  createdAt: Date;
};

type EntryJSON = {
  id: number;
  title: string;
  created_at: string;
};

const parseEntry = makeApiParser<EntryJSON>({
  elements: {
    properties: {
      id: { type: "int32" },
      title: { type: "string" },
      created_at: { type: "string" },
    },
  },
});

export const fetchEntriesFromFeed = async (
  feedId: number
): Promise<Entry[]> => {
  const url = `https://api.feedbin.com/v2/feeds/${feedId}/entries.json?read=false`;
  const res = await fetcher(url);
  const body = await parseEntry(res);
  return body.map((x) => ({
    id: x.id,
    title: x.title,
    createdAt: new Date(x.created_at),
  }));
};

export const markEntriesAsRead = async (entryIds: number[]) => {
  return fetcher("https://api.feedbin.com/v2/unread_entries.json", {
    method: "DELETE",
    body: JSON.stringify({ unread_entries: entryIds }),
  });
};
