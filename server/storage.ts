import { type Conversation, type Session, type Customer, type InsertConversation, type InsertSession, type InsertCustomer } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Conversations
  getConversations(): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation | undefined>;
  
  // Sessions
  getSessions(conversationId: string): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  
  // Customers
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
}

export class MemStorage implements IStorage {
  private conversations: Map<string, Conversation>;
  private sessions: Map<string, Session>;
  private customers: Map<string, Customer>;

  constructor() {
    this.conversations = new Map();
    this.sessions = new Map();
    this.customers = new Map();
    
    // Initialize with some mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create mock customers
    const customer1: Customer = {
      id: "customer-1",
      name: "Sarah Johnson",
      tier: "premium",
      accountAge: "2 years",
      lastContact: new Date(Date.now() - 3 * 7 * 24 * 60 * 60 * 1000), // 3 weeks ago
      sentimentHistory: "positive",
      language: "English",
      previousIssues: ["Wi-Fi setup assistance", "Billing inquiry (resolved)", "Service upgrade"],
    };

    const customer2: Customer = {
      id: "customer-2",
      name: "Mike Chen",
      tier: "standard",
      accountAge: "1 year",
      lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      sentimentHistory: "frustrated",
      language: "English",
      previousIssues: ["Account billing inquiry", "Service downtime"],
    };

    this.customers.set(customer1.id, customer1);
    this.customers.set(customer2.id, customer2);

    // Create mock conversations
    const conversation1: Conversation = {
      id: "conv-1",
      customerName: "Sarah Johnson",
      status: "active",
      messages: [
        {
          type: "ai",
          content: "Hello! I'm AudiaGenix, your intelligent voice assistant. How can I assist you today?",
          timestamp: new Date().toISOString(),
          confidence: 98,
          latency: 200
        },
        {
          type: "user",
          content: "Hi, I'm having trouble with my internet connection. It keeps dropping out every few minutes.",
          timestamp: new Date().toISOString(),
          sentiment: "frustrated"
        }
      ],
      sentiment: "frustrated",
      duration: 204, // 3:24 in seconds
      createdAt: new Date(),
    };

    const conversation2: Conversation = {
      id: "conv-2",
      customerName: "Mike Chen",
      status: "escalated",
      messages: [
        {
          type: "ai",
          content: "I understand you have a billing inquiry. Let me help you with that.",
          timestamp: new Date().toISOString(),
          confidence: 95
        },
        {
          type: "user",
          content: "I've been charged twice for the same service.",
          timestamp: new Date().toISOString(),
          sentiment: "frustrated"
        }
      ],
      sentiment: "frustrated",
      duration: 495, // 8:15 in seconds
      createdAt: new Date(),
    };

    this.conversations.set(conversation1.id, conversation1);
    this.conversations.set(conversation2.id, conversation2);
  }

  async getConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values());
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const conversation: Conversation = {
      ...insertConversation,
      id,
      createdAt: new Date(),
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;
    
    const updatedConversation = { ...conversation, ...updates };
    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }

  async getSessions(conversationId: string): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      session => session.conversationId === conversationId
    );
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = randomUUID();
    const session: Session = {
      ...insertSession,
      id,
      createdAt: new Date(),
    };
    this.sessions.set(id, session);
    return session;
  }

  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = { ...insertCustomer, id };
    this.customers.set(id, customer);
    return customer;
  }
}

export const storage = new MemStorage();
