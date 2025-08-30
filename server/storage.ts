import { type Verse, type InsertVerse, type Bookmark, type InsertBookmark, type DailyVerse, type InsertDailyVerse } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Verses
  getVerse(id: string): Promise<Verse | undefined>;
  getRandomVerse(): Promise<Verse | undefined>;
  searchVerses(query: string): Promise<Verse[]>;
  getVersesByCategory(category: string): Promise<Verse[]>;
  createVerse(verse: InsertVerse): Promise<Verse>;
  
  // Bookmarks
  getBookmarks(): Promise<Bookmark[]>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(id: string): Promise<boolean>;
  
  // Daily verses
  getDailyVerse(date: string): Promise<DailyVerse | undefined>;
  createDailyVerse(dailyVerse: InsertDailyVerse): Promise<DailyVerse>;
}

export class MemStorage implements IStorage {
  private verses: Map<string, Verse>;
  private bookmarks: Map<string, Bookmark>;
  private dailyVerses: Map<string, DailyVerse>;

  constructor() {
    this.verses = new Map();
    this.bookmarks = new Map();
    this.dailyVerses = new Map();
    
    // Initialize with some sample verses
    this.initializeVerses();
  }

  private initializeVerses() {
    const sampleVerses = [
      {
        text: "For I know the plans I have for you,\" declares the Lord, \"plans to prosper you and not to harm you, to give you hope and a future.",
        reference: "Jeremiah 29:11",
        book: "Jeremiah",
        chapter: "29",
        verse: "11",
        version: "NIV",
        categories: ["hope", "guidance", "comfort"]
      },
      {
        text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
        reference: "Joshua 1:9",
        book: "Joshua", 
        chapter: "1",
        verse: "9",
        version: "NIV",
        categories: ["strength", "courage", "faith"]
      },
      {
        text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
        reference: "John 14:27",
        book: "John",
        chapter: "14", 
        verse: "27",
        version: "NIV",
        categories: ["peace", "comfort"]
      },
      {
        text: "I can do all this through him who gives me strength.",
        reference: "Philippians 4:13",
        book: "Philippians",
        chapter: "4",
        verse: "13", 
        version: "NIV",
        categories: ["strength", "faith", "perseverance"]
      },
      {
        text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
        reference: "Romans 8:28",
        book: "Romans",
        chapter: "8",
        verse: "28",
        version: "NIV", 
        categories: ["hope", "comfort", "faith"]
      },
      {
        text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
        reference: "Proverbs 3:5-6",
        book: "Proverbs",
        chapter: "3",
        verse: "5-6",
        version: "NIV",
        categories: ["wisdom", "guidance", "faith"]
      }
    ];

    sampleVerses.forEach(verse => {
      const id = randomUUID();
      this.verses.set(id, { id, ...verse });
    });
  }

  async getVerse(id: string): Promise<Verse | undefined> {
    return this.verses.get(id);
  }

  async getRandomVerse(): Promise<Verse | undefined> {
    const versesArray = Array.from(this.verses.values());
    if (versesArray.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * versesArray.length);
    return versesArray[randomIndex];
  }

  async searchVerses(query: string): Promise<Verse[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.verses.values()).filter(verse => 
      verse.text.toLowerCase().includes(lowercaseQuery) ||
      verse.reference.toLowerCase().includes(lowercaseQuery) ||
      verse.categories.some(cat => cat.toLowerCase().includes(lowercaseQuery))
    );
  }

  async getVersesByCategory(category: string): Promise<Verse[]> {
    return Array.from(this.verses.values()).filter(verse => 
      verse.categories.includes(category)
    );
  }

  async createVerse(insertVerse: InsertVerse): Promise<Verse> {
    const id = randomUUID();
    const verse: Verse = { ...insertVerse, id };
    this.verses.set(id, verse);
    return verse;
  }

  async getBookmarks(): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const id = randomUUID();
    const bookmark: Bookmark = { 
      ...insertBookmark, 
      id, 
      createdAt: new Date() 
    };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  async deleteBookmark(id: string): Promise<boolean> {
    return this.bookmarks.delete(id);
  }

  async getDailyVerse(date: string): Promise<DailyVerse | undefined> {
    return this.dailyVerses.get(date);
  }

  async createDailyVerse(insertDailyVerse: InsertDailyVerse): Promise<DailyVerse> {
    const id = randomUUID();
    const dailyVerse: DailyVerse = { ...insertDailyVerse, id };
    this.dailyVerses.set(insertDailyVerse.date, dailyVerse);
    return dailyVerse;
  }
}

export const storage = new MemStorage();
