import {firefox,test} from "playwright/test"
test("comment",async ()=>{
    const browser =await firefox.launch({
        headless: false
    });
    const context=await browser.newContext();
    const page=await context.newPage();
    await page.goto('https://web.facebook.com/pongsapon');
    await page.getByRole('textbox', { name: 'Email address or phone number' }).click();
    await page.getByRole('textbox', { name: 'Email address or phone number' }).fill('6322770817@g.siit.tu.ac.th');
    await page.locator('#login_popup_cta_form').getByRole('textbox', { name: 'Password' }).click();
    await page.locator('#login_popup_cta_form').getByRole('textbox', { name: 'Password' }).fill('pkP1212312121Pkp');
    
    
})