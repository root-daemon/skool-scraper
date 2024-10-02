import puppeteer from "puppeteer";

async function scrapePageWithPuppeteer(pageNumber: number): Promise<any[]> {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set user-agent to avoid detection
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.1 Safari/605.1.15",
      "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
      "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36",
    ];
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    await page.setUserAgent(userAgent);

    // Navigate to the page
    const url = `https://www.skool.com/discovery?p=${pageNumber}`;
    const response = await page.goto(url, { waitUntil: "load" });

    // Check if the page returns an error status
    if (response && response.status() === 403) {
      console.log(`Blocked by server with status ${response.status()} on page ${pageNumber}`);
      await browser.close();
      return [];
    }

    let groups: any[] | PromiseLike<any[]> = [];
    try {
      // Wait for the selector to appear with an increased timeout and dynamic content loading
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds to simulate user interaction
      await page.waitForSelector(
        ".styled__ChildrenLink-sc-1brgbbt-1.fQYQam.styled__DiscoveryCardLink-sc-13ysp3k-0.eyLtsl",
        { timeout: 30000 }
      );

      // Extract groups
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
    } catch (error) {
      console.log(`No groups found or timeout on page ${pageNumber}. Skipping...`);

      // Log the HTML content for debugging
      const htmlContent = await page.content();
      console.log(`Page ${pageNumber} HTML content:`, htmlContent);
    }

    await browser.close();
    return groups;
  } catch (error) {
    console.error(`Error scraping page ${pageNumber}:`, error);
    return [];
  }
}

export default scrapePageWithPuppeteer;
