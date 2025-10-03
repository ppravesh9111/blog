import { Post } from './posts';
import fs from 'fs';
import path from 'path';

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'your-username';
const REPO_NAME = process.env.GITHUB_REPO_NAME || 'blog';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const POSTS_PATH = 'data/posts';

// Local fallback for development
const LOCAL_POSTS_DIR = path.join(process.cwd(), 'data/posts');

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content?: string;
  encoding?: string;
}

// interface GitHubCreateFileResponse {
//   content: {
//     name: string;
//     path: string;
//     sha: string;
//   };
//   commit: {
//     sha: string;
//     message: string;
//   };
// }

class GitHubStorage {
  private useLocalFallback(): boolean {
    // Use local files if:
    // 1. We're in development mode, AND
    // 2. Local posts directory exists, AND
    // 3. Either GitHub token is missing OR GitHub API fails
    return process.env.NODE_ENV !== 'production' && fs.existsSync(LOCAL_POSTS_DIR);
  }

  private async getAllPostsLocal(): Promise<Post[]> {
    try {
      if (!fs.existsSync(LOCAL_POSTS_DIR)) {
        return [];
      }

      const files = fs.readdirSync(LOCAL_POSTS_DIR);
      const posts: Post[] = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const filePath = path.join(LOCAL_POSTS_DIR, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const post = JSON.parse(content) as Post;
            posts.push(post);
          } catch (error) {
            console.error(`Error reading local post ${file}:`, error);
          }
        }
      }

      return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error reading local posts:', error);
      return [];
    }
  }

  private async getPostBySlugLocal(slug: string): Promise<Post | null> {
    try {
      const filePath = path.join(LOCAL_POSTS_DIR, `${slug}.json`);
      if (!fs.existsSync(filePath)) {
        return null;
      }
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as Post;
    } catch (error) {
      console.error(`Error reading local post ${slug}:`, error);
      return null;
    }
  }

  private async createPostLocal(post: Post): Promise<void> {
    try {
      // Ensure directory exists
      if (!fs.existsSync(LOCAL_POSTS_DIR)) {
        fs.mkdirSync(LOCAL_POSTS_DIR, { recursive: true });
      }
      
      const filePath = path.join(LOCAL_POSTS_DIR, `${post.slug}.json`);
      fs.writeFileSync(filePath, JSON.stringify(post, null, 2));
      console.log(`✅ Post saved locally: ${post.slug}`);
    } catch (error) {
      console.error(`Error saving local post ${post.slug}:`, error);
      throw error;
    }
  }

  private async updatePostLocal(post: Post): Promise<void> {
    return this.createPostLocal(post); // Same operation for local files
  }

  private async deletePostLocal(slug: string): Promise<void> {
    try {
      const filePath = path.join(LOCAL_POSTS_DIR, `${slug}.json`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`✅ Post deleted locally: ${slug}`);
      }
    } catch (error) {
      console.error(`Error deleting local post ${slug}:`, error);
      throw error;
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${GITHUB_API_BASE}${endpoint}`;
    const headers = {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async getAllPosts(): Promise<Post[]> {
    // Try local fallback first in development
    if (this.useLocalFallback()) {
      console.log('📁 Using local posts for development');
      return this.getAllPostsLocal();
    }

    try {
      // Get all files in the posts directory
      const files: GitHubFile[] = await this.makeRequest(
        `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${POSTS_PATH}`
      );

      const posts: Post[] = [];

      // Fetch content for each JSON file
      for (const file of files) {
        if (file.name.endsWith('.json')) {
          try {
            const content = await this.getFileContent(file.path);
            const post = JSON.parse(content) as Post;
            posts.push(post);
          } catch (error) {
            console.error(`Error parsing post ${file.name}:`, error);
          }
        }
      }

      // Sort by date (newest first)
      return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error fetching posts from GitHub:', error);
      
      // Fallback to local files if GitHub fails
      if (process.env.NODE_ENV !== 'production' && fs.existsSync(LOCAL_POSTS_DIR)) {
        console.log('📁 Falling back to local posts due to GitHub error');
        return this.getAllPostsLocal();
      }
      
      return [];
    }
  }

  async getPostBySlug(slug: string): Promise<Post | null> {
    // Try local fallback first in development
    if (this.useLocalFallback()) {
      return this.getPostBySlugLocal(slug);
    }

    try {
      const content = await this.getFileContent(`${POSTS_PATH}/${slug}.json`);
      return JSON.parse(content) as Post;
    } catch (error) {
      console.error(`Error fetching post ${slug}:`, error);
      
      // Fallback to local files if GitHub fails
      if (process.env.NODE_ENV !== 'production' && fs.existsSync(LOCAL_POSTS_DIR)) {
        return this.getPostBySlugLocal(slug);
      }
      
      return null;
    }
  }

  async createPost(post: Post): Promise<void> {
    // Use local storage in development
    if (this.useLocalFallback()) {
      return this.createPostLocal(post);
    }

    const filePath = `${POSTS_PATH}/${post.slug}.json`;
    const content = JSON.stringify(post, null, 2);
    const encodedContent = Buffer.from(content).toString('base64');

    try {
      await this.makeRequest(
        `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            message: `Add new post: ${post.title}`,
            content: encodedContent,
          }),
        }
      );
    } catch (error) {
      // Fallback to local storage if GitHub fails
      if (process.env.NODE_ENV !== 'production') {
        console.log('📁 Falling back to local storage due to GitHub error');
        return this.createPostLocal(post);
      }
      throw error;
    }
  }

  async updatePost(post: Post): Promise<void> {
    // Use local storage in development
    if (this.useLocalFallback()) {
      return this.updatePostLocal(post);
    }

    const filePath = `${POSTS_PATH}/${post.slug}.json`;
    
    try {
      // Get current file to get its SHA
      const currentFile: GitHubFile = await this.makeRequest(
        `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`
      );

      const content = JSON.stringify(post, null, 2);
      const encodedContent = Buffer.from(content).toString('base64');

      await this.makeRequest(
        `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            message: `Update post: ${post.title}`,
            content: encodedContent,
            sha: currentFile.sha,
          }),
        }
      );
    } catch (error) {
      console.error(`Error updating post ${post.slug}:`, error);
      
      // Fallback to local storage if GitHub fails
      if (process.env.NODE_ENV !== 'production') {
        console.log('📁 Falling back to local storage due to GitHub error');
        return this.updatePostLocal(post);
      }
      
      throw error;
    }
  }

  async deletePost(slug: string): Promise<void> {
    // Use local storage in development
    if (this.useLocalFallback()) {
      return this.deletePostLocal(slug);
    }

    const filePath = `${POSTS_PATH}/${slug}.json`;
    
    try {
      // Get current file to get its SHA
      const currentFile: GitHubFile = await this.makeRequest(
        `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`
      );

      await this.makeRequest(
        `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
        {
          method: 'DELETE',
          body: JSON.stringify({
            message: `Delete post: ${slug}`,
            sha: currentFile.sha,
          }),
        }
      );
    } catch (error) {
      console.error(`Error deleting post ${slug}:`, error);
      
      // Fallback to local storage if GitHub fails
      if (process.env.NODE_ENV !== 'production') {
        console.log('📁 Falling back to local storage due to GitHub error');
        return this.deletePostLocal(slug);
      }
      
      throw error;
    }
  }

  private async getFileContent(path: string): Promise<string> {
    const file: GitHubFile = await this.makeRequest(
      `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`
    );

    if (file.content && file.encoding === 'base64') {
      return Buffer.from(file.content, 'base64').toString('utf-8');
    }

    throw new Error(`Unable to get content for ${path}`);
  }

  async ensurePostsDirectory(): Promise<void> {
    try {
      // Try to get the posts directory
      await this.makeRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${POSTS_PATH}`);
    } catch {
      // Directory doesn't exist, create it with a README
      const readmeContent = Buffer.from('# Posts\n\nThis directory contains blog posts stored as JSON files.\n').toString('base64');
      
      await this.makeRequest(
        `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${POSTS_PATH}/README.md`,
        {
          method: 'PUT',
          body: JSON.stringify({
            message: 'Create posts directory',
            content: readmeContent,
          }),
        }
      );
    }
  }
}

export const githubStorage = new GitHubStorage();
