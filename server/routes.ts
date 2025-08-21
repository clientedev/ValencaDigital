import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogPostSchema, insertBlogLikeSchema, insertContactMessageSchema, insertChatMessageSchema } from "@shared/schema";
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
      const sessionId = req.body.sessionId || "anonymous";

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
      const sessionId = req.body.sessionId || "anonymous";

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

  // Contact Messages
  app.get("/api/contact", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact messages" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid contact data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to send contact message" });
    }
  });

  app.patch("/api/contact/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const updated = await storage.updateContactMessageStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ error: "Contact message not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update contact message status" });
    }
  });

  // Chat Messages  
  app.get("/api/chat", async (req, res) => {
    try {
      const sessionId = req.query.sessionId as string;
      const messages = await storage.getChatMessages(sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const validatedData = insertChatMessageSchema.parse(req.body);
      const message = await storage.createChatMessage(validatedData);

      // Generate bot response
      let botResponse = "";
      const userMessage = validatedData.message.toLowerCase();

      if (userMessage.includes("horário") || userMessage.includes("horario") || userMessage.includes("atendimento")) {
        botResponse = "Nosso horário de atendimento é de segunda a sexta, das 9h às 18h. Aos sábados atendemos das 9h às 12h.";
      } else if (userMessage.includes("área") || userMessage.includes("especialidade") || userMessage.includes("direito")) {
        botResponse = "Atuamos nas seguintes áreas: Direito do Trabalho, Direito Previdenciário, Direito de Família e Sucessões, Direito Civil, Direito Imobiliário e Direito Administrativo. Em que posso ajudá-lo?";
      } else if (userMessage.includes("consulta") || userMessage.includes("agendamento")) {
        botResponse = "Para agendar uma consulta, você pode usar nosso formulário de contato ou ligar para (11) 3456-7890. Nossos advogados estão prontos para atendê-lo.";
      } else if (userMessage.includes("preço") || userMessage.includes("valor") || userMessage.includes("honorário")) {
        botResponse = "Os honorários variam conforme a complexidade do caso. Oferecemos uma primeira consulta para avaliação gratuita. Entre em contato conosco para mais detalhes.";
      } else if (userMessage.includes("oi") || userMessage.includes("olá") || userMessage.includes("bom dia") || userMessage.includes("boa tarde") || userMessage.includes("boa noite")) {
        botResponse = "Olá! Seja bem-vindo ao Valença & Soares Advogados. Como posso ajudá-lo hoje? Posso fornecer informações sobre nossas áreas de atuação, horários de atendimento ou como agendar uma consulta.";
      } else {
        botResponse = "Obrigado pela sua mensagem. Um de nossos advogados entrará em contato em breve. Para questões urgentes, ligue para (11) 3456-7890.";
      }

      // Save bot response
      const botMessage = await storage.createChatMessage({
        sessionId: validatedData.sessionId,
        message: botResponse,
        sender: "bot"
      });

      res.status(201).json({ userMessage: message, botMessage });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid chat data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to send chat message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
