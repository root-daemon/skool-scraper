import { Hono } from "hono";
import { serve } from "bun";
import { scrapeAllPagesWithPuppeteer } from "../utils/scrapeAllPage";

const app = new Hono();

// Test route
app.get("/", (c) => {
  return c.text("Hello, world!");
});

// Scraping route
app.get("/scrape-groups", async (c) => {
  const totalPages = 34; // Set the total number of pages to scrape
  const allGroups = await scrapeAllPagesWithPuppeteer(totalPages);

  if (allGroups.length > 0) {
    return c.json(allGroups);
  } else {
    return c.text("No data found or an error occurred.");
  }
});

// Serve using Bun's serve function
serve({ fetch: app.fetch });
