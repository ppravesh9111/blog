import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const posts = getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, excerpt, content, published } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create the MDX content with frontmatter
    const mdxContent = `---
title: "${title}"
excerpt: "${excerpt || ''}"
date: "${new Date().toISOString().split('T')[0]}"
published: ${published}
---

${content}`;

    // Write the file
    const postsDir = path.join(process.cwd(), 'src/posts');
    const filePath = path.join(postsDir, `${slug}.mdx`);
    
    // Ensure posts directory exists
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    fs.writeFileSync(filePath, mdxContent);

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
