import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import createLiker from './neo4j_server/createNode.mjs';
import createPosterAccount from './neo4j_server/createNode.mjs';
import returnAll from './neo4j_server/createNode.mjs';
import dotenv from 'dotenv';
import { firefox } from 'playwright';
dotenv.config();

const app = express();
const port = 5000;

app.use(bodyParser.json());


// Allow requests from your React app's domain (replace with your React app's URL)
const allowedOrigins = ['http://localhost:3000'];

//this support server&web cooperative
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

//this is for testing 
app.post('/api/process', (req, res) => {
  const { inputValue } = req.body;
  const response = { result: inputValue };

  // Send the response as a JSON object
  res.status(200).json(response);
});


//get user info
app.post('/api/scrape/info', async (req, res) => {
  const  url  = await req.body.inputValue;
  const browser =await firefox.launch({
    headless: false,
});
  const context=await browser.newContext();
  const page = await context.newPage(); 
  
  try {
    await page.goto(url); 
  await page.getByRole('textbox', { name: 'Email address or phone number' }).click();
  await page.getByRole('textbox', { name: 'Email address or phone number' }).fill(process.env.FACEBOOK_USER);
  await page.locator('#login_popup_cta_form').getByRole('textbox', { name: 'Password' }).click();
  await page.locator('#login_popup_cta_form').getByRole('textbox', { name: 'Password' }).fill(process.env.FACEBOOK_PASS);
  await page.locator('#login_popup_cta_form').getByLabel('Accessible login button').click();
  const TargetInfo=await page.innerText('//div[@class="x9f619 x1n2onr6 x1ja2u2z x78zum5 x2lah0s x1qughib x1qjc9v5 xozqiw3 x1q0g3np x1pi30zi x1swvt13 xyamay9 xykv574 xbmpl8g x4cne27 xifccgj"]')
  const response= {result:TargetInfo}
  res.status(200).json(response)
}catch (err){
    console.log(err);
    res.status(500).json({ error: 'Scraping failed' });
  } finally {
    await browser.close(); // Make sure to close the browser
  }
});



//this get all the post links, this is for testing if everything seems right this will be add to one api
app.get('/api/scrape/posts', async (req, res) => {
  const  url  = await req.query.inputValue;
  const browser = await firefox.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  const uniqueLinks = new Set();
  //do sse naja
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  try {
    await page.goto(url);
    await page.getByRole('textbox', { name: 'Email address or phone number' }).click();
    await page.getByRole('textbox', { name: 'Email address or phone number' }).fill(process.env.FACEBOOK_USER);
    await page.locator('#login_popup_cta_form').getByRole('textbox', { name: 'Password' }).click();
    await page.locator('#login_popup_cta_form').getByRole('textbox', { name: 'Password' }).fill(process.env.FACEBOOK_PASS);
    await page.locator('#login_popup_cta_form').getByLabel('Accessible login button').click();
    await page.waitForLoadState('networkidle');
    let previousLength = 0;
  
    while (true) {
      const elements = await page.$$('a[href="#"]');
      if (elements.length === 0) break; // If no such elements, exit the loop
      
      for (const element of elements) {
        if (await element.isVisible()) {
          await element.hover();
          await page.waitForTimeout(5000); 
          // Get the new href attribute
          const fullHref = await element.getAttribute('href');
          const postTime= await page.locator('//span[@class="x193iq5w xeuugli x13faqbe x1vvkbs x10flsy6 x1nxh6w3 x1sibtaa xo1l8bm xzsf02u x1yc453h"]').allTextContents()
          if (fullHref && fullHref !== '#') {
            // Parse the URL and process it based on its structure
            const urlObj = new URL(fullHref);
            let cleanUrl = '';
            if (urlObj.pathname.includes('/posts/')) {
              // Extract the part of the URL before any query parameters
              cleanUrl = `https://${urlObj.hostname}${urlObj.pathname}`;
            } else if (urlObj.pathname.includes('/permalink.php')) {
              // Reconstruct the URL with only the desired query parameters
              cleanUrl = `https://${urlObj.hostname}${urlObj.pathname}?story_fbid=${urlObj.searchParams.get('story_fbid')}&id=${urlObj.searchParams.get('id')}`;
            }

            if (cleanUrl) {
              uniqueLinks.add(
                {postLink:cleanUrl,
                timeStamp:postTime,
                });
                res.write(`data: ${JSON.stringify({ post: cleanUrl, postTime: postTime })}\n\n`);
            }
          }
        }
      }
      if(uniqueLinks.size>=10){
        break;
      }
      if (uniqueLinks.size === previousLength) {
        break; // No new links found, probably reached the bottom
      }
      previousLength = uniqueLinks.size;

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000); // Wait for lazy-loaded content
    }
    // const results = Array.from(uniqueLinks).map(e => ({ post: e.postLink,postTime:e.timeStamp}));
    // res.status(200).json({ profileUrl: url, posts: results });
    res.end()
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Scraping failed', details: error.message });
  } finally {
    await browser.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});