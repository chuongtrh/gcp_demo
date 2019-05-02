const modofun = require('modofun');
const cors = require('cors')
const pdf = require('./src/pdf');


exports.pdf = modofun(pdf, {
    type: 'gcloud',
    mode: 'reqres',
    middleware: [cors()],
    errorHandler: (err, req, res) => res.status(500).send(err.message)
})
