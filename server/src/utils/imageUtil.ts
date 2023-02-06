import fs from 'fs';
import path from 'path';
import pdf2image from 'pdf2image';
import sharp from 'sharp';
import {fromBuffer} from 'pdf2pic';
import rimraf from 'rimraf';
import { mkdirSync } from 'fs';
import gm from "gm";
const im = gm.subClass({ imageMagick: true });

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
  const convert = fromBuffer(pdfBuffer, options);
  let res = await convert(1);
  console.log(res);
  console.log('Error is here?');

  fs.promises.unlink(tempFile);
  console.log(`${outputDirectory}/${(res as any).name}`);
  let data = fs.readFileSync(`${outputDirectory}/${(res as any).name}`);
  console.log(data);
  fs.promises.unlink(`${outputDirectory}/${(res as any).name}`);
  return data;
  
  }
