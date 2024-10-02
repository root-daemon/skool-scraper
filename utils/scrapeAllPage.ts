import scrapePageWithPuppeteer from "./scrapePage";
function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
export async function scrapeAllPagesWithPuppeteer(totalPages: number): Promise<any[]> {
  let allGroups: any[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const groups = await scrapePageWithPuppeteer(i);
    console.log(`Scraped ${groups.length} groups from page ${i}`);
    allGroups = allGroups.concat(groups);

    await delay(2000);
  }

  console.log(`Total groups scraped: ${allGroups.length}`);
  return allGroups;
}

export default scrapePageWithPuppeteer;
