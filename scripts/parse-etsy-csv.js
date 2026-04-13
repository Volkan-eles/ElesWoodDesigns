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
  if (combined.includes('garden') || combined.includes('pergola') || combined.includes('outdoor') || combined.includes('gazebo') || combined.includes('arbor')) return 'Garden';
  if (combined.includes('table') || combined.includes('chair') || combined.includes('furniture') || combined.includes('bench') || combined.includes('workbench') || combined.includes('shelf') || combined.includes('stool')) return 'Furniture';
  if (combined.includes('kids') || combined.includes('playhouse') || combined.includes('loft bed') || combined.includes('toy') || combined.includes('playground')) return 'Kids';
  if (combined.includes('kitchen') || combined.includes('spice') || combined.includes('board') || combined.includes('sourdough') || combined.includes('bakery')) return 'Kitchen';
  if (combined.includes('decoration') || combined.includes('frame') || combined.includes('tray') || combined.includes('rustic')) return 'Decoration';
  return 'Furniture'; // Default
}

function getRandom(min, max, precision = 0) {
  const val = Math.random() * (max - min) + min;
  return precision === 0 ? Math.floor(val) : parseFloat(val.toFixed(precision));
}

const csvPath = path.join(process.cwd(), 'EtsyListingsDownload.csv');
const outputPath = path.join(process.cwd(), 'data', 'etsy_products.json');

if (!fs.existsSync(csvPath)) {
  console.error('CSV file not found at:', csvPath);
  process.exit(1);
}

const content = fs.readFileSync(csvPath, 'utf8');
const data = parseCSV(content);

const headers = data[0].map(h => h.trim().replace(/^"/, '').replace(/"$/, ''));
const items = data.slice(1).map((row, index) => {
  if (row.length < headers.length) return null;
  const item = {};
  headers.forEach((h, i) => {
    item[h] = row[i];
  });
  return item;
}).filter(Boolean);

const products = items.map((item, index) => {
  const name = item.TITLE || 'Untitled Product';
  const slug = generateSlug(name);
  const category = inferCategory(item.TAGS || '', name);
  
  const image = item.IMAGE1 || '/placeholder.png';
  
  // Etsy URL optimization logic
  const toThumbnail = (url) => {
    if (!url || url.includes('placeholder')) return url;
    // Upgrade to 794xN for much higher clarity (HD)
    return url.replace('fullxfull', '794xN');
  };

  const images = [];
  const imagesThumbnails = [];
  for (let i = 1; i <= 10; i++) {
    const img = item[`IMAGE${i}`];
    if (img && img.trim()) {
      images.push(img.trim());
      imagesThumbnails.push(toThumbnail(img.trim()));
    }
  }
  
  return {
    id: `etsy-${index + 1}`,
    slug: slug,
    name: name,
    category: category,
    price: parseFloat(item.PRICE) || 0,
    rating: getRandom(4.5, 5.0, 1),
    reviewCount: getRandom(40, 600),
    difficulty: ['Easy', 'Medium', 'Hard'][getRandom(0, 3)],
    estimatedTime: `${getRandom(2, 12)} hours`,
    pages: getRandom(8, 30),
    description: name.split(':')[0].split('|')[0].trim(),
    longDescription: item.DESCRIPTION || '',
    features: (item.TAGS || '').split(',').slice(0, 5).map(t => t.trim().replace(/_/g, ' ')),
    materials: (item.MATERIALS || '').split(',').map(m => m.trim()),
    image: image,
    thumbnail: toThumbnail(image),
    images: images,
    imagesThumbnails: imagesThumbnails,
    etsy_url: "https://www.etsy.com/shop/ElesWoodDesigns", // Generic shop link or listing if available
    bestseller: Math.random() > 0.8
  };
});

fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
console.log(`Successfully generated ${products.length} products to ${outputPath}`);
