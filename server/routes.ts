import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogPostSchema, insertBlogLikeSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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
      const sessionId = req.body.sessionId || req.session?.id || "anonymous";

      const existingLike = await storage.getBlogLike(postId, sessionId);
      if (existingLike) {
        return res.status(400).json({ error: "Already liked this post" });
      }

      const like = await storage.createBlogLike({ postId, sessionId });
      const likeCount = await storage.getBlogLikeCount(postId);
      res.json({ like, likeCount });
    } catch (error) {
      res.status(500).json({ error: "Failed to like post" });
    }
  });

  app.delete("/api/blog/:id/like", async (req, res) => {
    try {
      const postId = req.params.id;
      const sessionId = req.body.sessionId || req.session?.id || "anonymous";

      const deleted = await storage.deleteBlogLike(postId, sessionId);
      if (!deleted) {
        return res.status(404).json({ error: "Like not found" });
      }

      const likeCount = await storage.getBlogLikeCount(postId);
      res.json({ likeCount });
    } catch (error) {
      res.status(500).json({ error: "Failed to unlike post" });
    }
  });

  app.get("/api/blog/:id/like-status", async (req, res) => {
    try {
      const postId = req.params.id;
      const sessionId = req.query.sessionId as string || "anonymous";

      const like = await storage.getBlogLike(postId, sessionId);
      const likeCount = await storage.getBlogLikeCount(postId);
      
      res.json({ 
        liked: !!like,
        likeCount 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get like status" });
    }
  });

  // Admin authentication
  app.post("/api/admin/auth", (req, res) => {
    const { password } = req.body;
    if (password === "v") {
      res.json({ success: true, message: "Authentication successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid password" });
    }
  });

  // Contact form
  app.post("/api/contact", (req, res) => {
    try {
      const { name, email, phone, area, message } = req.body;
      
      // In a real application, this would send an email or save to database
      console.log("Contact form submission:", { name, email, phone, area, message });
      
      res.json({ success: true, message: "Mensagem enviada com sucesso! Entraremos em contato em breve." });
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
