import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ExperimentalWarning zu --experimental-loader unterdrücken
process.on('warning', (warning) => {
  if (warning.name === 'ExperimentalWarning' && warning.message.includes('--experimental-loader')) {
    // Ignorieren
    return;
  }
  console.warn(warning);
});

function isValidDate(dateString: any): boolean {
  if (typeof dateString !== 'string' || dateString.trim() === '') {
    return false;
  }
  const date = new Date(dateString);
  // Prüfen, ob das Datum gültig ist
  if (isNaN(date.getTime())) {
    return false;
  }
  // Prüfen, ob das Jahr eine sinnvolle 4-stellige Zahl ist
  const year = date.getFullYear();
  if (year < 2000 || year > 2100) {
    return false;
  }
  return true;
}

function checkDates(dir: string): boolean {
  let hasError = false;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (checkDates(fullPath)) hasError = true;
    } else if (file.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(content);
      if (data.draft === true) continue; // Drafts ignorieren
      if (!isValidDate(data.date)) {
        console.error(`Fehlerhaftes oder fehlendes Datum in: ${fullPath}`);
        hasError = true;
      }
    }
  }
  return hasError;
}

const hasError = checkDates(path.join(__dirname, '../content/blog'));

if (hasError) {
  process.exit(1); // Bricht das Deploy ab
} else {
  console.log('Blog-Dates checked. nothing invalid found.');
  process.exit(0);
} 