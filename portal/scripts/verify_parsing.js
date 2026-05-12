import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import { parsePdfTextToCurriculum } from '../lib/pdfParser.js';

async function verify() {
  const testFile = './materials/raw_pdfs/Java .pdf';
  if (!fs.existsSync(testFile)) {
    console.error('❌ Test file not found:', testFile);
    return;
  }

  console.log('🚀 Testing PDF Parsing for:', testFile);
  const dataBuffer = fs.readFileSync(testFile);
  const data = await pdf(dataBuffer);
  
  const structuredContent = parsePdfTextToCurriculum(data.text);
  
  console.log('\n--- PARSING RESULTS ---');
  console.log(`Modules Found: ${structuredContent.length}`);
  
  structuredContent.forEach((mod, i) => {
    console.log(`\n📦 Module ${i+1}: ${mod.title}`);
    mod.lessons.forEach((lesson, j) => {
      console.log(`   📖 Lesson ${j+1}: ${lesson.title}`);
      console.log(`      Content Snippet: ${lesson.content.substring(0, 100)}...`);
    });
  });

  fs.writeFileSync('./scripts/parsing_preview.json', JSON.stringify(structuredContent, null, 2));
  console.log('\n✅ Full preview saved to scripts/parsing_preview.json');
}

verify().catch(console.error);
