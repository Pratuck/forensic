import { firefox, test } from "playwright/test"
import * as fs from 'fs';


test.setTimeout(120000)
test("scrape likers", async () => {
    const browser = await firefox.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    const uniqueLinks = new Set();
    let previousLength = 0;
    page.goto("https://www.facebook.com/permalink.php?story_fbid=122117440310061810&id=61551854310961")
    // await page.getByRole('textbox', { name: 'Email address or phone number' }).click();
    // await page.getByRole('textbox', { name: 'Email address or phone number' }).fill("6322770817@g.siit.tu.ac.th");
    // await page.locator('#login_popup_cta_form').getByRole('textbox', { name: 'Password' }).click();
    // await page.locator('#login_popup_cta_form').getByRole('textbox', { name: 'Password' }).fill("test1212312121test");
    // await page.locator('#login_popup_cta_form').getByLabel('Accessible login button').click();


    // await page.getByPlaceholder('Email or phone').click();
    // await page.getByPlaceholder('Email or phone').fill('6322770817@g.siit.tu.ac.th');
    // await page.getByPlaceholder('Password').click();
    // await page.getByPlaceholder('Password').fill('test1212312121test');
    // await page.getByLabel('Accessible login button').click();
    await page.waitForLoadState('networkidle');
    const text=page.locator('(//div[@dir="auto"])[1]')
    const links=await page.$$('(//div[@dir="auto"])[1]//a')
    const comments=await page.$$('//div[@class="x1y1aw1k xn6708d xwib8y2 x1ye3gou"]')

    console.log(await text.allTextContents())
    if (links.length!==0){
        for (const link of links){
            const resultLink=await link.getAttribute("href")
            console.log(`it contains link ${resultLink}`)
        }
    }
    if (comments.length!==0){
        for (const comment of comments){
            try{
            const commentHead=await comment.$('//span[@class="xt0psk2"]//a')
            const commentId=await commentHead?.getAttribute("href")
            const commentContent=await comment.$('//div[@class="xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs"]')
            const commentText=await commentContent?.textContent()
            console.log(`the comment Id is ${commentId}`)
            console.log(`the text content is ${commentText}`)
            }catch(err){
                console.log(err)
            }

        }
    }


})