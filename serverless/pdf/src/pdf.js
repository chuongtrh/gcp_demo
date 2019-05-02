const puppeteer = require('puppeteer');
const storage = require('./storage');
const uuidv4 = require('uuid')

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
    await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 20000
    });
    const buffer = await page.pdf(options);
    console.log(`Generate pdf Ok ${url}`, buffer.length)

    res.status(200).json({
        status: 'Ok',
        code: 0,
        length: buffer.length
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

    await page.close();
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
            timeout: 60000
        });
    } else {
        await page.setContent(finalHtml);
    }

    const buffer = await page.pdf(options);
    console.log(`Create pdf Ok`, buffer.length)

    //Upload pdf file to google storage
    var filename = `${uuidv4()}.pdf`;
    var url = await storage.uploadPdf(buffer, filename);
    res.status(200).json({
        status: 'Ok',
        code: 0,
        length: buffer.length,
        url
    })

    await page.close();
}
module.exports = {
    generate,
    create
}