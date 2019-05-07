const {
    Storage
} = require('@google-cloud/storage');

const storage = new Storage({
    projectId: 'balmy-channel-211708',
    keyFilename: './key/54d7f39f4e4a.json'
});
const bucketName = 'red-pdf'

async function uploadPdf(buffer, filename) {

    console.log(`Upload file ${filename}.`);
    const bucket = await storage.bucket(bucketName);
    const file = await bucket.file(filename);

    return new Promise((resolve, reject) => {
        const stream = file.createWriteStream({
            metadata: {
                contentType: 'application/pdf',
                cacheControl: 'no-cache',
            }
        });
        stream.on('error', (err) => {
            reject(err);
        });
        stream.on('finish', () => {
            var url = getPublicUrl(filename);
            file.makePublic()
                .then(_ => {
                    console.log(`Uploaded to ${url}`);
                    resolve(url);
                })
                .catch(err => reject(err));
        });
        stream.end(buffer);
    });
}

async function uploadImage(buffer, filename) {

    console.log(`Upload file ${filename}.`);
    const bucket = await storage.bucket(bucketName);
    const file = await bucket.file(filename);

    return new Promise((resolve, reject) => {
        const stream = file.createWriteStream({
            metadata: {
                contentType: 'image/jpeg',
                cacheControl: 'no-cache',
            }
        });
        stream.on('error', (err) => {
            reject(err);
        });
        stream.on('finish', () => {
            var url = getPublicUrl(filename);
            file.makePublic()
                .then(_ => {
                    console.log(`Uploaded to ${url}`);
                    resolve(url);
                })
                .catch(err => reject(err));
        });
        stream.end(buffer);
    });
}
function getPublicUrl(filename) {
    return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}

module.exports.uploadPdf = uploadPdf;
module.exports.uploadImage = uploadImage;