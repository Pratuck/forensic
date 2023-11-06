import { chromium, test } from 'playwright/test';
import { writeFile } from 'fs/promises';
test("post test", async()=>{
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
  
    // Set of collected links to avoid duplicates
    const collectedLinks = new Set();
    try {
        // Continue scrolling until a certain condition is met (e.g., no new links found)
        let previousLength = 0;
        while (true) {
          // Wait for the page to load (you may need to adjust this)
          await page.waitForSelector('a', { timeout: 5000 }); // Adjust timeout as needed
    
          // Retrieve the links
          const links = await page.$$eval('a', (as) => as.map(a => a.href));
          links.forEach(link => { if (link.startsWith('https://web.facebook.com/permalink.php')) {
            collectedLinks.add(link);
          }});
    
          // Compare the length to see if new links were added
          if (collectedLinks.size === previousLength) {
            // No new links found on this scroll, maybe end the loop
            break;
          }
          previousLength = collectedLinks.size;
    
          // Scroll down
          await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
          
          // Wait for any lazy-loaded content to load
          await page.waitForTimeout(1000); // Adjust timeout as needed
        }
      } catch (error) {
        // Handle any errors (e.g., selector not found)
        console.error('An error occurred:', error);
      }
    
      // Output the links
      console.log(Array.from(collectedLinks));
      const arrayLinks = Array.from(collectedLinks);
      const fileContent = arrayLinks.join('\n'); // Each link on a new line
      await writeFile('links.txt', fileContent);
    
})