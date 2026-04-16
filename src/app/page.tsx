'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useAuth } from '@/components/AuthProvider';

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  published: boolean;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { loggedIn, checkingAuth } = useAuth();

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const all: Post[] = await res.json();
        setPosts(loggedIn ? all : all.filter(p => p.published));
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (checkingAuth) return;
    fetchPosts();
  }, [loggedIn, checkingAuth]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.slug !== slug));
      } else {
        alert('Failed to delete post.');
      }
    } catch {
      alert('Failed to delete post.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to My Blog
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A place where I share my thoughts, experiences, and insights on technology,
          personal growth, and life in general.
        </p>
        {loggedIn && (
          <Link
            href="/admin/new"
            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Write New Post
          </Link>
        )}
      </div>

      {loading || checkingAuth ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Latest Posts</h2>
          <div className="grid gap-8">
            {posts.map((post) => (
              <article key={post.slug} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <time className="text-sm text-gray-500">
                    {format(new Date(post.date), 'MMMM dd, yyyy')}
                  </time>
                  {!post.published && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Draft
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                  <Link href={`/posts/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                {post.excerpt && (
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-4">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Read more
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  {loggedIn && (
                    <>
                      <Link
                        href={`/admin/edit/${post.slug}`}
                        className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.slug, post.title)}
                        className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
