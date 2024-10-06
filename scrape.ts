import { writeFile } from "fs/promises";
import scrapeAllCategories from "./utils/scrapeAllPage";
import { categories } from "./misc/categories";

(async () => {
  try {
    console.log(`Starting to scrape all categories...`);

    const allGroups = await scrapeAllCategories();

    await writeFile("groups.json", JSON.stringify(allGroups, null, 2));
    console.log("Scraping completed. Data saved to groups.json");
  } catch (error) {
    console.error("Error occurred during scraping:", error);
  }
})();