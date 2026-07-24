const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'content-info-seed.json'), 'utf8'));

const lines = data.map(r => {
  const label = String(r.label || '').replace(/'/g, "\\'");
  const description = String(r.description || '').replace(/'/g, "\\'").replace(/\n/g, ' ');
  const images = String(r.images || '').replace(/'/g, "\\'");
  return `  { content_info_id: ${r.content_info_id}, lesson_content_id: ${r.lesson_content_id}, label: '${label}', description: '${description}', images: '${images}' },`;
});

const output = `export const DEFAULT_CONTENT_INFO = [\n${lines.join('\n')}\n];\n`;

fs.writeFileSync(path.join(__dirname, '..', '..', 'src', 'lib', 'content-info-seed.ts'), output);
console.log('Generated', lines.length, 'records');
