import fs from 'fs';
import path from 'path';

export interface Tweet {
  id: string;
  content: string;
  date: string;
}

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'your-username';
const REPO_NAME = process.env.GITHUB_REPO_NAME || 'blog';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const TWEETS_FILE_PATH = 'data/tweets.json';
const LOCAL_TWEETS_FILE = path.join(process.cwd(), 'data/tweets.json');

function shouldFallbackToLocal(): boolean {
  return process.env.NODE_ENV !== 'production' && fs.existsSync(LOCAL_TWEETS_FILE);
}

async function makeRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${GITHUB_API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub API error: ${response.status} - ${error}`);
  }

  return response.json();
}

async function getGitHubFile(): Promise<{ content: Tweet[]; sha: string }> {
  const file = await makeRequest(
    `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${TWEETS_FILE_PATH}`
  );
  const decoded = Buffer.from(file.content, 'base64').toString('utf-8');
  return { content: JSON.parse(decoded), sha: file.sha };
}

async function saveGitHubFile(tweets: Tweet[], sha: string, message: string): Promise<void> {
  const encoded = Buffer.from(JSON.stringify(tweets, null, 2)).toString('base64');
  await makeRequest(
    `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${TWEETS_FILE_PATH}`,
    {
      method: 'PUT',
      body: JSON.stringify({ message, content: encoded, sha }),
    }
  );
}

// Local helpers
function readLocalTweets(): Tweet[] {
  try {
    if (!fs.existsSync(LOCAL_TWEETS_FILE)) return [];
    return JSON.parse(fs.readFileSync(LOCAL_TWEETS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeLocalTweets(tweets: Tweet[]): void {
  const dir = path.dirname(LOCAL_TWEETS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(LOCAL_TWEETS_FILE, JSON.stringify(tweets, null, 2));
}

export async function getAllTweets(): Promise<Tweet[]> {
  let tweets: Tweet[];

  if (shouldFallbackToLocal()) {
    tweets = readLocalTweets();
  } else {
    try {
      const { content } = await getGitHubFile();
      tweets = content;
    } catch {
      if (process.env.NODE_ENV !== 'production') {
        tweets = readLocalTweets();
      } else {
        return [];
      }
    }
  }

  return tweets.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function createTweet(content: string): Promise<Tweet> {
  const tweet: Tweet = {
    id: Date.now().toString(),
    content,
    date: new Date().toISOString(),
  };

  if (shouldFallbackToLocal()) {
    const tweets = readLocalTweets();
    tweets.push(tweet);
    writeLocalTweets(tweets);
    return tweet;
  }

  try {
    const { content: tweets, sha } = await getGitHubFile();
    tweets.push(tweet);
    await saveGitHubFile(tweets, sha, `Add tweet: ${content.slice(0, 50)}`);
  } catch {
    if (process.env.NODE_ENV !== 'production') {
      const tweets = readLocalTweets();
      tweets.push(tweet);
      writeLocalTweets(tweets);
    } else {
      throw new Error('Failed to save tweet');
    }
  }

  return tweet;
}

export async function deleteTweet(id: string): Promise<boolean> {
  if (shouldFallbackToLocal()) {
    const tweets = readLocalTweets();
    const filtered = tweets.filter(t => t.id !== id);
    if (filtered.length === tweets.length) return false;
    writeLocalTweets(filtered);
    return true;
  }

  try {
    const { content: tweets, sha } = await getGitHubFile();
    const filtered = tweets.filter(t => t.id !== id);
    if (filtered.length === tweets.length) return false;
    await saveGitHubFile(filtered, sha, `Delete tweet ${id}`);
    return true;
  } catch {
    if (process.env.NODE_ENV !== 'production') {
      const tweets = readLocalTweets();
      const filtered = tweets.filter(t => t.id !== id);
      if (filtered.length === tweets.length) return false;
      writeLocalTweets(filtered);
      return true;
    }
    throw new Error('Failed to delete tweet');
  }
}
