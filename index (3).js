// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  conversations;
  sessions;
  customers;
  constructor() {
    this.conversations = /* @__PURE__ */ new Map();
    this.sessions = /* @__PURE__ */ new Map();
    this.customers = /* @__PURE__ */ new Map();
    this.initializeMockData();
  }
  initializeMockData() {
    const customer1 = {
      id: "customer-1",
      name: "Sarah Johnson",
      tier: "premium",
      accountAge: "2 years",
      lastContact: new Date(Date.now() - 3 * 7 * 24 * 60 * 60 * 1e3),
      // 3 weeks ago
      sentimentHistory: "positive",
      language: "English",
      previousIssues: ["Wi-Fi setup assistance", "Billing inquiry (resolved)", "Service upgrade"]
    };
    const customer2 = {
      id: "customer-2",
      name: "Mike Chen",
      tier: "standard",
      accountAge: "1 year",
      lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3),
      // 2 days ago
      sentimentHistory: "frustrated",
      language: "English",
      previousIssues: ["Account billing inquiry", "Service downtime"]
    };
    this.customers.set(customer1.id, customer1);
    this.customers.set(customer2.id, customer2);
    const conversation1 = {
      id: "conv-1",
      customerName: "Sarah Johnson",
      status: "active",
      messages: [
        {
          type: "ai",
          content: "Hello! I'm AudiaGenix, your intelligent voice assistant. How can I assist you today?",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          confidence: 98,
          latency: 200
        },
        {
          type: "user",
          content: "Hi, I'm having trouble with my internet connection. It keeps dropping out every few minutes.",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          sentiment: "frustrated"
        }
      ],
      sentiment: "frustrated",
      duration: 204,
      // 3:24 in seconds
      createdAt: /* @__PURE__ */ new Date()
    };
    const conversation2 = {
      id: "conv-2",
      customerName: "Mike Chen",
      status: "escalated",
      messages: [
        {
          type: "ai",
          content: "I understand you have a billing inquiry. Let me help you with that.",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          confidence: 95
        },
        {
          type: "user",
          content: "I've been charged twice for the same service.",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          sentiment: "frustrated"
        }
      ],
      sentiment: "frustrated",
      duration: 495,
      // 8:15 in seconds
      createdAt: /* @__PURE__ */ new Date()
    };
    this.conversations.set(conversation1.id, conversation1);
    this.conversations.set(conversation2.id, conversation2);
  }
  async getConversations() {
    return Array.from(this.conversations.values());
  }
  async getConversation(id) {
    return this.conversations.get(id);
  }
  async createConversation(insertConversation) {
    const id = randomUUID();
    const conversation = {
      ...insertConversation,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.conversations.set(id, conversation);
    return conversation;
  }
  async updateConversation(id, updates) {
    const conversation = this.conversations.get(id);
    if (!conversation) return void 0;
    const updatedConversation = { ...conversation, ...updates };
    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }
  async getSessions(conversationId) {
    return Array.from(this.sessions.values()).filter(
      (session) => session.conversationId === conversationId
    );
  }
  async createSession(insertSession) {
    const id = randomUUID();
    const session = {
      ...insertSession,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.sessions.set(id, session);
    return session;
  }
  async getCustomers() {
    return Array.from(this.customers.values());
  }
  async getCustomer(id) {
    return this.customers.get(id);
  }
  async createCustomer(insertCustomer) {
    const id = randomUUID();
    const customer = { ...insertCustomer, id };
    this.customers.set(id, customer);
    return customer;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  status: text("status").notNull().default("active"),
  // active, escalated, completed
  messages: jsonb("messages").notNull().default([]),
  sentiment: text("sentiment").default("neutral"),
  // positive, neutral, negative, frustrated
  duration: integer("duration").default(0),
  // in seconds
  createdAt: timestamp("created_at").defaultNow()
});
var sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => conversations.id),
  transcription: text("transcription"),
  audioData: text("audio_data"),
  // base64 encoded audio
  aiResponse: text("ai_response"),
  confidence: integer("confidence").default(0),
  // 0-100
  latency: integer("latency").default(0),
  // in milliseconds
  createdAt: timestamp("created_at").defaultNow()
});
var customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  tier: text("tier").default("standard"),
  // standard, premium, enterprise
  accountAge: text("account_age"),
  lastContact: timestamp("last_contact"),
  sentimentHistory: text("sentiment_history").default("positive"),
  language: text("language").default("English"),
  previousIssues: jsonb("previous_issues").default([])
});
var insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true
});
var insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true
});
var insertCustomerSchema = createInsertSchema(customers).omit({
  id: true
});

// server/routes.ts
import { z } from "zod";

// server/assemblyai-service.ts
import { AssemblyAI } from "assemblyai";
var client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY
});
async function transcribeAudio(audioBuffer) {
  try {
    const uploadUrl = await client.files.upload(audioBuffer);
    const transcript = await client.transcripts.transcribe({
      audio: uploadUrl,
      speaker_labels: true,
      auto_highlights: true,
      sentiment_analysis: true,
      entity_detection: true,
      punctuate: true,
      format_text: true
    });
    if (transcript.status === "error") {
      throw new Error(transcript.error || "Transcription failed");
    }
    return {
      text: transcript.text || "",
      confidence: transcript.confidence || 0,
      words: transcript.words?.map((word) => ({
        text: word.text,
        start: word.start,
        end: word.end,
        confidence: word.confidence
      }))
    };
  } catch (error) {
    console.error("AssemblyAI transcription error:", error);
    throw new Error("Failed to transcribe audio");
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/conversations", async (req, res) => {
    try {
      const conversations2 = await storage.getConversations();
      res.json(conversations2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });
  app2.get("/api/conversations/:id", async (req, res) => {
    try {
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });
  app2.post("/api/conversations", async (req, res) => {
    try {
      const data = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(data);
      res.status(201).json(conversation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });
  app2.patch("/api/conversations/:id", async (req, res) => {
    try {
      const updates = req.body;
      const conversation = await storage.updateConversation(req.params.id, updates);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Failed to update conversation" });
    }
  });
  app2.post("/api/process-speech", async (req, res) => {
    try {
      const { transcription, conversationId } = req.body;
      if (!transcription) {
        return res.status(400).json({ message: "Transcription is required" });
      }
      const processingDelay = Math.random() * 200 + 200;
      await new Promise((resolve) => setTimeout(resolve, processingDelay));
      const aiResponse = generateAIResponse(transcription);
      const confidence = Math.floor(Math.random() * 10) + 90;
      const latency = Math.floor(processingDelay);
      if (conversationId) {
        await storage.createSession({
          conversationId,
          transcription,
          aiResponse: aiResponse.content,
          confidence,
          latency
        });
      }
      res.json({
        response: aiResponse,
        confidence,
        latency,
        sentiment: detectSentiment(transcription)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to process speech" });
    }
  });
  app2.get("/api/customers", async (req, res) => {
    try {
      const customers2 = await storage.getCustomers();
      res.json(customers2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });
  app2.post("/api/assemblyai-token", async (req, res) => {
    try {
      res.json({
        token: process.env.ASSEMBLYAI_API_KEY,
        websocket_url: "wss://streaming.assemblyai.com/v3/ws"
      });
    } catch (error) {
      console.error("AssemblyAI token error:", error);
      res.status(500).json({ message: "Failed to get AssemblyAI token" });
    }
  });
  app2.post("/api/process-audio", async (req, res) => {
    try {
      const { audioData } = req.body;
      if (!audioData) {
        return res.status(400).json({ message: "Audio data is required" });
      }
      const audioBuffer = Buffer.from(audioData, "base64");
      const result = await transcribeAudio(audioBuffer);
      const aiResponse = generateAIResponse(result.text);
      const sentiment = detectSentiment(result.text);
      res.json({
        transcription: result.text,
        confidence: Math.round(result.confidence * 100),
        response: aiResponse,
        sentiment,
        latency: Math.floor(Math.random() * 100) + 200
        // Simulated latency
      });
    } catch (error) {
      console.error("Audio processing error:", error);
      res.status(500).json({ message: "Failed to process audio" });
    }
  });
  app2.get("/api/analytics", async (req, res) => {
    try {
      const analytics = {
        responseTime: Math.floor(Math.random() * 100) + 250,
        accuracy: Math.floor(Math.random() * 8) + 92,
        satisfaction: (Math.random() * 0.5 + 4.5).toFixed(1),
        escalationRate: Math.floor(Math.random() * 10) + 10,
        sentimentTimeline: generateSentimentTimeline(),
        activeFeatures: {
          crossSessionMemory: { active: true, progress: 85 },
          dynamicLearning: { active: true, progress: 60 },
          proactiveSuggestions: { active: true, suggestions: 3 }
        }
      };
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}
function generateAIResponse(transcription) {
  const responses = [
    {
      content: "I understand your concern. Let me help you troubleshoot this issue step by step.",
      reasoning: [
        "Detected frustration in voice tone",
        "Cross-referenced with area outage reports",
        "Applied escalation prevention strategy",
        "Initiated structured troubleshooting workflow"
      ]
    },
    {
      content: "Thank you for providing that information. Based on your account history, I can see similar issues were resolved previously.",
      reasoning: [
        "Accessed customer history",
        "Identified pattern in previous issues",
        "Applied learned resolution strategy"
      ]
    },
    {
      content: "I've analyzed your account and I'm detecting some network connectivity patterns. Let me guide you through a quick diagnostic.",
      reasoning: [
        "Performed network analysis",
        "Detected connectivity patterns",
        "Initiated diagnostic workflow"
      ]
    }
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
function detectSentiment(text2) {
  const frustrationWords = ["frustrated", "angry", "terrible", "awful", "hate", "broken", "stupid"];
  const positiveWords = ["great", "good", "excellent", "perfect", "love", "amazing"];
  const lowerText = text2.toLowerCase();
  if (frustrationWords.some((word) => lowerText.includes(word))) {
    return "frustrated";
  } else if (positiveWords.some((word) => lowerText.includes(word))) {
    return "positive";
  }
  return "neutral";
}
function generateSentimentTimeline() {
  const sentiments = ["positive", "neutral", "negative"];
  const timeline = [];
  for (let i = 0; i < 7; i++) {
    timeline.push({
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
      value: Math.random() * 100
    });
  }
  return timeline;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
