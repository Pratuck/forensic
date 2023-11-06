import {firefox,test} from "playwright/test"
test("User info",async ()=>{
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
    await page.locator('#login_popup_cta_form').getByLabel('Accessible login button').click();
    const TargetInfo=await page.innerText('//div[@class="x9f619 x1n2onr6 x1ja2u2z x78zum5 x2lah0s x1qughib x1qjc9v5 xozqiw3 x1q0g3np x1pi30zi x1swvt13 xyamay9 xykv574 xbmpl8g x4cne27 xifccgj"]')
    
})