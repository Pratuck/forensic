import { test as setup, expect } from 'playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('https://www.facebook.com/');
  await page.getByTestId('royal_email').click();
  await page.getByTestId('royal_email').fill('6322770817@g.siit.tu.ac.th');
  await page.getByTestId('royal_pass').click();
  await page.getByTestId('royal_pass').fill('abc1212312121abc');
  await page.getByTestId('royal_login_button').click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
//   await page.waitForURL('https://www.facebook.com/');
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  await page.waitForLoadState('networkidle');

  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});