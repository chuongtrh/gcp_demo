const puppeteer = require('../../node_modules/puppeteer');
const storage = require('./storage.service');
const uuidv4 = require('../../node_modules/uuid')
const helper = require('../utils/helper');

let browser;

async function getNewPage() {
    if (!browser) {
        console.log('Launch new browser');
        browser = await puppeteer.launch({
            args: ['--no-sandbox',
                '--headless',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
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
    await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 20000
    });

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
    return {buffer, url};
}
module.exports = {
    generate,
    create
}