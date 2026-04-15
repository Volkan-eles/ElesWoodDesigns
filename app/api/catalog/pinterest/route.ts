import { getProducts } from '@/lib/products';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = getProducts();
  const baseUrl = 'https://eleswooddesigns.com';

  const items = products.map((product) => {
    // Pinterest requires specific fields. We'll map our product data to them.
    const title = product.name;
    const description = `${product.description} - Detailed DIY woodworking plans including 3D diagrams, cut lists, and material lists.`.slice(0, 5000);
    const link = `${baseUrl}/products/${product.slug}/`;
    const imageLink = product.image;
    const price = `${product.price} USD`;
    const availability = 'in stock';
    const condition = 'new';
    
    // Google/Pinterest specific fields use the 'g' namespace
    return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${link}</link>
      <description><![CDATA[${description}]]></description>
      <g:id>${product.id}</g:id>
      <g:price>${price}</g:price>
      <g:image_link>${imageLink}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:condition>${condition}</g:condition>
      <g:brand>ElesWoodDesigns</g:brand>
      <g:google_product_category>6103</g:google_product_category>
    </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>ElesWoodDesigns Product Feed</title>
    <link>${baseUrl}</link>
    <description>Professional DIY Woodworking Plans for Furniture and Garden</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
