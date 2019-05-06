'use strict';

const fs = require('fs');
const path = require('path');
const routes = require('./src/routes');
const models = require('./src/models');

if (process.argv[2]){
    process.env.NODE_ENV = process.argv[2];
}
//Load local.js
if (process.env.NODE_ENV === 'local' && fs.existsSync(path.join(__dirname, './src/config/local.js'))) {
    console.log('Setup local env')
    require('./src/config/local.js')
} 

//Setup version
if (fs.existsSync(path.join(__dirname, '.version'))) {
    const version = fs.readFileSync(path.join(__dirname, '.version'));
    process.env.BUILD_VERSION = version;
}else{
    process.env.BUILD_VERSION = 'n/a';    
}

var errorHandler;
if (process.env.NODE_ENV === 'production') {
    require('@google/cloud-trace').start();
    errorHandler = require('@google/cloud-errors').start();
}

const helmet = require('helmet')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/liveness_check', function(req, res) {
    return res.status(200).send();
});

app.use('/readiness_check', function(req, res) {
    return res.status(200).send();
});

app.use('/version', function (req, res) {
    return res.status(200).send({
        status: 'running',
        env: process.env.NODE_ENV,
        port: process.env.RUN_PORT,
        version: process.env.BUILD_VERSION,
        env_variables: JSON.stringify(process.env, null, 2)
    })
});

app.use('/', function(req, res, next) {
    if(req.url === '/'){
        return res.status(200).send();
    }else{
        next();
    }
});

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

app.use('/api/ping', routes.ping);
app.use('/api/users', routes.user);
app.use('/api/messages', routes.message);
app.use('/api/invoice', routes.invoice);

// Error handler for API issues
app.use('/api', function (err, req, res, next) {

    if (process.env.NODE_ENV === 'local') {
        console.log('uncaughtException', err);
    }

    return res.status(500).send({
        status: 'ERROR',
        code: 1,
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
var server = app.listen(process.env.RUN_PORT, function () {
    var port = server.address().port;
    console.log(`App listening on port:${port} NODE_ENV:${process.env.NODE_ENV}, port:${process.env.RUN_PORT}`);
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