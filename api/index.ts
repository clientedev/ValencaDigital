import express from 'express';
import session from 'express-session';
import MemoryStore from 'memorystore';
import type { Express } from "express";
import { storage } from "../server/storage";
import { insertBlogPostSchema, insertBlogLikeSchema, insertContactMessageSchema, insertChatMessageSchema } from "../shared/schema";
import { z } from "zod";

// Extend session data interface
declare module 'express-session' {
  interface SessionData {
    sessionId?: string;
    isAdmin?: boolean;
  }
}

const app = express();
const MemStore = MemoryStore(session);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  store: new MemStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  secret: process.env.SESSION_SECRET || 'valencia-soares-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// CORS headers for API routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Blog routes
app.get("/api/blog", async (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const posts = await storage.getBlogPosts(category);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
});

app.get("/api/blog/:id", async (req, res) => {
  try {
    const post = await storage.getBlogPost(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog post" });
  }
});

app.post("/api/blog", async (req, res) => {
  try {
    const validatedData = insertBlogPostSchema.parse(req.body);
    const post = await storage.createBlogPost(validatedData);
    res.status(201).json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid blog post data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create blog post" });
  }
});

app.put("/api/blog/:id", async (req, res) => {
  try {
    const validatedData = insertBlogPostSchema.partial().parse(req.body);
    const post = await storage.updateBlogPost(req.params.id, validatedData);
    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid blog post data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to update blog post" });
  }
});

app.delete("/api/blog/:id", async (req, res) => {
  try {
    const deleted = await storage.deleteBlogPost(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete blog post" });
  }
});

// Like routes
app.post("/api/blog/:id/like", async (req, res) => {
  try {
    const postId = req.params.id;
    
    // Generate session ID if not exists
    if (!req.session.sessionId) {
      req.session.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    const sessionId = req.session.sessionId;
    
    // Check if already liked
    const existingLike = await storage.getBlogLike(postId, sessionId);
    if (existingLike) {
      return res.status(409).json({ error: "Post already liked by this session" });
    }
    
    const like = await storage.createBlogLike({ postId, sessionId });
    const likeCount = await storage.getBlogLikeCount(postId);
    
    res.status(201).json({ like, likeCount });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid like data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to like post" });
  }
});

app.delete("/api/blog/:id/like", async (req, res) => {
  try {
    const postId = req.params.id;
    const sessionId = req.session.sessionId;
    
    if (!sessionId) {
      return res.status(400).json({ error: "Session not found" });
    }
    
    const deleted = await storage.deleteBlogLike(postId, sessionId);
    if (!deleted) {
      return res.status(404).json({ error: "Like not found" });
    }
    
    const likeCount = await storage.getBlogLikeCount(postId);
    res.json({ message: "Like removed", likeCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove like" });
  }
});

app.get("/api/blog/:id/like-count", async (req, res) => {
  try {
    const likeCount = await storage.getBlogLikeCount(req.params.id);
    res.json({ likeCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch like count" });
  }
});

// Contact routes
app.post("/api/contact", async (req, res) => {
  try {
    const validatedData = insertContactMessageSchema.parse(req.body);
    const message = await storage.createContactMessage(validatedData);
    res.status(201).json(message);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid contact message data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to send contact message" });
  }
});

app.get("/api/contact", async (req, res) => {
  try {
    const messages = await storage.getContactMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contact messages" });
  }
});

app.patch("/api/contact/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    
    const message = await storage.updateContactMessageStatus(req.params.id, status);
    if (!message) {
      return res.status(404).json({ error: "Contact message not found" });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to update contact message status" });
  }
});

// Chat routes  
app.post("/api/chat", async (req, res) => {
  try {
    const validatedData = insertChatMessageSchema.parse(req.body);
    const message = await storage.createChatMessage(validatedData);
    res.status(201).json(message);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid chat message data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to send chat message" });
  }
});

app.get("/api/chat", async (req, res) => {
  try {
    const sessionId = req.query.sessionId as string | undefined;
    const messages = await storage.getChatMessages(sessionId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat messages" });
  }
});

// Auth routes
app.post("/api/admin/login", async (req, res) => {
  try {
    const { password } = req.body;
    
    // Simple password check - in production, use proper authentication
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (password !== adminPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }
    
    req.session.isAdmin = true;
    res.json({ message: "Login successful", isAdmin: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to authenticate" });
  }
});

app.post("/api/admin/logout", async (req, res) => {
  try {
    req.session.isAdmin = false;
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Failed to logout" });
  }
});

app.get("/api/admin/status", async (req, res) => {
  res.json({ isAdmin: req.session.isAdmin || false });
});

// For Vercel serverless functions
export default app;