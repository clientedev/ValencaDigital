import { type User, type InsertUser, type BlogPost, type InsertBlogPost, type BlogLike, type InsertBlogLike, type ContactMessage, type InsertContactMessage, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getBlogPosts(category?: string): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
  
  getBlogLike(postId: string, sessionId: string): Promise<BlogLike | undefined>;
  createBlogLike(like: InsertBlogLike): Promise<BlogLike>;
  deleteBlogLike(postId: string, sessionId: string): Promise<boolean>;
  getBlogLikeCount(postId: string): Promise<number>;

  // Contact messages
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  updateContactMessageStatus(id: string, status: string): Promise<ContactMessage | undefined>;

  // Chat messages
  getChatMessages(sessionId?: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private blogPosts: Map<string, BlogPost>;
  private blogLikes: Map<string, BlogLike>;
  private contactMessages: Map<string, ContactMessage>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    this.blogLikes = new Map();
    this.contactMessages = new Map();
    this.chatMessages = new Map();
    
    // Initialize with some sample blog posts
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const samplePosts: BlogPost[] = [
      {
        id: "1",
        title: "Novas Regras do Trabalho Remoto: O que sua Empresa Precisa Saber",
        content: `
<p>Com as mudanças na legislação trabalhista, o trabalho remoto ganhou novas regulamentações que impactam diretamente empresas e funcionários. Este artigo analisa as principais alterações e suas implicações práticas.</p>

<h3>Principais Mudanças</h3>
<p>A Lei 14.442/2022 trouxe importantes modificações na CLT, estabelecendo regras específicas para o trabalho remoto, incluindo:</p>
<ul>
<li>Definição clara de trabalho remoto vs. home office</li>
<li>Responsabilidades sobre equipamentos e infraestrutura</li>
<li>Controle de jornada e direito à desconexão</li>
<li>Políticas de reembolso de despesas</li>
</ul>

<h3>Impactos para Empresas</h3>
<p>As organizações precisam se adaptar às novas exigências, incluindo a elaboração de políticas internas claras e a implementação de controles adequados.</p>
        `,
        excerpt: "Análise completa das mudanças na legislação trabalhista para modalidade home office e trabalho híbrido.",
        category: "Direito do Trabalho",
        imageUrl: "https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        likes: 24,
        readTime: "5 min",
        published: true,
        createdAt: new Date("2024-12-15T10:00:00Z"),
        updatedAt: new Date("2024-12-15T10:00:00Z"),
      },
      {
        id: "2",
        title: "Aposentadoria Especial: Guia Completo para Profissionais da Saúde",
        content: `
<p>A aposentadoria especial é um benefício previdenciário destinado aos trabalhadores expostos a agentes nocivos à saúde. Para profissionais da área da saúde, existem critérios específicos que precisam ser observados.</p>

<h3>Requisitos Essenciais</h3>
<p>Para ter direito à aposentadoria especial, o profissional de saúde deve comprovar:</p>
<ul>
<li>Tempo de contribuição específico (25 anos para a maioria dos casos)</li>
<li>Exposição permanente aos agentes nocivos</li>
<li>Documentação adequada (PPP, LTCAT, etc.)</li>
</ul>

<h3>Documentação Necessária</h3>
<p>A documentação é fundamental para o sucesso do pedido. Inclui laudos técnicos, perfil profissiográfico e comprovação da exposição aos riscos.</p>
        `,
        excerpt: "Entenda os requisitos e documentações necessárias para conquistar sua aposentadoria especial.",
        category: "Direito Previdenciário",
        imageUrl: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        likes: 31,
        readTime: "8 min",
        published: true,
        createdAt: new Date("2024-12-12T14:30:00Z"),
        updatedAt: new Date("2024-12-12T14:30:00Z"),
      },
      {
        id: "3",
        title: "Divórcio Consensual: Passo a Passo para um Processo Mais Rápido",
        content: `
<p>O divórcio consensual é uma modalidade que permite a dissolução do casamento de forma mais ágil e menos conflituosa, quando há acordo entre os cônjuges sobre todos os aspectos da separação.</p>

<h3>Vantagens do Divórcio Consensual</h3>
<ul>
<li>Processo mais rápido e econômico</li>
<li>Menor desgaste emocional</li>
<li>Maior controle sobre as decisões</li>
<li>Possibilidade de realização em cartório</li>
</ul>

<h3>Requisitos Necessários</h3>
<p>Para optar pelo divórcio consensual, é necessário que os cônjuges estejam em acordo sobre:</p>
<ul>
<li>Divisão dos bens</li>
<li>Guarda dos filhos menores</li>
<li>Pensão alimentícia</li>
<li>Outras questões patrimoniais</li>
</ul>
        `,
        excerpt: "Conheça as vantagens do divórcio consensual e como tornar o processo mais ágil e menos desgastante.",
        category: "Direito de Família e Sucessão",
        imageUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        likes: 18,
        readTime: "6 min",
        published: true,
        createdAt: new Date("2024-12-10T09:15:00Z"),
        updatedAt: new Date("2024-12-10T09:15:00Z"),
      }
    ];

    samplePosts.forEach(post => {
      this.blogPosts.set(post.id, post);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getBlogPosts(category?: string): Promise<BlogPost[]> {
    const posts = Array.from(this.blogPosts.values())
      .filter(post => post.published)
      .filter(post => !category || post.category === category)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return posts;
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const now = new Date();
    const post: BlogPost = {
      ...insertPost,
      id,
      likes: 0,
      imageUrl: insertPost.imageUrl || null,
      published: insertPost.published ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: string, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existing = this.blogPosts.get(id);
    if (!existing) return undefined;

    const updated: BlogPost = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  async getBlogLike(postId: string, sessionId: string): Promise<BlogLike | undefined> {
    const key = `${postId}-${sessionId}`;
    return this.blogLikes.get(key);
  }

  async createBlogLike(insertLike: InsertBlogLike): Promise<BlogLike> {
    const id = randomUUID();
    const like: BlogLike = {
      ...insertLike,
      id,
      createdAt: new Date(),
    };
    const key = `${insertLike.postId}-${insertLike.sessionId}`;
    this.blogLikes.set(key, like);

    // Update post like count
    const post = this.blogPosts.get(insertLike.postId);
    if (post) {
      post.likes += 1;
      this.blogPosts.set(insertLike.postId, post);
    }

    return like;
  }

  async deleteBlogLike(postId: string, sessionId: string): Promise<boolean> {
    const key = `${postId}-${sessionId}`;
    const deleted = this.blogLikes.delete(key);

    if (deleted) {
      // Update post like count
      const post = this.blogPosts.get(postId);
      if (post && post.likes > 0) {
        post.likes -= 1;
        this.blogPosts.set(postId, post);
      }
    }

    return deleted;
  }

  async getBlogLikeCount(postId: string): Promise<number> {
    return Array.from(this.blogLikes.values())
      .filter(like => like.postId === postId).length;
  }

  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = {
      ...insertMessage,
      id,
      phone: insertMessage.phone || null,
      status: "new",
      createdAt: new Date(),
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async updateContactMessageStatus(id: string, status: string): Promise<ContactMessage | undefined> {
    const message = this.contactMessages.get(id);
    if (!message) return undefined;
    
    const updated = { ...message, status };
    this.contactMessages.set(id, updated);
    return updated;
  }

  // Chat Messages
  async getChatMessages(sessionId?: string): Promise<ChatMessage[]> {
    const messages = Array.from(this.chatMessages.values());
    
    if (sessionId) {
      return messages
        .filter(msg => msg.sessionId === sessionId)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }
    
    return messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      name: insertMessage.name || null,
      email: insertMessage.email || null,
      phone: insertMessage.phone || null,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
