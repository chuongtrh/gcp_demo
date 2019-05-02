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