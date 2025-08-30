import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookmarkSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get random verse
  app.get("/api/verses/random", async (_req, res) => {
    try {
      const verse = await storage.getRandomVerse();
      if (!verse) {
        return res.status(404).json({ message: "No verses found" });
      }
      res.json(verse);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch random verse" });
    }
  });

  // Search verses
  app.get("/api/verses/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const verses = await storage.searchVerses(query);
      res.json(verses);
    } catch (error) {
      res.status(500).json({ message: "Failed to search verses" });
    }
  });

  // Get verses by category
  app.get("/api/verses/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const verses = await storage.getVersesByCategory(category);
      res.json(verses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch verses by category" });
    }
  });

  // Get daily verse
  app.get("/api/daily-verse", async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      let dailyVerse = await storage.getDailyVerse(today);
      
      if (!dailyVerse) {
        // Create a new daily verse for today
        const randomVerse = await storage.getRandomVerse();
        if (randomVerse) {
          dailyVerse = await storage.createDailyVerse({
            date: today,
            verseId: randomVerse.id,
            verseText: randomVerse.text,
            verseReference: randomVerse.reference
          });
        }
      }
      
      if (!dailyVerse) {
        return res.status(404).json({ message: "No daily verse available" });
      }
      
      res.json(dailyVerse);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch daily verse" });
    }
  });

  // Get bookmarks
  app.get("/api/bookmarks", async (_req, res) => {
    try {
      const bookmarks = await storage.getBookmarks();
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });

  // Create bookmark
  app.post("/api/bookmarks", async (req, res) => {
    try {
      const validatedData = insertBookmarkSchema.parse(req.body);
      const bookmark = await storage.createBookmark(validatedData);
      res.status(201).json(bookmark);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid bookmark data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create bookmark" });
    }
  });

  // Delete bookmark
  app.delete("/api/bookmarks/:id", async (req, res) => {
    try {
      const success = await storage.deleteBookmark(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete bookmark" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
