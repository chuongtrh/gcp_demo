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
            uri: 'http://localhost:8010/balmy-channel-211708/asia-northeast1/pdf/create',
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
                url: data.url
            });
        })
        .catch(function (err) {
            return next(err);
        }); 
});