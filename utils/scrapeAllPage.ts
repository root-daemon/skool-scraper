import scrapePageWithPuppeteer from "./scrapePage";

export async function scrapeAllPagesWithPuppeteer(totalPages: number): Promise<any[]> {
  let allGroups: any[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const groups = await scrapePageWithPuppeteer(i);
    console.log(`Scraped ${groups.length} groups from page ${i}`);
    allGroups = allGroups.concat(groups);
  }

  console.log(`Total groups scraped: ${allGroups.length}`);
  return allGroups;
}
export default scrapePageWithPuppeteer;
