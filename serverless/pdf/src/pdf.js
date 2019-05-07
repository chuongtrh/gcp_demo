const puppeteer = require('puppeteer');
const storage = require('./storage');
const uuidv4 = require('uuid')
const helper = require('./helper');

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

async function screenshot(req, res) {
    const url = req.query.url

    console.log(`Screenshot pdf from ${url}`)

    const page = await getNewPage();

    await page.goto(url);

    const buffer = await page.screenshot({
        fullPage: true,
        type: 'jpeg',
        quality: 80
    });
    console.log(`Screenshot Ok ${url}`, buffer.length)

    page.close();

    //Upload pdf file to google storage
    var filename = `${uuidv4()}.jpeg`;
    var uploadURL = await storage.uploadImage(buffer, filename);
    res.status(200).json({
        status: 'Ok',
        code: 0,
        length: buffer.length,
        url:uploadURL
    })
}

async function generate(req, res) {
    const url = req.query.url

    console.log(`Generate pdf from ${url}`)

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

    const buffer = await page.pdf(options);
    console.log(`Generate pdf Ok ${url}`, buffer.length)

    page.close();

    return res.status(200).json({
        status: 'Ok',
        code: 0,
        length: buffer.length,
        hash: helper.hashSHA256(buffer)
    })

    //Upload pdf file to google storage
    // var filename = `${uuidv4()}.pdf`;
    // var uploadURL = await storage.uploadPdf(buffer, filename);
    // res.status(200).json({
    //     status: 'Ok',
    //     code: 0,
    //     length: buffer.length,
    //     url:uploadURL
    // })
}
async function create(req, res) {
    const options = req.body.options;
    const finalHtml = req.body.finalHtml;
    const isRemoteContent = req.body.isRemoteContent || false;

    if (!options || !finalHtml) {
        return res.status(200).json({
            error: {
                status: 'ERROR',
                code: 1
            }
        })
    }

    const page = await getNewPage();

    if (isRemoteContent === true) {
        await page.goto(`data:text/html,${finalHtml}`, {
            waitUntil: 'load',
            timeout: 10000
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
    
    return res.status(200).json({
        status: 'Ok',
        code: 0,
        length: buffer.length,
        url,
        hash: helper.hashSHA256(buffer)
    })

}
module.exports = {
    generate,
    create,
    screenshot
}