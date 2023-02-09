"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageBufferToPdfBuffer = exports.convertPdfToImageBuffer = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const pdf2pic_1 = require("pdf2pic");
const gm_1 = __importDefault(require("gm"));
const im = gm_1.default.subClass({ imageMagick: true });
// import Jimp from 'jimp';
const pdf_lib_1 = require("pdf-lib");
function convertPdfToImageBuffer(pdfBuffer) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('recieved buffer', pdfBuffer);
        const tempFile = `${path_1.default.resolve(__dirname, `${Date.now()}.pdf`)}`;
        console.log(tempFile);
        yield fs_1.default.promises.writeFile(tempFile, pdfBuffer);
        const outputDirectory = `${path_1.default.resolve(__dirname, 'outputs')}`;
        console.log(outputDirectory);
        // rimraf.sync(outputDirectory);
        // mkdirSync(outputDirectory);
        const options = {
            density: 100,
            saveFilename: `${Date.now()}`,
            savePath: outputDirectory,
            format: "png",
            width: 600,
            height: 900,
        };
        console.log('Error is not here');
        //   console.log(await pdf2image.convertPDF(tempFile));
        const convert = (0, pdf2pic_1.fromBuffer)(pdfBuffer, options);
        let res = yield convert(1);
        console.log(res);
        console.log('Error is here?');
        fs_1.default.promises.unlink(tempFile);
        console.log(`${outputDirectory}/${res.name}`);
        let data = fs_1.default.readFileSync(`${outputDirectory}/${res.name}`);
        console.log(data);
        fs_1.default.promises.unlink(`${outputDirectory}/${res.name}`);
        return data;
    });
}
exports.convertPdfToImageBuffer = convertPdfToImageBuffer;
const imageBufferToPdfBuffer = (inputImageBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('inputbuffer', inputImageBuffer);
    // const pdfBuffer = await sharp(inputImageBuffer).toFormat('pdf')
    //   .toBuffer();
    //   fs.writeFile(`${path.resolve(__dirname, `output.pdf`)}`, pdfBuffer, (error) => {
    //     if (error) {
    //       console.error(error);
    //     } else {
    //       console.log('PDF file written');
    //     }
    //   });
    // return pdfBuffer;
    const image = (0, sharp_1.default)(inputImageBuffer);
    const { width, height } = yield image.metadata();
    const pdfDoc = yield pdf_lib_1.PDFDocument.create();
    const pdfImage = yield pdfDoc.embedJpg(yield image.jpeg().toBuffer());
    const pdfPage = pdfDoc.addPage([width, height]);
    pdfPage.drawImage(pdfImage, {
        x: 0,
        y: 0,
        width: pdfImage.width,
        height: pdfImage.height
    });
    const pdfBuffer = Buffer.from(yield pdfDoc.save());
    console.log(pdfBuffer);
    fs_1.default.writeFile(`${path_1.default.resolve(__dirname, `output.pdf`)}`, pdfBuffer, (error) => {
        if (error) {
            console.error(error);
        }
        else {
            console.log('PDF file written');
        }
    });
    return pdfBuffer;
});
exports.imageBufferToPdfBuffer = imageBufferToPdfBuffer;
