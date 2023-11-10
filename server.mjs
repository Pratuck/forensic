import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import createLiker from './neo4j_server/createNode.mjs';
import createPosterAccount from './neo4j_server/createNode.mjs';
import returnAll from './neo4j_server/createNode.mjs';
import dotenv from 'dotenv';
import { firefox } from 'playwright';
import neo4j from 'neo4j-driver'
dotenv.config();

const app = express();
const port = 5000;

app.use(bodyParser.json());


// Allow requests from your React app's domain (replace with your React app's URL)
const allowedOrigins = ['http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);
app.options('*', cors()); // include before other routes


app.post('/api/create-neo4j-session', async (req, res) => {
  const driver = neo4j.driver(process.env.NEO4J_URL, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS))
  const projectName = req.body.projectName
  const session = driver.session({ database: process.env.NEO4J_DB })
  let projectTime = new Date(); 

  // Convert the Date object to an ISO 8601 string
  projectTime = projectTime.toISOString();

  try {
    // Make sure you have the rights to create a new database
    await session.run(
      `MERGE (:Project {projectname: $projectName,datetime: $projectTime})  `
      ,
      { "projectName": projectName, "projectTime": projectTime }
    )
    res.json({ message: ` '${projectName}' created successfully.` });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: `Error connecting  '${projectName}'.` });
  }
})


app.post('/api/scrape/info', async (req, res) => {
  const url = await req.body.inputValue;
  const browser = await firefox.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {

    await page.goto(url);
    await page.getByRole('textbox', { name: 'Email address or phone number' }).click();
    await page.getByRole('textbox', { name: 'Email address or phone number' }).fill(process.env.FACEBOOK_USER);
    await page.locator('#login_popup_cta_form').getByRole('textbox', { name: 'Password' }).click();
    await page.locator('#login_popup_cta_form').getByRole('textbox', { name: 'Password' }).fill(process.env.FACEBOOK_PASS);
    await page.locator('#login_popup_cta_form').getByLabel('Accessible login button').click();
    await page.waitForLoadState('networkidle');
    const TargetInfo = await page.innerText('//div[@class="x9f619 x1n2onr6 x1ja2u2z x78zum5 x2lah0s x1qughib x1qjc9v5 xozqiw3 x1q0g3np x1pi30zi x1swvt13 xyamay9 xykv574 xbmpl8g x4cne27 xifccgj"]')
    const response = { result: TargetInfo }
    res.status(200).json(response)
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Scraping failed' });
  } finally {
    await browser.close();

  }
});



//this get all the post links, this is for testing if everything seems right this will be add to one api
app.get('/api/scrape/posts', async (req, res) => {
  const url = req.query.inputValue;
  const browser = await firefox.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  const uniqueLinks = new Set();
  let limit = 0;
  const driver = neo4j.driver(process.env.NEO4J_URL, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS))
  const session = driver.session({ database: process.env.NEO4J_DB })
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
    await page.waitForTimeout(1000)
    await page.waitForLoadState('networkidle');
    let previousLength = 0;
    await page.waitForSelector("h1.x1heor9g")
    const profileName = await page.locator("h1.x1heor9g").textContent();
    while (true) {
      const elements = await page.$$('//div[@class="x1cy8zhl x78zum5 x1q0g3np xod5an3 x1pi30zi x1swvt13 xz9dl7a"]//a[@href="#"]');
      console.log("getting href...")
      if (elements.length === 0) break; // If no such elements, exit the loop

      for (const element of elements) {
        console.log("get first element...")
        if (await element.isVisible()) {
          await element.hover();
          await page.waitForTimeout(1000);
          // Get the new href attribute
          const fullHref = await element.getAttribute('href');
          await page.waitForSelector('//span[@class="x193iq5w xeuugli x13faqbe x1vvkbs x10flsy6 x1nxh6w3 x1sibtaa xo1l8bm xzsf02u x1yc453h"]')
          const postTime = await page.locator('//span[@class="x193iq5w xeuugli x13faqbe x1vvkbs x10flsy6 x1nxh6w3 x1sibtaa xo1l8bm xzsf02u x1yc453h"]').allTextContents()
          if (fullHref && fullHref !== '#') {
            // Parse the URL and process it based on its structure
            console.log("continueing")
            const urlObj = new URL(fullHref);
            let cleanUrl = '';
            if (urlObj.hostname === 'web.facebook.com') {
              urlObj.hostname = 'www.facebook.com';
            }
            if (urlObj.pathname.includes('/posts/')) {
              // Extract the part of the URL before any query parameters
              cleanUrl = `https://${urlObj.hostname}${urlObj.pathname}`;
        

            } else if (urlObj.pathname.includes('/permalink.php')) {
              // Reconstruct the URL with only the desired query parameters
              cleanUrl = `https://${urlObj.hostname}${urlObj.pathname}?story_fbid=${urlObj.searchParams.get('story_fbid')}&id=${urlObj.searchParams.get('id')}`;
            }

            if (cleanUrl&&limit <= 10) {
              console.log("state1")
              const urlObjInput = new URL(url);
              //if web use &id but with www use ?id
              if (urlObjInput.pathname.includes('/profile.php')) {
                console.log("state 1.1")
                const fixName = profileName.trim();
                const cleanedProfilUrl=`https://${urlObjInput.hostname}${urlObjInput.pathname}?id=${urlObjInput.searchParams.get('id')}`
                try{
                await session.run(
                  `
                  MERGE (p:Post {postUrl: $cleanUrl, datetime: $postTime})
                  MERGE (a:Account {profileUrl: $cleanedProfilUrl})
                    ON CREATE SET a.username = $fixName
                  MERGE (a)-[:POSTED]->(p)
                    `
                  ,
                  { "cleanUrl": cleanUrl, "postTime": postTime, "fixName": fixName, "cleanedProfilUrl": cleanedProfilUrl }
                )
                }catch(err){
                  console.log(err)
                }
              }else{
                console.log(urlObjInput.pathname)
                console.log("state 1.2")
                const cleanedProfilUrl=`https://${urlObjInput.hostname}${urlObjInput.pathname}`
                const fixName = profileName.trim();
                try{
                await session.run(
                  `
                  MERGE (p:Post {postUrl: $cleanUrl, datetime: $postTime})
                  MERGE (a:Account {profileUrl: $cleanedProfilUrl})
                    ON CREATE SET a.username = $fixName
                  MERGE (a)-[:POSTED]->(p)
                   `
                  ,
                  { "cleanUrl": cleanUrl, "postTime": postTime, "fixName": fixName, "cleanedProfilUrl": cleanedProfilUrl }
                )}catch(err){
                  console.log(err)
                }
              }
              console.log("state1.5")
              //maybe doing some post scrape here, hopefully it will work ;D
              try{
                console.log("state2")
                const pageLiker = await context.newPage();
                const uniqueLikerLinks = new Set();
                let previousLengthLiker = 0;
                pageLiker.goto(cleanUrl)
                await pageLiker.waitForLoadState('networkidle');
                const exists = await pageLiker.$$('//div[@class="x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1n2onr6 x87ps6o x1lku1pv x1a2a7pz x1heor9g xnl1qt8 x6ikm8r x10wlt62 x1vjfegm x1lliihq"]');
                if (exists.length !== 0) {
                  const allReactionsButtonLocator = pageLiker.locator('//div[@class="x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1n2onr6 x87ps6o x1lku1pv x1a2a7pz x1heor9g xnl1qt8 x6ikm8r x10wlt62 x1vjfegm x1lliihq"]');
                  await allReactionsButtonLocator.click();
                  // await pageLiker.locator('//@div[class="xb57i2i x1q594ok x5lxg6s x78zum5 xdt5ytf x6ikm8r x1ja2u2z x1pq812k x1rohswg xfk6m8 x1yqm8si xjx87ck xx8ngbg xwo3gff x1n2onr6 x1oyok0e x1odjw0f x1e4zzel x1tbbn4q x1y1aw1k x4uap5 xwib8y2 xkhd6sd]"')
                  await pageLiker.waitForSelector('//div[@class="x6s0dn4 xkh2ocl x1q0q8m5 x1qhh985 xu3j5b3 xcfux6l x26u7qi xm0m39n x13fuv20 x972fbf x9f619 x78zum5 x1q0g3np x1iyjqo2 xs83m0k x1qughib xat24cr x11i5rnm x1mh8g0r xdj266r x2lwn1j xeuugli x18d9i69 x4uap5 xkhd6sd xexx8yu x1n2onr6 x1ja2u2z"]')
                  while (true) {
                    const elements = await pageLiker.$$('//div[@class="x6s0dn4 xkh2ocl x1q0q8m5 x1qhh985 xu3j5b3 xcfux6l x26u7qi xm0m39n x13fuv20 x972fbf x9f619 x78zum5 x1q0g3np x1iyjqo2 xs83m0k x1qughib xat24cr x11i5rnm x1mh8g0r xdj266r x2lwn1j xeuugli x18d9i69 x4uap5 xkhd6sd xexx8yu x1n2onr6 x1ja2u2z"]//a');
                    if (elements.length === 0) break;
                    for (const element of elements) {
                      if (await element.isVisible()) {
                        const fullHref = await element.getAttribute('href');
                        const profileName = await element.textContent();
                        if (fullHref) {
                          const urlObj = new URL(fullHref);
                          if (urlObj.hostname === 'web.facebook.com') {
                            urlObj.hostname = 'www.facebook.com';
                          }
                          if (urlObj.pathname.includes('/profile.php')) {
                            const cleanLikerUrl = `https://${urlObj.hostname}${urlObj.pathname}?id=${urlObj.searchParams.get('id')}`
                            uniqueLikerLinks.add(cleanUrl);
                          
                            await session.run(
                            `MATCH (p:Post {postUrl: $cleanUrl})
                             MERGE (a:Account {profileUrl:$cleanLikerUrl})
                                 ON CREATE SET a.username = $profileName
                             MERGE (a)-[:REACTED]->(p)`
                            ,
                            { "cleanUrl": cleanUrl.replace(/ /g,''), "profileName": profileName, "cleanLikerUrl": cleanLikerUrl.replace(/ /g,'') }
                          )
                          } else {
                            const cleanLikerUrl = `https://${urlObj.hostname}${urlObj.pathname}`
                            uniqueLikerLinks.add(cleanUrl);
                            await session.run(
                            `MATCH (p:Post {postUrl: $cleanUrl})
                             MERGE (a:Account {profileUrl:$cleanLikerUrl})
                                 ON CREATE SET a.username = $profileName
                             MERGE (a)-[:REACTED]->(p)`
                            ,
                            { "cleanUrl": cleanUrl, "profileName": profileName, "cleanLikerUrl": cleanLikerUrl }
                          )
                        }
                      }
                    }
                  }
                  if (uniqueLikerLinks.size === previousLengthLiker) {
                    break; // No new links found, probably reached the bottom
                  }
                  previousLengthLiker = uniqueLikerLinks.size;

                  await pageLiker.evaluate(() => {
                    const element = document.querySelector('div.xb57i2i:nth-child(1)'); //this is the liker frame
                    if (element) {
                      element.scrollTop = element.scrollHeight; // Scrolls to the bottom
                    }
                  }
                  );
                  await pageLiker.waitForTimeout(1000);

                }
                await pageLiker.close()
              }else{
                console.log("No liker")
              }}catch(err){
                console.log(err)
              }




              //end of liker 
              uniqueLinks.add(
                {
                  postLink: cleanUrl,
                  timeStamp: postTime,
                });
              limit++;
              res.write(`data: ${JSON.stringify({ post: cleanUrl, postTime: postTime })}\n\n`);
            } else {
              res.write(`data: ${JSON.stringify({ post: "done", postTime: "-----------" })}\n\n`);
              res.end()
            }
          }
        }
      }

      if (uniqueLinks.size === previousLength) {
        break; // No new links found, probably reached the bottom
      }
      previousLength = uniqueLinks.size;

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000); // Wait for lazy-loaded content
    }

    res.end()
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Scraping failed', details: error.message });
    } else {
      // If we've already started streaming, just end the stream.
      res.end();
    }
  } finally {
    await browser.close();
    await session.close();

  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});