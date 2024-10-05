import scrapePageWithPuppeteer from "./scrapePage";
import { categories } from "../misc/categories";

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export async function scrapeAllCategories(totalPages: number): Promise<any[]> {
  let allGroups: any[] = [];

  for (const category of categories) {
    console.log(`Scraping category: ${category.name}`);

    for (let i = 1; i <= totalPages; i++) {
      const groups = await scrapePageWithPuppeteer(category, i);  // Pass the entire category object
      console.log(`Scraped ${groups.length} groups from page ${i} in category ${category.name}`);
      allGroups = allGroups.concat(groups);

      await delay(2000);
    }
  }

  console.log(`Total groups scraped: ${allGroups.length}`);
  return allGroups;
}

export default scrapeAllCategories;
