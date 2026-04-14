const fs = require('fs');
const path = require('path');

function parseCSV(content) {
  const rows = [];
  let currentField = '';
  let inQuotes = false;
  let currentRow = [];
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];
    
    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
        if (char === '\r') i++;
      } else {
        currentField += char;
      }
    }
  }
  if (currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }
  return rows;
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function inferCategory(tags, title) {
  const combined = (tags + ' ' + title).toLowerCase();
  if (combined.includes('garden') || combined.includes('pergola') || combined.includes('outdoor')) return 'Garden';
  if (combined.includes('furniture') || combined.includes('table') || combined.includes('chair')) return 'Furniture';
  if (combined.includes('kids') || combined.includes('toy')) return 'Kids';
  if (combined.includes('kitchen') || combined.includes('spice') || combined.includes('bakery')) return 'Kitchen';
  return 'Decoration';
}

function getRandom(min, max, precision = 0) {
  const val = Math.random() * (max - min) + min;
  return precision === 0 ? Math.floor(val) : parseFloat(val.toFixed(precision));
}

function escapeCSV(str) {
  if (!str) return '""';
  return `"${str.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
}

const inputPath = path.join(process.cwd(), 'EtsyListingsDownload.csv');
const outputPath = path.join(process.cwd(), 'public', 'products.csv');

if (!fs.existsSync(inputPath)) {
  console.error('Input CSV not found');
  process.exit(1);
}

const content = fs.readFileSync(inputPath, 'utf8');
const data = parseCSV(content);
const headers = data[0].map(h => h.trim());

const products = data.slice(1).map(row => {
  const item = {};
  headers.forEach((h, i) => { item[h] = row[i]; });
  
  if (!item.TITLE) return null;

  const title = item.TITLE;
  const slug = generateSlug(title);
  const category = inferCategory(item.TAGS || '', title);
  const difficulty = ['Easy', 'Medium', 'Hard'][getRandom(0, 3)];
  const price = item.PRICE || '19.99';
  const rating = getRandom(4.5, 5.0, 1);
  const review_count = getRandom(10, 500);
  const description = item.DESCRIPTION ? item.DESCRIPTION.split('\n')[0] : 'Professional DIY woodworking plan.';
  const image_url = item.IMAGE1 || 'https://via.placeholder.com/600x400';
  const etsy_url = 'https://www.etsy.com/shop/ElesWoodDesigns'; // Shop link
  const features = (item.MATERIALS || 'Detailed PDF, Cut list, Material list').split(',').slice(0, 3).join(' | ');

  return [
    escapeCSV(title),
    escapeCSV(slug),
    escapeCSV(category),
    escapeCSV(difficulty),
    price,
    rating,
    review_count,
    escapeCSV(item.DESCRIPTION || ''),
    escapeCSV(image_url),
    escapeCSV(etsy_url),
    escapeCSV(features)
  ].join(',');
}).filter(Boolean);

const csvContent = ['title,slug,category,difficulty,price,rating,review_count,description,image_url,etsy_url,features', ...products].join('\n');

if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
  fs.mkdirSync(path.join(process.cwd(), 'public'), { recursive: true });
}

fs.writeFileSync(outputPath, csvContent);
console.log(`Generated ${products.length} products to public/products.csv`);
