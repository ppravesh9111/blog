import Link from 'next/link';
import { format } from 'date-fns';
import { Post } from '@/lib/posts';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="mb-4">
        <time className="text-sm text-gray-500">
          {format(new Date(post.date), 'MMMM dd, yyyy')}
        </time>
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
      
      <Link 
        href={`/posts/${post.slug}`}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        Read more
        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </article>
  );
}
