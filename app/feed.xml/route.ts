import { getProducts } from '@/lib/products';

export async function GET() {
  const products = getProducts();
  const baseUrl = 'https://eleswooddesigns.com';

  const items = products.map((product) => `
    <item>
      <g:id>${product.slug}</g:id>
      <g:title><![CDATA[${product.name.slice(0, 150)}]]></g:title>
      <g:description><![CDATA[${product.description}]]></g:description>
      <g:link>${baseUrl}/products/${product.slug}/</g:link>
      <g:image_link>${baseUrl}/api/pin/${product.slug}</g:image_link>
      ${(product.images || []).filter(img => img !== product.image).map(img => `<g:additional_image_link>${img}</g:additional_image_link>`).join('\n      ')}
      <g:price>${product.price} USD</g:price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>ElesWoodDesigns</g:brand>
      <g:product_type><![CDATA[Hardware > Tools > Blueprints & Templates]]></g:product_type>
      <g:custom_label_0><![CDATA[${product.category}]]></g:custom_label_0>
      <g:custom_label_1><![CDATA[Plan]]></g:custom_label_1>
    </item>
  `).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>ElesWoodDesigns Plans</title>
    <link>${baseUrl}</link>
    <description>Woodworking and DIY plans by ElesWoodDesigns</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
