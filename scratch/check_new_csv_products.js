const fs = require('fs'); 
const products = JSON.parse(fs.readFileSync('data/etsy_products.json', 'utf8')); 
const existingTitles = new Set(products.map(p => p.name.trim().toLowerCase())); 
const csvContent = fs.readFileSync('EtsyListingsDownload.csv', 'utf8'); 

function parseCSV(content) { 
  const rows = []; 
  let i = 0; 
  const len = content.length; 
  while (i < len) { 
    const row = []; 
    while (i < len && (content[i] === '\r' || content[i] === '\n')) i++; 
    if (i >= len) break; 
    let inField = true; 
    while (inField && i < len) { 
      let field = ''; 
      if (content[i] === '"') { 
        i++; 
        while (i < len) { 
          if (content[i] === '"') { 
            if (i + 1 < len && content[i + 1] === '"') { 
              field += '"'; i += 2; 
            } else { 
              i++; break; 
            } 
          } else { 
            field += content[i]; i++; 
          } 
        } 
      } else { 
        while (i < len && content[i] !== ',' && content[i] !== '\n' && content[i] !== '\r') { 
          field += content[i]; i++; 
        } 
      } 
      row.push(field); 
      if (i < len && content[i] === ',') { 
        i++; 
      } else { 
        inField = false; 
      } 
    } 
    if (row.length > 1 || (row.length === 1 && row[0] !== '')) { 
      rows.push(row); 
    } 
  } 
  return rows; 
} 

const rows = parseCSV(csvContent); 
const headers = rows[0]; 
const newProducts = rows.slice(1).filter(r => r.length > 3 && r[0]).map(r => r[headers.indexOf('TITLE')]).filter(t => t && !existingTitles.has(t.trim().toLowerCase())); 

console.log('New products in CSV:'); 
newProducts.forEach(t => console.log(t));
