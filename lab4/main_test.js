const puppeteer = require('puppeteer');

(async () => {
    //開啟GOOGLE瀏覽器+新分頁+設定視窗大小
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1024 });

    //前往指定網址+等待指定元素出現+點擊指定元素
    await page.goto('https://pptr.dev/');
    await page.waitForSelector('.DocSearch-Button'); 
    await page.click('.DocSearch-Button'); 
   
    //輸入搜索內容0.05秒/字+等待搜索結果出現+點擊搜索結果
    const searchInputSelector = '#docsearch-input';
    await page.waitForSelector(searchInputSelector);
    await page.type(searchInputSelector, 'chipi chipi chapa chapa', {delay: 50});

    //點擊第五個搜索结果
    const searchResultSelector = '#docsearch-item-5 > a > div > div.DocSearch-Hit-content-wrapper > span.DocSearch-Hit-path';
    await page.waitForSelector(searchResultSelector);
    await page.click(searchResultSelector, {delay: 3000});
    
    //等待指定元素出現
    const titleSelector = 'h1';
    await page.waitForSelector(titleSelector, {delay: 1000});
    await page.click(titleSelector);

    // 使用 page.$eval() 方法來找到指定元素並獲取其內容
    const title = await page.$eval(titleSelector, element => element.textContent);
    console.log(title);

    await browser.close();
})();
