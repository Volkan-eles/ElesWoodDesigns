
const fs = require('fs');
const products = JSON.parse(fs.readFileSync('data/etsy_products.json', 'utf8'));

console.log(`Total products: ${products.length}`);

const issues = [];

products.forEach(p => {
    const pIssues = [];
    if (!p.slug) pIssues.push('Missing slug');
    if (!p.name) pIssues.push('Missing name');
    if (!p.price || p.price <= 0) pIssues.push(`Invalid price: ${p.price}`);
    if (!p.images || p.images.length === 0 || !p.images[0]) pIssues.push('Missing primary image');
    if (!p.etsy_url) pIssues.push('Missing Etsy URL');
    
    // Check for weird characters in slug
    if (p.slug && /[^a-z0-9-]/.test(p.slug)) pIssues.push(`Slug has non-standard chars: ${p.slug}`);

    if (pIssues.length > 0) {
        issues.push({ slug: p.slug, name: p.name, issues: pIssues });
    }
});

console.log('Issues found:');
console.log(JSON.stringify(issues, null, 2));

// Check for slug duplicates
const slugs = products.map(p => p.slug);
const duplicates = slugs.filter((s, index) => slugs.indexOf(s) !== index);
if (duplicates.length > 0) {
    console.log('Duplicate slugs found:', duplicates);
}
