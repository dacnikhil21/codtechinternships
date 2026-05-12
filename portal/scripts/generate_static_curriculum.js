import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import { parsePdfTextToCurriculum } from '../lib/pdfParser.js';

async function generateJson() {
  const baseDir = './materials/raw_pdfs';
  const files = [];
  function getFiles(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        getFiles(fullPath);
      } else if (item.endsWith('.pdf')) {
        files.push(fullPath);
      }
    }
  }
  getFiles(baseDir);

  const allCurriculum = {};

  for (const filePath of files) {
    const fileName = path.basename(filePath, '.pdf').trim();
    console.log(`📄 Processing ${fileName}...`);
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      const structured = parsePdfTextToCurriculum(data.text);
      allCurriculum[fileName.toUpperCase()] = structured;
    } catch (err) {
      console.error(`❌ Error parsing ${fileName}:`, err.message);
    }
  }

  fs.writeFileSync('./lib/real_curriculum.json', JSON.stringify(allCurriculum, null, 2));
  console.log('✅ Real curriculum JSON generated at lib/real_curriculum.json');
}

generateJson().catch(console.error);
