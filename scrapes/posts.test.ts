import { chromium, test } from 'playwright/test';

test('post test', async () => {
  const browser = await chromium.launch({
    headless: false, // Set to true if you don't need a GUI
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://web.facebook.com/profile.php?id=61551854310961');
  // Replace these selectors with the correct ones for Facebook
  await page.getByRole('textbox', { name: 'Email address or phone number' }).fill('6322770817@g.siit.tu.ac.th');
  await page.locator('#login_popup_cta_form').getByRole('textbox', { name: 'Password' }).fill('pkP1212312121Pkp');
  await page.locator('#login_popup_cta_form').getByLabel('Accessible login button').click();
  await page.waitForLoadState('networkidle');

  const posts = await page.locator('a')
  const postCount = await posts.count();

  console.log(postCount);
  console.log(await posts.getAttribute('href'))
});

// test('post test', async () => {
//     const browser = await chromium.launch({
//       headless: false, // Set to true if you don't need a GUI
//     });
//     const context = await browser.newContext();
//     const page = await context.newPage();
//     await page.goto('https://web.facebook.com/profile.php?id=61551854310961');
//     // Replace these selectors with the correct ones for Facebook
//     await page.getByRole('textbox', { name: 'Email address or phone number' }).click();
//     await page.getByRole('textbox', { name: 'Email address or phone number' }).fill('6322770817@g.siit.tu.ac.th');
//     await page.locator('#login_popup_cta_form').getByRole('textbox', { name: 'Password' }).click();
//     await page.locator('#login_popup_cta_form').getByRole('textbox', { name: 'Password' }).fill('pkP1212312121Pkp');
//     await page.locator('#login_popup_cta_form').getByLabel('Accessible login button').click();
//     await page.waitForLoadState('networkidle');


// })

// import { test, expect } from '@playwright/test';
