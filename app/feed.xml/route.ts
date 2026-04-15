import { getProducts } from '@/lib/products';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = getProducts();
  const baseUrl = 'https://eleswooddesigns.com';

  const items = products.map((product) => {
    const title = product.name;
    const description = `${product.description} - Professional DIY woodworking plans with 3D diagrams, material lists, and precision cut lists. Instant PDF download.`.slice(0, 5000);
    const link = `${baseUrl}/products/${product.slug}/`;
    const imageLink = product.image; // Using the direct image URL for better crawling
    const price = `${product.price} USD`;
    const availability = 'in stock';
    
    return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${link}</link>
      <description><![CDATA[${description}]]></description>
      <g:id>${product.slug}</g:id>
      <g:price>${price}</g:price>
      <g:image_link>${imageLink}</g:image_link>
      <g:additional_image_link>${baseUrl}/api/pin/${product.slug}</g:additional_image_link>
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>ElesWoodDesigns</g:brand>
      <g:google_product_category>6103</g:google_product_category>
      <g:product_type><![CDATA[Hardware > Tools > Blueprints & Templates]]></g:product_type>
    </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>ElesWoodDesigns Product Feed</title>
    <link>${baseUrl}</link>
    <description>Professional Woodworking Plans for DIY Enthusiasts</description>
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
