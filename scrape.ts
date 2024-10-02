// scrape.ts

import { scrapeAllPagesWithPuppeteer } from "./utils/scrapeAllPage"; 
import { writeFile } from "fs/promises"; 
(async () => {
  try {
    const totalPages = 34; 
    console.log(`Starting to scrape ${totalPages} pages...`);

    const allGroups = await scrapeAllPagesWithPuppeteer(totalPages);

    await writeFile("groups.json", JSON.stringify(allGroups, null, 2));
    console.log("Scraping completed. Data saved to groups.json");
  } catch (error) {
    console.error("Error occurred during scraping:", error);
  }
})();
