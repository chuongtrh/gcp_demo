const crypto = require('crypto');

exports.hashSHA256 = (obj) => {
    const hashSHA256Obj = crypto.createHash('sha256');
    hashSHA256Obj.update(obj);
    return hashSHA256Obj.digest('hex');
};