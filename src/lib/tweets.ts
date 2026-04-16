import { redis } from './kv';

export interface Tweet {
  id: string;
  content: string;
  date: string;
}

const TWEETS_KEY = 'tweets';

export async function getAllTweets(): Promise<Tweet[]> {
  const tweets = await redis.get<Tweet[]>(TWEETS_KEY);
  if (!tweets) return [];
  return tweets.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function createTweet(content: string): Promise<Tweet> {
  const tweet: Tweet = {
    id: Date.now().toString(),
    content,
    date: new Date().toISOString(),
  };

  const tweets = await redis.get<Tweet[]>(TWEETS_KEY) || [];
  tweets.push(tweet);
  await redis.set(TWEETS_KEY, tweets);
  return tweet;
}

export async function deleteTweet(id: string): Promise<boolean> {
  const tweets = await redis.get<Tweet[]>(TWEETS_KEY) || [];
  const filtered = tweets.filter(t => t.id !== id);
  if (filtered.length === tweets.length) return false;
  await redis.set(TWEETS_KEY, filtered);
  return true;
}
