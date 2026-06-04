/**
 * generate_pinterest_bulk_csv.js
 * Generates a CSV file matching the Pinterest Bulk Pin Uploader format:
 * Title, Description, Link, Media URL, Pinterest Board
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const JSON_PATH = path.join(ROOT, 'data', 'etsy_products.json');
const CSV_OUTPUT_PATH = path.join(ROOT, 'public', 'feed.csv');
const BULK_OUTPUT_PATH = path.join(ROOT, 'public', 'pinterest-bulk-pins.csv');

const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const baseUrl = 'https://eleswooddesigns.com';

function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}]/gu, '') // strip emojis
    .replace(/\r/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeCsvValue(val) {
  if (val === null || val === undefined) return '';
  let str = String(val);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function getBoardName(category) {
  switch (category) {
    case 'Garden':
      return 'DIY Garden Woodworking Plans';
    case 'Outdoor':
      return 'DIY Outdoor Woodworking Plans';
    case 'Bedroom':
      return 'DIY Bedroom Furniture Plans';
    case 'Kids':
      return 'DIY Kids Woodworking Plans';
    case 'Digital':
      return 'Printable Games & Digital Crafts';
    default:
      return 'DIY Woodworking Plans';
  }
}

const headers = [
  'Title',
  'Description',
  'Link',
  'Media URL',
  'Pinterest Board'
];

const csvRows = [headers.join(',')];

products.forEach((product) => {
  const title = cleanText(product.name).slice(0, 100);
  
  const rawDescription = product.longDescription || product.description || title;
  const featuresStr = (product.features && product.features.length > 0) ? ` Features: ${product.features.join(', ')}.` : '';
  const materialsStr = (product.materials && product.materials.length > 0) ? ` Materials: ${product.materials.join(', ')}.` : '';
  const tagsString = (product.tags && product.tags.length > 0) ? ` | Tags: ${product.tags.join(', ')}` : '';
  const description = cleanText(rawDescription + featuresStr + materialsStr + tagsString).slice(0, 500);

  const siteUrl = `${baseUrl}/products/${product.slug}/`;
  const primaryImage = product.images?.[0] || '';
  const boardName = getBoardName(product.category);

  const row = [
    title,
    description,
    siteUrl,
    primaryImage,
    boardName
  ];

  csvRows.push(row.map(escapeCsvValue).join(','));
});

const csvContent = csvRows.join('\n');

// Write to both paths for maximum convenience
fs.writeFileSync(CSV_OUTPUT_PATH, csvContent, 'utf8');
fs.writeFileSync(BULK_OUTPUT_PATH, csvContent, 'utf8');

console.log(`✅ Pinterest Bulk Pin CSV written to ${CSV_OUTPUT_PATH}`);
console.log(`✅ Pinterest Bulk Pin CSV written to ${BULK_OUTPUT_PATH}`);
console.log(`   Total Pins in CSV: ${products.length}`);
