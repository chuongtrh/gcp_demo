const modofun = require('modofun');
const cors = require('cors')
const updatePDF = require('./src/updatePDF');

exports.updatePDF = modofun(updatePDF, {
    type: 'gcloud',
    mode: 'reqres',
    middleware: [cors()],
    errorHandler: (err, req, res) => res.status(500).send(err.message)
})
