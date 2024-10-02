import puppeteer from "puppeteer";
function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
export async function scrapePageWithPuppeteer(pageNumber: number): Promise<any[]> {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set a user-agent to mimic a real browser
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
    );

    // Navigate to the target page
    const url = `https://www.skool.com/discovery?p=${pageNumber}`;
    await page.goto(url, { waitUntil: "networkidle2" });
    await delay(3000); // Extract the group data based on the specified class
    const groups = await page.evaluate(() => {
      const elements = Array.from(
        document.querySelectorAll(
          ".styled__ChildrenLink-sc-1brgbbt-1.fQYQam.styled__DiscoveryCardLink-sc-13ysp3k-0.eyLtsl"
        )
      );

      // Extract relevant information from each group element
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
    console.error(`Error scraping page ${pageNumber}:`, error);
    return [];
  }
}

export default scrapePageWithPuppeteer;
