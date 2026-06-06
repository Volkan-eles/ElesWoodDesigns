
const fs = require('fs');

// Mock context for feed generation logic
const baseUrl = 'https://eleswooddesigns.com';
const productsData = JSON.parse(fs.readFileSync('data/etsy_products.json', 'utf8'));

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}]/gu, '')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\]\]>/g, ']] ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const items = productsData.map((product) => {
    const title = cleanText(product.name).slice(0, 100);
    const rawDescription = product.longDescription || product.description || title;
    const description = cleanText(rawDescription).slice(0, 500);
    const siteUrl = `${baseUrl}/products/${product.slug}/`;
    const etsyUrl = product.etsy_url || null;
    const primaryImage = (product.images && product.images[0]) ? product.images[0] : '';
    const pinImage = `${baseUrl}/api/pin/${product.slug}/pin.jpg`;
    const extraImagesList = [pinImage, ...(product.images || []).slice(1, 9).filter(Boolean)];
    const extraImagesXml = extraImagesList.map((img) => `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`).join('\n');
    const salePrice = product.price;
    const origPrice = product.originalPrice ?? Math.round((salePrice / 0.30) * 100) / 100;
    const salePriceStr = `${salePrice.toFixed(2)} USD`;
    const origPriceStr = `${origPrice.toFixed(2)} USD`;
    const isPortrait = product.slug.includes('portrait') || product.slug.includes('sketch');
    const googleCategory = isPortrait ? '500044' : '839';
    const productType = isPortrait ? 'Decor > Digital Art' : 'Craft Supplies > Woodworking Plans';

    return `
    <item>
      <g:id>${escapeXml(product.slug)}</g:id>
      <title><![CDATA[${title}]]></title>
      <link>${escapeXml(siteUrl)}</link>
      <g:link>${escapeXml(siteUrl)}</g:link>
      <description><![CDATA[${description}]]></description>
      <g:image_link>${escapeXml(primaryImage)}</g:image_link>
${extraImagesXml}
      <g:price>${origPriceStr}</g:price>
      <g:sale_price>${salePriceStr}</g:sale_price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>ElesWoodDesigns</g:brand>
      <g:google_product_category>${googleCategory}</g:google_product_category>
      <g:product_type><![CDATA[${productType}]]></g:product_type>
      <g:item_group_id>${escapeXml(product.slug)}</g:item_group_id>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`;
}).join('');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>ElesWoodDesigns</title>
    <link>${baseUrl}/</link>
    <description>Woodworking Plans</description>
    ${items}
  </channel>
</rss>`;

// Simple XML well-formedness check (basic)
if (xml.includes(']]>')) {
    console.error('ERROR: Found CDATA terminator in content!');
} else {
    console.log('SUCCESS: No CDATA terminators found.');
}

fs.writeFileSync('scratch/test_feed.xml', xml);
console.log('Feed saved to scratch/test_feed.xml');
