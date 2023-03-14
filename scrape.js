const puppeteer = require('puppeteer');
const caseNumber = process.argv[2]; // node scrape.js WACXXXX

(async () => {
  const browser = await puppeteer.launch();
  h = await scrapeCase(browser);
  console.log(h)
  await browser.close();
})();

async function scrapeCase(browser) {
  const page = await browser.newPage();

  await page.goto("https://egov.uscis.gov/casestatus/landing.do");
  await page.evaluate(cn => document.querySelector('#receipt_number').value = cn, caseNumber);

  // clicking causes page navigation, don't proceed until that is finished
  let nav = page.waitForNavigation();
  page.click('input[type=submit]');
  await nav;

  return await page.$eval('div.rows.text-center', e => e.innerHTML);
}
