const puppeteer = require('puppeteer');
const caseNumber = process.argv[2]; // node scrape.js WACXXXX

new Promise(async (resolve, reject) => {
  try {
    return await scrape(resolve);
  } catch (e) {
    return reject(e);
  }
}).then(console.log).catch(console.error);

async function scrape(resolve) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://egov.uscis.gov/casestatus/landing.do");
  await page.evaluate(cn => document.querySelector('#receipt_number').value = cn, caseNumber);

  // clicking causes page navigation, don't proceed until that is finished
  await Promise.all([
    page.waitForNavigation(),
    page.evaluate(() => document.querySelector('input[type=submit]').click()),
  ]); 

  innerHtml = await page.evaluate(() => document.querySelector('div.rows.text-center').innerHTML);
  browser.close();
  return resolve(innerHtml);
}

