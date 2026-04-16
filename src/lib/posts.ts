import { redis } from './kv';

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  published: boolean;
}

const POSTS_KEY = 'posts';

export async function getAllPosts(): Promise<Post[]> {
  const posts = await redis.get<Post[]>(POSTS_KEY);
  if (!posts) return [];
  return posts
    .filter(post => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getAllPostsIncludingDrafts(): Promise<Post[]> {
  const posts = await redis.get<Post[]>(POSTS_KEY);
  if (!posts) return [];
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await redis.get<Post[]>(POSTS_KEY);
  if (!posts) return null;
  return posts.find(p => p.slug === slug) || null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await redis.get<Post[]>(POSTS_KEY);
  if (!posts) return [];
  return posts.map(post => post.slug);
}

export async function createPost(postData: Omit<Post, 'slug' | 'date'>): Promise<string> {
  const slug = postData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const post: Post = {
    ...postData,
    slug,
    date: new Date().toISOString().split('T')[0],
  };

  const posts = await redis.get<Post[]>(POSTS_KEY) || [];
  posts.push(post);
  await redis.set(POSTS_KEY, posts);
  return slug;
}

export async function updatePost(post: Post): Promise<void> {
  const posts = await redis.get<Post[]>(POSTS_KEY) || [];
  const index = posts.findIndex(p => p.slug === post.slug);
  if (index === -1) throw new Error(`Post not found: ${post.slug}`);
  posts[index] = post;
  await redis.set(POSTS_KEY, posts);
}

export async function deletePost(slug: string): Promise<void> {
  const posts = await redis.get<Post[]>(POSTS_KEY) || [];
  const filtered = posts.filter(p => p.slug !== slug);
  if (filtered.length === posts.length) throw new Error(`Post not found: ${slug}`);
  await redis.set(POSTS_KEY, filtered);
}
