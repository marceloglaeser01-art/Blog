import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface Post {
  title: string;
  content: string;
  created_at: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e03bd825/posts`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error('Failed to fetch posts:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[700px] mx-auto px-6 py-24">
        {/* Header */}
        <header className="mb-24 flex justify-between items-center">
          <h1 className="text-[32px] font-semibold text-black tracking-tight">
            Journal
          </h1>
          <Link 
            to="/admin" 
            className="text-[13px] text-[#86868b] hover:text-black transition-colors"
          >
            Admin
          </Link>
        </header>

        {/* Posts Feed */}
        <div className="space-y-20">
          {isLoading ? (
            <div className="text-[#86868b] text-[15px]">Loading...</div>
          ) : posts.length === 0 ? (
            <div className="text-[#86868b] text-[15px]">No posts yet.</div>
          ) : (
            posts.map((post, index) => (
              <article key={index} className="space-y-4">
                <h2 className="text-[24px] font-semibold text-black tracking-tight leading-tight">
                  {post.title}
                </h2>
                <time className="block text-[13px] text-[#86868b] font-normal">
                  {formatDate(post.created_at)}
                </time>
                <p className="text-[15px] text-[#1d1d1f] leading-relaxed font-normal">
                  {post.content.length > 300
                    ? `${post.content.substring(0, 300)}...`
                    : post.content}
                </p>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}