import puppeteer from "puppeteer";

async function scrapePageWithPuppeteer(pageNumber: number, retries: number = 3): Promise<any[]> {
  let attempts = 0;
  let groups: any[] = [];

  while (attempts < retries) {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.1 Safari/605.1.15",
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
        "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36",
      ];
      const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
      await page.setUserAgent(userAgent);

      const url = `https://www.skool.com/discovery?p=${pageNumber}`;
      const response = await page.goto(url, { waitUntil: "load" });

      if (response && response.status() === 403) {
        console.log(`Blocked by server with status ${response.status()} on page ${pageNumber}`);
        await browser.close();
        return [];
      }

      const randomDelay = Math.floor(Math.random() * 2000) + 3000;
      await new Promise((resolve) => setTimeout(resolve, randomDelay));

      await page.waitForSelector(
        ".styled__ChildrenLink-sc-1brgbbt-1.fQYQam.styled__DiscoveryCardLink-sc-13ysp3k-0.eyLtsl",
        { timeout: 30000 }
      );

      groups = await page.evaluate(() => {
        const elements = Array.from(
          document.querySelectorAll(
            "a.styled__ChildrenLink-sc-1brgbbt-1.fQYQam.styled__DiscoveryCardLink-sc-13ysp3k-0.eyLtsl"
          )
        );
        return elements.map((el) => ({
          title: el.querySelector(".styled__TypographyWrapper-sc-m28jfn-0")?.textContent?.trim() || "",
          description: el.querySelector(".styled__DiscoveryCardDescription-sc-13ysp3k-5")?.textContent?.trim() || "",
          members: el.querySelector(".styled__DiscoveryCardMeta-sc-13ysp3k-7")?.textContent?.trim() ?? "",
          link: el.getAttribute("href") || "",
        }));
      });

      await browser.close();
      return groups;
    } catch (error) {
      attempts++;
      if (error instanceof Error) {
        console.log(`Attempt ${attempts} failed for page ${pageNumber}. Error: ${error.message}`);
      } else {
        console.log(`Attempt ${attempts} failed for page ${pageNumber}. Unknown error: ${error}`);
      }

      if (attempts >= retries) {
        console.log(`Max retries reached for page ${pageNumber}. Skipping...`);
        return groups;
      }

      const retryDelay = Math.floor(Math.random() * 2000) + 3000;
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  return groups;
}

export default scrapePageWithPuppeteer;
