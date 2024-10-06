import scrapePageWithPuppeteer from "./scrapePage";
import { categories } from "../misc/categories";

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export async function scrapeAllCategories(): Promise<any[]> {
  let allGroups: any[] = [];

  for (const category of categories) {
    console.log(`Scraping category: ${category.name}`);

    for (let i = 1; i <= category.pages; i++) {
      const groups = await scrapePageWithPuppeteer(category, i);
      console.log(`Scraped ${groups.length} groups from page ${i} in category ${category.name}`);
      allGroups = allGroups.concat(groups);

      await delay(2000);
    }
  }

  console.log(`Total groups scraped: ${allGroups.length}`);
  return allGroups;
}

export default scrapeAllCategories;