const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const storage = require('./storage.service');
const uuidv4 = require('uuid')

let browser;

async function getNewPage() {
    if (!browser) {
        console.log('Launch new browser', chrome);
        browser = await puppeteer.launch({
            args: chrome.args,
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
        });
    }
    return browser.newPage();
}

async function generate(url) {

    const page = await getNewPage();
    var options = {
        format: 'A4',
        headerTemplate: "<p></p>",
        footerTemplate: "<p></p>",
        displayHeaderFooter: false,
        margin: {
            top: "60px",
            bottom: "40px"
        },
        printBackground: true
    }
    await page.goto(url);
    // await page.goto(url, {
    //     waitUntil: 'networkidle0',
    //     timeout: 20000
    // });

    const buffer = await page.pdf(options);
    console.log(`Generate pdf Ok ${url}`, buffer.length)

    page.close();

    return buffer;
}

async function create(options, finalHtml, isRemoteContent) {

    const page = await getNewPage();

    if (isRemoteContent === true) {
        await page.goto(`data:text/html,${finalHtml}`, {
            waitUntil: 'load',
            timeout: 60000
        });
    } else {
        await page.setContent(finalHtml);
    }

    const buffer = await page.pdf(options);
    console.log(`Create pdf Ok`, buffer.length);

    page.close();

    //Upload pdf file to google storage
    var filename = `${uuidv4()}.pdf`;
    var url = await storage.uploadPdf(buffer, filename);
    return {
        buffer,
        url
    };
}
module.exports = {
    generate,
    create
}