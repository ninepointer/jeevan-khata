import fs from 'fs';
import path from 'path';
import pdf2image from 'pdf2image';
import sharp from 'sharp';
import {fromBuffer} from 'pdf2pic';
import rimraf from 'rimraf';
import { mkdirSync } from 'fs';
import gm from "gm";
const im = gm.subClass({ imageMagick: true });
import Jimp from 'jimp';
import {PDFDocument} from 'pdf-lib';
import PDF from 'pdf-parse';
import {PNG} from 'pngjs';


export async function convertPdfToImageBuffer(pdfBuffer: Buffer) {
    console.log('recieved buffer', pdfBuffer);
    const tempFile = `${path.resolve(__dirname, `${Date.now()}.pdf`)}`;
    console.log(tempFile);
    await fs.promises.writeFile(tempFile, pdfBuffer);
    
    const outputDirectory = `${path.resolve(__dirname, 'outputs')}`;
    console.log(outputDirectory)
    rimraf.sync(outputDirectory);
    mkdirSync(outputDirectory);

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
  const pdf = await PDF(pdfBuffer);
  const numPages = pdf.numpages;
  console.log('total pages',numPages);
  const convert = fromBuffer(pdfBuffer, options);
  console.log("this is convert", convert)

  let res;
  try{

    res = await convert(1);
    console.log("this is convert res",res);

  } catch(err){
    console.log("this is convert err",err);
  }

  console.log('Error is here?');

  fs.promises.unlink(tempFile);
  console.log(`${outputDirectory}/${(res as any).name}`);
  let data = fs.readFileSync(`${outputDirectory}/${(res as any).name}`);
  console.log(data);
  fs.promises.unlink(`${outputDirectory}/${(res as any).name}`);
  return data;
  
  }


  export const imageBufferToPdfBuffer = async (inputImageBuffer: Buffer) => {
    console.log('inputbuffer',inputImageBuffer);
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
  const image = sharp(inputImageBuffer);
  const { width, height } = await image.metadata();
  const pdfDoc = await PDFDocument.create();
  const pdfImage = await pdfDoc.embedJpg(await image.jpeg().toBuffer());
  const pdfPage = pdfDoc.addPage([width!, height!]);
  pdfPage.drawImage(pdfImage, {
    x: 0,
    y: 0,
    width: pdfImage.width,
    height: pdfImage.height
  });
    const pdfBuffer = Buffer.from(await pdfDoc.save());
    console.log(pdfBuffer);
    fs.writeFile(`${path.resolve(__dirname, `output.pdf`)}`, pdfBuffer, (error) => {
            if (error) {
              console.error(error);
            } else {
              console.log('PDF file written');
            }
          });
    return pdfBuffer;
  };

  const mkdirSynch = (dirPath: string) => {
    try {
      mkdirSync(dirPath);
    } catch (err:any) {
      if (err.code !== 'EEXIST') throw err;
    }
  };
  
  export async function convertMultiPdfToImageBuffer(pdfBuffer: Buffer) {
    console.log('received buffer', pdfBuffer);
  
    const outputDirectory = `${path.resolve(__dirname, 'outputs')}`;
    console.log(outputDirectory);
    rimraf.sync(outputDirectory);
    mkdirSync(outputDirectory);
  
    const options = {
      density: 100,
      saveFilename: `${Date.now()}`,
      savePath: outputDirectory,
      format: 'png',
      width: 600,
      height: 900,
    };
  
    const convert = fromBuffer(pdfBuffer, options);
    const pdf = await PDF(pdfBuffer);
    const numPages = pdf.numpages;
  
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(await convert(i));
    }
  
    const images = await Promise.all(
      pages.map(async page => {
        return await Jimp.read(`${outputDirectory}/${(page as any).name}`);
      })
    );
  
    const result = new Promise((resolve, reject) => {
      new Jimp(images[0].bitmap.width, images.reduce((acc, image) => acc + image.bitmap.height, 0), async (err, image) => {
        let currentHeight = 0;
        for (const img of images) {
          image.composite(img, 0, currentHeight);
          currentHeight += img.bitmap.height;
        }
    
        const outputPath = `${outputDirectory}/combined.png`;
        await image.writeAsync(outputPath);
    
        fs.readFile(`${outputDirectory}/combined.png`, (err, data) => {
          if (err) reject(err);
          resolve(data);
        });
      });
    });
    
    await result;
    let bufferData = await fs.promises.readFile(`${outputDirectory}/combined.png`);
    // const buffer = await (result ).getBufferAsync(Jimp.MIME_PNG);
    // console.log('buffer', buffer);
    // await fs.promises.writeFile(`${outputDirectory}/test.png`, buffer);
    return bufferData;
    
    // console.log('result', result);
    // // let bufferData = await fs.promises.readFile(`${outputDirectory}/combined.png`);
    // // console.log(bufferData);
    // const buffer = await result.getBufferAsync(Jimp.MIME_PNG);
    // console.log('buffer', buffer);
    // await fs.promises.writeFile(`${outputDirectory}/test.png`, buffer);
    // return buffer;
  }

  export async function convertPdfMultiToImageBuffer(pdfBuffer: Buffer) {
    console.log('received buffer', pdfBuffer);
    
    const outputDirectory = `${path.resolve(__dirname, 'outputs')}`;
    console.log(outputDirectory);
    rimraf.sync(outputDirectory);
    mkdirSync(outputDirectory);
    
    const options = {
      density: 100,
      saveFilename: `${Date.now()}`,
      savePath: outputDirectory,
      format: 'png',
      width: 600,
      height: 900,
    };
    
    const convert = fromBuffer(pdfBuffer, options);
    const pdf = await PDF(pdfBuffer);
    const numPages = pdf.numpages;
    
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(await convert(i));
    }
    
    const promises = pages.map((page, index) => {
      return fs.promises.readFile(`${outputDirectory}/${(page as any).name}`);
    });
    
    const imageBuffers = await Promise.all(promises);

    console.log('image buffers', imageBuffers);
    
    let totalHeight = 0;
    let maxWidth = 0;
    imageBuffers.forEach(buffer => {
      const image = PNG.sync.read(buffer);
      totalHeight += image.height;
      maxWidth = Math.max(maxWidth, image.width);
      console.log(totalHeight, maxWidth);
    });
    
    const result = new PNG({
      width: maxWidth,
      height: totalHeight
    });
    
    let currentHeight = 0;
    imageBuffers.forEach((buffer, i) => {
      const image = PNG.sync.read(buffer);
      console.log(image.width, image.height, currentHeight);
      PNG.bitblt(image, result, 0, 0, maxWidth, currentHeight, 0, image.height);
      currentHeight += image.height;
    });
    
    const outputPath = `${outputDirectory}/combined.png`;
    fs.writeFileSync(outputPath, PNG.sync.write(result));
    
    let data = fs.readFileSync(outputPath);
    // fs.promises.unlink(outputPath);
    
    return data;
  }
  

export async function deskewImage(inputImagePath: string, outputImagePath: string) {
  console.log('inside');
  const image = await Jimp.read(inputImagePath);
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  const threshold = 128;

  let skewAngle = 0;
  let sliceWidth = Math.floor(width * 0.1);
  let sliceHeight = Math.floor(height * 0.1);

  for (let i = 0; i < 10; i++) {
    const slice = image.clone().crop(i * sliceWidth, 0, sliceWidth, height);
    let histogram = new Array(height).fill(0);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < sliceWidth; x++) {
        const color = Jimp.intToRGBA(slice.getPixelColor(x, y));
        if (color.r < threshold && color.g < threshold && color.b < threshold) {
          histogram[y]++;
        }
      }
    }

    let min = 0;
    let max = height - 1;
    let found = false;

    for (let j = 0; j < height / 2; j++) {
      if (histogram[j] > threshold && histogram[height - j - 1] > threshold) {
        min = j;
        found = true;
        break;
      }
    }

    if (!found) {
      console.log('not found bro');
      continue;
    }

    found = false;

    for (let j = height / 2; j < height; j++) {
      if (histogram[j] > threshold && histogram[height - j - 1] > threshold) {
        max = j;
        found = true;
        console.log('breaking');
        break;
      }
    }

    if (!found) {
      console.log('not found');
      continue;
    }

    const sliceAngle = Math.atan2(2 * (max - min), height) / 2;
    skewAngle += sliceAngle;
  }

  if (skewAngle === 0) {
    console.log('no skew angle');
    return;
  }

  image.rotate(-skewAngle, false);
  image.write(outputImagePath);
}