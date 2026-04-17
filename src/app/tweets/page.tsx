'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/components/AuthProvider';

interface Tweet {
  id: string;
  content: string;
  date: string;
}

export default function TweetsPage() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [tweetContent, setTweetContent] = useState('');
  const [isTweeting, setIsTweeting] = useState(false);
  const { loggedIn } = useAuth();

  const fetchTweets = async () => {
    try {
      const response = await fetch('/api/tweets');
      if (response.ok) {
        setTweets(await response.json());
      }
    } catch {}
  };

  useEffect(() => {
    fetchTweets().finally(() => setLoading(false));
  }, []);

  const handleTweet = async () => {
    if (!tweetContent.trim()) return;
    setIsTweeting(true);
    try {
      const response = await fetch('/api/tweets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: tweetContent }),
      });
      if (response.ok) {
        setTweetContent('');
        await fetchTweets();
      }
    } catch {} finally {
      setIsTweeting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tweet?')) return;
    try {
      const response = await fetch(`/api/tweets/${id}`, { method: 'DELETE' });
      if (response.ok) await fetchTweets();
    } catch {}
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Tweets</h1>
        <p className="text-gray-500 dark:text-gray-400">Quick thoughts, random musings, unfiltered.</p>
      </div>

      {/* Compose box — only visible when logged in */}
      {loggedIn && (
        <div className="mb-8 bg-white dark:bg-gray-900 rounded-lg shadow p-5">
          <textarea
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="What's on your mind?"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-gray-400">
              {tweetContent.length > 0 ? `${tweetContent.length} characters` : ''}
            </span>
            <button
              onClick={handleTweet}
              disabled={isTweeting || !tweetContent.trim()}
              className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              {isTweeting ? 'Posting...' : 'Tweet'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading...</p>
        </div>
      ) : tweets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No tweets yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-0">
          {tweets.map((tweet) => (
            <div key={tweet.id} className="border-b border-gray-200 dark:border-gray-800 py-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF9933] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  PS
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Purnendu Sharma</span>
                    <span className="text-gray-400 text-sm">
                      &middot; {formatDistanceToNow(new Date(tweet.date), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {tweet.content}
                  </p>
                  {loggedIn && (
                    <button
                      onClick={() => handleDelete(tweet.id)}
                      className="text-red-400 hover:text-red-600 dark:hover:text-red-300 text-xs mt-2 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
