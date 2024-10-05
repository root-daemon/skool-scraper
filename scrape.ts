import { writeFile } from "fs/promises";
import scrapeAllCategories from "./utils/scrapeAllPage";


(async () => {
  try {
    const totalPages = 34;
    console.log(`Starting to scrape ${totalPages} pages across all categories...`);

    const allGroups = await scrapeAllCategories(totalPages);

    await writeFile("groups.json", JSON.stringify(allGroups, null, 2));
    console.log("Scraping completed. Data saved to groups.json");
  } catch (error) {
    console.error("Error occurred during scraping:", error);
  }
})();
