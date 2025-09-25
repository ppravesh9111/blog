'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/lib/posts';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const allPosts = await response.json();
          setPosts(allPosts);
        } else {
          console.error('Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    // Set user info (in a real app, you'd get this from the token)
    setUser({ username: 'admin' });
    fetchPosts();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeletePost = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the posts list
        const updatedResponse = await fetch('/api/posts');
        if (updatedResponse.ok) {
          const allPosts = await updatedResponse.json();
          setPosts(allPosts);
        }
      } else {
        console.error('Failed to delete post');
        alert('Error deleting post. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Admin</h1>
            <p className="text-gray-600 mt-2">
              Manage your blog posts and create new content.
            </p>
            {user && (
              <p className="text-sm text-gray-500 mt-1">
                Welcome back, {user.username}!
              </p>
            )}
          </div>
          
          <div className="flex gap-3">
            <Link
              href="/"
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
            >
              View Blog
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Link
            href="/admin/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Write New Post
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">All Posts</h2>
        </div>
        
        {posts.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500 mb-4">No posts yet.</p>
            <Link
              href="/admin/new"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {posts.map((post) => (
              <div key={post.slug} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(post.date).toLocaleDateString()}
                      {!post.published && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Draft
                        </span>
                      )}
                    </p>
                    {post.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 ml-4">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/edit/${post.slug}`}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeletePost(post.slug, post.title)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
