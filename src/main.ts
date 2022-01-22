import { isBefore, sub } from "date-fns";
import { logger } from "./logger";
import * as api from "./api";

export async function main() {
  logger.info("Getting taggings...");
  const taggings = await api.fetchTaggings();

  logger.info("Filtering _News feed ids...");
  const newsFeedIds = taggings
    .filter((tag) => tag.name === "_News")
    .map((tag) => tag.feed_id);

  logger.info("Getting entries from _News feeds...");
  let entries = await Promise.all(newsFeedIds.map(api.fetchEntriesFromFeed));

  const twoDaysAgo = sub(new Date(), { days: 2 });
  let entryIdsToMarkAsRead = entries
    .flat()
    .filter((entry) => {
      return isBefore(entry.createdAt, twoDaysAgo);
    })
    .map((entry) => entry.id);

  logger.info("Marking older entries as read...");
  await api.markEntriesAsRead(entryIdsToMarkAsRead);
}

if (require.main === module) {
  main();
}
