import { firefox, test } from "playwright/test"
import * as fs from 'fs';


test.setTimeout(120000)
test("scrape likers", async () => {
  const browser = await firefox.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  const uniqueLinks = new Set();
  let previousLength = 0;
  page.goto("https://web.facebook.com/permalink.php?story_fbid=122116459334061810&id=61551854310961")
  await page.getByRole('textbox', { name: 'Email address or phone number' }).click();
  await page.getByRole('textbox', { name: 'Email address or phone number' }).fill("6322770817@g.siit.tu.ac.th");
  await page.locator('#login_popup_cta_form').getByRole('textbox', { name: 'Password' }).click();
  await page.locator('#login_popup_cta_form').getByRole('textbox', { name: 'Password' }).fill("pkP1212312121Pkp");
  await page.locator('#login_popup_cta_form').getByLabel('Accessible login button').click();
  await page.waitForLoadState('networkidle');
  const exists = await page.$$('//div[@class="x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1n2onr6 x87ps6o x1lku1pv x1a2a7pz x1heor9g xnl1qt8 x6ikm8r x10wlt62 x1vjfegm x1lliihq"]');
  if (exists.length !== 0) {
    const allReactionsButtonLocator = page.locator('//div[@class="x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1n2onr6 x87ps6o x1lku1pv x1a2a7pz x1heor9g xnl1qt8 x6ikm8r x10wlt62 x1vjfegm x1lliihq"]');
    await allReactionsButtonLocator.click();
    // await page.locator('//@div[class="xb57i2i x1q594ok x5lxg6s x78zum5 xdt5ytf x6ikm8r x1ja2u2z x1pq812k x1rohswg xfk6m8 x1yqm8si xjx87ck xx8ngbg xwo3gff x1n2onr6 x1oyok0e x1odjw0f x1e4zzel x1tbbn4q x1y1aw1k x4uap5 xwib8y2 xkhd6sd]"')
    await page.waitForSelector('//div[@class="x6s0dn4 xkh2ocl x1q0q8m5 x1qhh985 xu3j5b3 xcfux6l x26u7qi xm0m39n x13fuv20 x972fbf x9f619 x78zum5 x1q0g3np x1iyjqo2 xs83m0k x1qughib xat24cr x11i5rnm x1mh8g0r xdj266r x2lwn1j xeuugli x18d9i69 x4uap5 xkhd6sd xexx8yu x1n2onr6 x1ja2u2z"]')
    while (true) {
      const elements = await page.$$('//div[@class="x6s0dn4 xkh2ocl x1q0q8m5 x1qhh985 xu3j5b3 xcfux6l x26u7qi xm0m39n x13fuv20 x972fbf x9f619 x78zum5 x1q0g3np x1iyjqo2 xs83m0k x1qughib xat24cr x11i5rnm x1mh8g0r xdj266r x2lwn1j xeuugli x18d9i69 x4uap5 xkhd6sd xexx8yu x1n2onr6 x1ja2u2z"]//a');
      if (elements.length === 0) break;
      for (const element of elements) {
        if (await element.isVisible()) {
          const fullHref = await element.getAttribute('href');
          const name = await element.textContent();
          if (fullHref) {
            const urlObj = new URL(fullHref);
            if (urlObj.pathname.includes('/profile.php')) {
              const cleanUrl = `https://${urlObj.hostname}${urlObj.pathname}&id=${urlObj.searchParams.get('id')}`
              uniqueLinks.add(cleanUrl);
            } else {
              const cleanUrl = `https://${urlObj.hostname}${urlObj.pathname}`
              uniqueLinks.add(cleanUrl);
            }
          }
        }
      }
      if (uniqueLinks.size === previousLength) {
        break; // No new links found, probably reached the bottom
      }
      previousLength = uniqueLinks.size;

      await page.evaluate(() => {
        const element = document.querySelector('div.xb57i2i:nth-child(1)'); // Replace with your actual selector
        if (element) {
          element.scrollTop = element.scrollHeight; // Scrolls to the bottom
        }
      }
      );
      await page.waitForTimeout(1000);

    }
  }
  const profilesArray = Array.from(uniqueLinks);
  fs.writeFile('test3.txt', JSON.stringify(profilesArray, null, 2), (err) => {
    if (err) {
      console.error('Failed to write file', err);
    } else {
      console.log(`Saved data `);
    }
  });

})