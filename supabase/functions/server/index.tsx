import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Enable CORS and logging
app.use('*', cors());
app.use('*', logger(console.log));

// Get all posts
app.get('/make-server-e03bd825/posts', async (c) => {
  try {
    const posts = await kv.getByPrefix('post:');
    
    // Sort posts by created_at in descending order (newest first)
    const sortedPosts = posts.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });

    return c.json(sortedPosts);
  } catch (error) {
    console.log('Error fetching posts:', error);
    return c.json({ error: 'Failed to fetch posts' }, 500);
  }
});

// Create a new post
app.post('/make-server-e03bd825/posts', async (c) => {
  try {
    const body = await c.req.json();
    const { title, content } = body;

    if (!title || !content) {
      return c.json({ error: 'Title and content are required' }, 400);
    }

    // Generate a unique key using timestamp
    const timestamp = Date.now();
    const key = `post:${timestamp}`;

    const post = {
      title,
      content,
      created_at: new Date().toISOString(),
    };

    await kv.set(key, post);

    return c.json({ success: true, post });
  } catch (error) {
    console.log('Error creating post:', error);
    return c.json({ error: 'Failed to create post' }, 500);
  }
});

Deno.serve(app.fetch);
