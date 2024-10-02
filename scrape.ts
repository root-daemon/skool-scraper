// scrape.ts

import { scrapeAllPagesWithPuppeteer } from "./utils/scrapeAllPage"; // Adjust the path to your scraper
import { writeFile } from "fs/promises"; // Use Node's fs/promises for file operations

// Main function to run the scraping process
(async () => {
  try {
    const totalPages = 34; // Define how many pages you want to scrape
    console.log(`Starting to scrape ${totalPages} pages...`);

    // Call the scraping function and get the results
    const allGroups = await scrapeAllPagesWithPuppeteer(totalPages);

    // Save the result to a JSON file
    await writeFile("groups.json", JSON.stringify(allGroups, null, 2));
    console.log("Scraping completed. Data saved to groups.json");
  } catch (error) {
    console.error("Error occurred during scraping:", error);
  }
})();
