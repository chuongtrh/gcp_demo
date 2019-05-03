const router = module.exports = require('express').Router();
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const request = require('request-promise');

router.get('/create', (req, res, next) => {
    
    var isPaid = parseInt(req.query.isPaid) === 1;

    var dataBinding = {
        items: [{
                name: "item 1",
                price: 100
            },
            {
                name: "item 2",
                price: 200
            },
            {
                name: "item 3",
                price: 300
            }
        ],
        total: 600,
        isPaid
    }

    var templateHtml = fs.readFileSync(path.join(process.cwd(), 'src', 'assets', 'templates', 'invoice.html'), 'utf8');
    var template = handlebars.compile(templateHtml);
    var finalHtml = template(dataBinding);
    var options = {
        format: 'A4',
        headerTemplate: "<p></p>",
        footerTemplate: "<p></p>",
        displayHeaderFooter: false,
        margin: {
            top: "40px",
            bottom: "100px"
        },
        printBackground: true,
    }

    request({
            method: 'POST',
            uri: `${process.env.HOST_CLOUDFUNCTION}/pdf/create`,
            body: {
                options,
                finalHtml,
                isRemoteContent: false
            },
            json: true
        })
        .then(function (data) {
            // POST succeeded...
            return res.status(200).send({
                status: 'Ok',
                code: 0,
                url: data.url,
                hash: data.hash
            });
        })
        .catch(function (err) {
            return next(err);
        }); 
});

router.post('/sign', (req, res, next) => {
    
    var url = req.body.url;
    var signature = req.body.signature;
    var dataSources = [{
        page: 0,
        metadatas: [{
            offsetX: 0.7,
            offsetY: 0.5,
            width: 0.2,
            height: 0.2,
            type: 'image/jpeg',
            value: signature
        },
        {
            offsetX: 0.7,
            offsetY: 0.68,
            width: 0.45,
            height: 0.028,
            type: 'text',
            value: (new Date()).toISOString()
        }]
    }]
    

    request({
            method: 'POST',
            uri: `${process.env.HOST_CLOUDFUNCTION}/updatePDF/update`,
            body: {
                dataSources,
                url,
            },
            json: true
        })
        .then(function (data) {
            // POST succeeded...
            return res.status(200).send({
                status: 'Ok',
                code: 0,
                url: data.url,
                source: url,
                hash: data.hash
            });
        })
        .catch(function (err) {
            return next(err);
        }); 
});