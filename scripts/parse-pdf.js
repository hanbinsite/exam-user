import pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfPath = path.join(__dirname, '../raw-data/区.pdf');
const dataBuffer = fs.readFileSync(pdfPath);

const pdfData = await pdfParse(dataBuffer);

console.log('PDF内容:');
console.log(pdfData.text);

fs.writeFileSync(
  path.join(__dirname, '../raw-data/pdf-content.txt'),
  pdfData.text,
  'utf-8'
);

console.log('\n\nPDF内容已保存到 raw-data/pdf-content.txt');
