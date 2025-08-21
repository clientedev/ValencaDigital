import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from "../../server/storage";
import { insertBlogPostSchema } from "../../shared/schema";
import { z } from "zod";

function enableCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
}

async function parseBody(req: VercelRequest): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  enableCors(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const category = req.query.category as string | undefined;
      const posts = await storage.getBlogPosts(category);
      return res.json(posts);
    }
    
    if (req.method === 'POST') {
      const body = await parseBody(req);
      const validatedData = insertBlogPostSchema.parse(body);
      const post = await storage.createBlogPost(validatedData);
      return res.status(201).json(post);
    }
    
    return res.status(405).json({ error: "Method not allowed" });
    
  } catch (error) {
    console.error('Blog API Error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid data", details: error.errors });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}