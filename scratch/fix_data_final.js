
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/etsy_products.json', 'utf8'));

const fixText = (str) => {
    if (!str) return str;
    // Replace EN DASH, EM DASH, etc.
    return str
        .replace(/\u2013/g, '-')
        .replace(/\u2014/g, '-')
        .replace(/\u2018/g, "'")
        .replace(/\u2019/g, "'")
        .replace(/\u201c/g, '"')
        .replace(/\u201d/g, '"');
};

data.forEach(p => {
    p.name = fixText(p.name);
    p.description = fixText(p.description);
    if (p.longDescription) p.longDescription = fixText(p.longDescription);
});

fs.writeFileSync('data/etsy_products.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Fixed Etsy products data with Node.js script.');
