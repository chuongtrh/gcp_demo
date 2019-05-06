const crypto = require('crypto');
const request = require('request');

exports.getBufferFromURL = (url) => new Promise((resolve, reject) => {
    request.defaults({
        encoding: null
    }).get(url, (err, res, body) => {
        if (err) {
            return reject(err);
        } else {
            return resolve(body);
        }
    });
});

exports.hashSHA256 = (obj) => {
    const hashSHA256Obj = crypto.createHash('sha256');
    hashSHA256Obj.update(obj);
    return hashSHA256Obj.digest('hex');
};