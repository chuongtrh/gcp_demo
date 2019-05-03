const crypto = require('crypto');

exports.getBufferFromURL = (url) => new Promise((resolve, reject) => {
    require('request').defaults({
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