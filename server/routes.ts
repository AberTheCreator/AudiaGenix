import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConversationSchema, insertSessionSchema } from "@shared/schema";
import { z } from "zod";
import { AssemblyAI } from 'assemblyai';
import { transcribeAudio, detectSentiment } from "./assemblyai-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all conversations
  app.get("/api/conversations", async (req, res) => {
    try {
      const conversations = await storage.getConversations();
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Get a specific conversation
  app.get("/api/conversations/:id", async (req, res) => {
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

  // Create a new conversation
  app.post("/api/conversations", async (req, res) => {
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

  // Update a conversation (add messages, update status, etc.)
  app.patch("/api/conversations/:id", async (req, res) => {
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

  // Process speech and generate AI response
  app.post("/api/process-speech", async (req, res) => {
    try {
      const { transcription, conversationId } = req.body;
      
      if (!transcription) {
        return res.status(400).json({ message: "Transcription is required" });
      }

      // Simulate AI processing delay (200-400ms)
      const processingDelay = Math.random() * 200 + 200;
      await new Promise(resolve => setTimeout(resolve, processingDelay));

      // Generate mock AI response based on transcription
      const aiResponse = generateAIResponse(transcription);
      const confidence = Math.floor(Math.random() * 10) + 90; // 90-99%
      const latency = Math.floor(processingDelay);

      // Create session record
      if (conversationId) {
        await storage.createSession({
          conversationId,
          transcription,
          aiResponse: aiResponse.content,
          confidence,
          latency,
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

  // Get all customers
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  // Get AssemblyAI token for real-time transcription
  app.post("/api/assemblyai-token", async (req, res) => {
    try {
      // Return the API key directly for browser-based real-time transcription
      // Note: In production, this should be handled more securely
      res.json({ 
        token: process.env.ASSEMBLYAI_API_KEY,
        websocket_url: "wss://streaming.assemblyai.com/v3/ws"
      });
    } catch (error) {
      console.error('AssemblyAI token error:', error);
      res.status(500).json({ message: "Failed to get AssemblyAI token" });
    }
  });

  // Process audio with AssemblyAI
  app.post("/api/process-audio", async (req, res) => {
    try {
      const { audioData } = req.body;
      
      if (!audioData) {
        return res.status(400).json({ message: "Audio data is required" });
      }

      // Convert base64 to buffer
      const audioBuffer = Buffer.from(audioData, 'base64');
      
      // Transcribe with AssemblyAI
      const result = await transcribeAudio(audioBuffer);
      
      // Generate AI response
      const aiResponse = generateAIResponse(result.text);
      const sentiment = detectSentiment(result.text);
      
      res.json({
        transcription: result.text,
        confidence: Math.round(result.confidence * 100),
        response: aiResponse,
        sentiment,
        latency: Math.floor(Math.random() * 100) + 200 // Simulated latency
      });
    } catch (error) {
      console.error('Audio processing error:', error);
      res.status(500).json({ message: "Failed to process audio" });
    }
  });

  // Get analytics data
  app.get("/api/analytics", async (req, res) => {
    try {
      // Generate mock analytics data
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

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to generate AI responses
function generateAIResponse(transcription: string): any {
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

// Helper function to detect sentiment
function detectSentiment(text: string): string {
  const frustrationWords = ['frustrated', 'angry', 'terrible', 'awful', 'hate', 'broken', 'stupid'];
  const positiveWords = ['great', 'good', 'excellent', 'perfect', 'love', 'amazing'];
  
  const lowerText = text.toLowerCase();
  
  if (frustrationWords.some(word => lowerText.includes(word))) {
    return 'frustrated';
  } else if (positiveWords.some(word => lowerText.includes(word))) {
    return 'positive';
  }
  
  return 'neutral';
}

// Helper function to generate sentiment timeline
function generateSentimentTimeline(): any[] {
  const sentiments = ['positive', 'neutral', 'negative'];
  const timeline = [];
  
  for (let i = 0; i < 7; i++) {
    timeline.push({
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
      value: Math.random() * 100
    });
  }
  
  return timeline;
}
