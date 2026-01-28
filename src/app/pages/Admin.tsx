import { useState } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { toast } from 'sonner';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('Admin component rendering, isLoggedIn:', isLoggedIn);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple mock authentication
    if (username === '1234' && password === '1234') {
      setIsLoggedIn(true);
      toast.success('Welcome back');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e03bd825/posts`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, content }),
        }
      );

      if (response.ok) {
        toast.success('Post published successfully');
        setTitle('');
        setContent('');
      } else {
        const errorText = await response.text();
        console.error('Failed to publish post:', errorText);
        toast.error('Failed to publish post');
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="w-full max-w-[320px]">
          <form onSubmit={handleLogin} className="space-y-6">
            <h1 className="text-[24px] font-semibold text-black text-center mb-8">
              Admin
            </h1>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[#f5f5f7] rounded-lg text-[15px] text-black placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                autoComplete="username"
              />
              
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#f5f5f7] rounded-lg text-[15px] text-black placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg text-[15px] font-medium hover:bg-black/90 transition-colors"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[700px] mx-auto px-6 py-24">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-[32px] font-semibold text-black tracking-tight">
            New Post
          </h1>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="text-[13px] text-[#86868b] hover:text-black transition-colors"
          >
            Sign out
          </button>
        </div>

        <form onSubmit={handlePublish} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-0 py-3 bg-transparent border-b border-[#d2d2d7] text-[24px] font-semibold text-black placeholder:text-[#86868b]/40 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <textarea
              placeholder="Write your story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-0 py-3 bg-transparent border-b border-[#d2d2d7] text-[15px] text-black placeholder:text-[#86868b]/40 focus:outline-none focus:border-black transition-colors resize-none leading-relaxed"
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-8 py-3 rounded-lg text-[15px] font-medium hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}