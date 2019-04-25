'use strict';

import routes from './src/routes';
import models from './src/models';

var errorHandler;

if (process.env.NODE_ENV === 'production') {
    require('@google/cloud-trace').start();
    errorHandler = require('@google/cloud-errors').start();
}


var express = require('express');
var bodyParser = require('body-parser');
var app = express();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use('/api', function (req, res, next) {
    var IP = req.headers['x-forwarded-for'] || "192.168.1.1";

    req.info = {
        logHeader: {
            method: req.method,
            url: req.originalUrl,
            detail: req.headers
        },
        clientIP: IP.substring(0, IP.indexOf(':')) || IP,
        domainURL: req.headers.origin,
        userAgent: req.headers['user-agent']
    };

    req.context = {
        models,
        me: models.users[1],
    };

    next();
});

app.use('/api/users', routes.user);
app.use('/api/messages', routes.message);


// Error handler for API issues
app.use('/api', function (err, request, response, next) {

    if (process.env.NODE_ENV === 'local') {
        console.log('uncaughtException', err);
    }

    return response.status(500).send({
        status: 'ERROR',
        errorCode: 1,
        message: String(err)
    });
});



// Basic error logger/handler
app.use(function (err, req, res, next) {
    res.status(500).send(err.message || 'Something broke!');
    next(err || new Error('Something broke!'));
});
if (process.env.NODE_ENV === 'production') {
    app.use(errorHandler.express);
}

// Start the server
var server = app.listen(process.env.PORT || 4300, function () {
    var port = server.address().port;
    console.log('App listening on port %s', port);
    console.log('Press Ctrl+C to quit.');
});

process.on('uncaughtException', function (err) {

    if (process.env.NODE_ENV === 'local') {
        console.log('uncaughtException', err);
    }
})

process.on('SIGINT', function () {
    process.exit(0);
    console.log('process.exit');
});

module.exports = app;