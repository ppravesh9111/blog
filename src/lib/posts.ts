import { githubStorage } from './github-storage';

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  published: boolean;
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const posts = await githubStorage.getAllPosts();
    return posts.filter(post => post.published);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getAllPostsIncludingDrafts(): Promise<Post[]> {
  try {
    return await githubStorage.getAllPosts();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    return await githubStorage.getPostBySlug(slug);
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const posts = await githubStorage.getAllPosts();
    return posts.map(post => post.slug);
  } catch (error) {
    console.error('Error fetching post slugs:', error);
    return [];
  }
}

export async function createPost(postData: Omit<Post, 'slug' | 'date'>): Promise<string> {
  // Create slug from title
  const slug = postData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const post: Post = {
    ...postData,
    slug,
    date: new Date().toISOString().split('T')[0],
  };

  await githubStorage.createPost(post);
  return slug;
}

export async function updatePost(post: Post): Promise<void> {
  await githubStorage.updatePost(post);
}

export async function deletePost(slug: string): Promise<void> {
  await githubStorage.deletePost(slug);
}
