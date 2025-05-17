import getNewFeedItems from './feed';
import {
  addFeedItemToNotion,
  deleteOldUnreadFeedItemsFromNotion,
} from './notion';
import htmlToNotionBlocks from './parser';
import dotenv from 'dotenv';

dotenv.config();

const KEYWORDS = process.env.KEYWORDS
  ? process.env.KEYWORDS.split(',').map((k) => k.trim()).filter(Boolean)
  : [];

async function index() {
  const feedItems = await getNewFeedItems();

  for (let i = 0; i < feedItems.length; i++) {
    const item = feedItems[i];
    const combinedText = `${item.title ?? ''} ${item.content ?? ''}`.toLowerCase();
    const isStarred = KEYWORDS.some((kw) => combinedText.includes(kw.toLowerCase()));
    const notionItem = {
      title: item.title,
      link: item.link,
      content: htmlToNotionBlocks(item.content),
      starred: isStarred,
    };
    await addFeedItemToNotion(notionItem);
  }

  await deleteOldUnreadFeedItemsFromNotion();
}

index();
