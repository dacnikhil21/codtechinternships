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

  const outputDir = './lib/curriculum_data';
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  for (const filePath of files) {
    const fileName = path.basename(filePath, '.pdf').trim();
    console.log(`📄 Processing ${fileName}...`);
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      const structured = parsePdfTextToCurriculum(data.text);
      
      const safeName = fileName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.json';
      fs.writeFileSync(path.join(outputDir, safeName), JSON.stringify(structured, null, 2));
      console.log(`✅ Saved lib/curriculum_data/${safeName}`);
    } catch (err) {
      console.error(`❌ Error parsing ${fileName}:`, err.message);
    }
  }
  console.log('✅ All domain curriculum files generated.');
}

generateJson().catch(console.error);
