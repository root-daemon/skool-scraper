import puppeteer from "puppeteer";

async function scrapePageWithPuppeteer(category: { name: string; id: string }, pageNumber: number, retries: number = 3): Promise<any[]> {
  let attempts = 0;
  let groups: any[] = [];

  while (attempts < retries) {
    try {
      const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-infobars', '--window-position=0,0', '--ignore-certifcate-errors', '--ignore-certifcate-errors-spki-list']
      });
      const page = await browser.newPage();

      // User agent rotation and other setup code...

      const url = pageNumber === 1 
        ? `https://www.skool.com/discovery?c=${category.id}`
        : `https://www.skool.com/discovery?c=${category.id}&p=${pageNumber}`;

      console.log(`Accessing URL: ${url}`);

      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

      // Wait for the specific elements we're looking for
      await page.waitForSelector('.styled__ChildrenLink-sc-1brgbbt-1.fQYQam.styled__DiscoveryCardLink-sc-13ysp3k-0.eyLtsl', { timeout: 30000 });

      // Scroll the page to trigger any lazy-loading
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      await new Promise(resolve => setTimeout(resolve, 5000));  // Wait for 5 seconds after scrolling

      const scrapedGroups = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('.styled__ChildrenLink-sc-1brgbbt-1.fQYQam.styled__DiscoveryCardLink-sc-13ysp3k-0.eyLtsl'));
        return elements.map((el) => {
          const titleEl = el.querySelector('.styled__GroupNameWrapper-sc-dph3q3-0');
          const descriptionEl = el.querySelector('.styled__DiscoveryCardDescription-sc-13ysp3k-5');
          const metaEl = el.querySelector('.styled__DiscoveryCardMeta-sc-13ysp3k-7');
          const rankingEl = el.querySelector('.styled__DiscoveryCardRanking-sc-13ysp3k-6');
          
          return {
            title: titleEl ? titleEl.textContent?.trim() : "",
            description: descriptionEl ? descriptionEl.textContent?.trim() : "",
            meta: metaEl ? metaEl.textContent?.trim() : "",
            ranking: rankingEl ? rankingEl.textContent?.trim() : "",
            link: el.getAttribute('href') || "",
          };
        });
      });

      groups = scrapedGroups.map((group) => ({
        ...group,
        category: category.name,
      }));

      await browser.close();
      
      if (groups.length === 0) {
        console.log(`No groups found on page ${pageNumber} for category ${category.name}. This might be the last page.`);
      } else {
        console.log(`Scraped ${groups.length} groups from page ${pageNumber} for category ${category.name}`);
      }

      return groups;
    } catch (error) {
      attempts++;
      if (error instanceof Error) {
        console.log(
          `Attempt ${attempts} failed for page ${pageNumber} in category ${category.name}. Error: ${error.message}`
        );
      } else {
        console.log(
          `Attempt ${attempts} failed for page ${pageNumber} in category ${category.name}. Unknown error: ${error}`
        );
      }

      if (attempts >= retries) {
        console.log(`Max retries reached for page ${pageNumber} in category ${category.name}. Skipping...`);
        return groups;
      }

      const retryDelay = Math.floor(Math.random() * 5000) + 10000;
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  return groups;
}


export default scrapePageWithPuppeteer;



