const path = require("path");
const helper = require('./helper');
const streams = require('memory-streams');
const hummus = require('hummus');
const storage = require('./storage');
const uuidv4 = require('uuid');


function addImageControlToPDF(pdfWriter, pageModifier, pageInfo, ctrl) {

    var {
        pageHeight
    } = pageInfo;

    var imageData = ctrl.value.split(',')[1];
    var imageBuffer = new Buffer.from(imageData, 'base64');
    var imageStream = new hummus.PDFRStreamForBuffer(imageBuffer);

    var imageXObject;
    if(ctrl.type.includes('jpg') || ctrl.type.includes('jpeg')){
        imageXObject = pdfWriter.createImageXObjectFromJPG(imageStream);
    }else if(ctrl.type.includes('png')){
        imageXObject = pdfWriter.createImageXObjectFromPNG(imageStream);
    }
    
    let context = pageModifier.startContext().getContext();

    context.q()
        .cm(ctrl.width, 0, 0,
            ctrl.height,
            ctrl.offsetX,
            pageHeight - ctrl.offsetY - ctrl.height)
        .doXObject(imageXObject)
        .Q();
    pageModifier.endContext();
}

function addTextControlToPDF(pdfWriter, pageModifier, pageInfo, ctrl) {

    var {
        pageHeight
    } = pageInfo;

    var textOptions = ctrl.textOptions;

    var textDimensions = textOptions.font.calculateTextDimensions(ctrl.value, textOptions.size);

    let context = pageModifier.startContext().getContext();

    context.writeText(ctrl.value,
        textOptions.isCenter ? (ctrl.offsetX + (ctrl.width - textDimensions.width) / 2) : ctrl.offsetX,
        pageHeight - ctrl.offsetY - textDimensions.height,
        textOptions);

    pageModifier.endContext();

}

function modifyPDF(url, dataSources) {

    return helper.getBufferFromURL(url)
        .then(buffer => {
            // Load pdf, font. Create Writer and Reader
            let outStream = new streams.WritableStream();
            let pdfWriter = hummus.createWriterToModify(new hummus.PDFRStreamForBuffer(buffer), new hummus.PDFStreamForResponse(outStream));

            var pathFont = path.join(process.cwd(), 'fonts', 'arial.ttf');
            var arialFont = pdfWriter.getFontForFile(pathFont);
            let pdfReader = hummus.createReader(new hummus.PDFRStreamForBuffer(buffer));

            var textOptions = {
                font: arialFont,
                size: 9,
                colorspace: 'gray',
                color: 0x00,
                isCenter: false
            }

            dataSources.forEach(dataSource => {
                // Edit pdf page by page
                var page = dataSource.page;
                var pageWidth = pdfReader.parsePage(Number(page)).getMediaBox()[2];
                var pageHeight = pdfReader.parsePage(Number(page)).getMediaBox()[3];
                const pageModifier = new hummus.PDFPageModifier(pdfWriter, Number(page), true);

                dataSource.metadatas.forEach(metadata => {

                    //Transform position & size
                    /* jshint ignore:start */
                    let tempMetadata = {
                        ...metadata,
                        width: Number(metadata.width * pageWidth),
                        height: Number(metadata.height * pageHeight),
                        offsetX: metadata.offsetX * pageWidth,
                        offsetY: metadata.offsetY * pageHeight,
                        textOptions
                    }
                    /* jshint ignore:end */
                    if (tempMetadata.type.includes('image')) {
                        addImageControlToPDF(pdfWriter, pageModifier, {
                            pageWidth,
                            pageHeight
                        }, tempMetadata);
                    } else if (tempMetadata.type === 'text') {
                        addTextControlToPDF(pdfWriter, pageModifier, {
                            pageWidth,
                            pageHeight
                        }, tempMetadata);
                    }
                });
                pageModifier.endContext().writePage();
                // End edit page
            });

            // End edit pdf
            pdfWriter.end();
            outStream.end();
            return outStream.toBuffer();
        })
}

function update(req, res) {
    
    var url = req.body.url;
    var dataSources = req.body.dataSources;
    
    return modifyPDF(url, dataSources)
        .then(buffer => {
            //Upload pdf file to google storage
            var filename = `${uuidv4()}.pdf`;
            storage.uploadPdf(buffer, filename)
                .then(url => {
                    return res.status(200).json({
                        status: 'Ok',
                        code: 0,
                        length: buffer.length,
                        url
                    })
                })
        })
}

module.exports = {
    update
}