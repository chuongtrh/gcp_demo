const router = module.exports = require('../../node_modules/express').Router();

const helper = require('../utils/helper');
const pdfService = require('../services/pdf.service');
const modifyPDFService = require('../services/modifyPDF.service');

router.get('/generate', async (req, res) => {
    const url = req.query.url
    var buffer = await pdfService.generate(url);
    return res.status(200).json({
        status: 'Ok',
        code: 0,
        length: buffer.length,
        hash: helper.hashSHA256(buffer)
    })
});

router.post('/create', async (req, res) => {
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

    var {buffer, url} = await pdfService.create(options, finalHtml, isRemoteContent);

    return res.status(200).json({
        status: 'Ok',
        code: 0,
        length: buffer.length,
        url,
        hash: helper.hashSHA256(buffer)
    })

});

router.post('/update', (req, res, next) => {
    var url = req.body.url;
    var dataSources = req.body.dataSources;

    return modifyPDFService.modify(url, dataSources)
    .then(_output => {
        return res.status(200).json({
            status: 'Ok',
            code: 0,
            length: _output.buffer.length,
            url: _output.url,
            hash: helper.hashSHA256(_output.buffer)
        })
    })
    .catch(err => next(err));
});