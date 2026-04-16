import { NextRequest, NextResponse } from 'next/server';
import { getAllTweets, createTweet } from '@/lib/tweets';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    const tweets = await getAllTweets();
    return NextResponse.json(tweets);
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return NextResponse.json({ error: 'Failed to fetch tweets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const tweet = await createTweet(content.trim());
    return NextResponse.json(tweet);
  } catch (error) {
    console.error('Error creating tweet:', error);
    return NextResponse.json({ error: 'Failed to create tweet' }, { status: 500 });
  }
}
