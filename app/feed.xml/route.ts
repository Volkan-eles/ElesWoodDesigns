import { getProducts } from '@/lib/products';
import { PINTEREST_PIN_FILES } from '@/lib/pinterest-pins';

export const dynamic = 'force-dynamic';

function escapeXml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cleanText(str: string): string {
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

function getGoogleCategory(slug: string, cat: string): string {
  const isPortrait = slug.includes('portrait') || slug.includes('sketch');
  const isDigitalArt = cat === 'Digital' && (slug.includes('christmas') || slug.includes('costco') || slug.includes('wholesale') || slug.includes('watercolour') || slug.includes('memorial'));
  const isPartyPrintable = cat === 'Digital' && (slug.includes('kentucky-derby') || slug.includes('derby') || slug.includes('party') || slug.includes('game') || slug.includes('betting') || slug.includes('cards') || slug.includes('mothers-day') || slug.includes('handprint') || slug.includes('craft') || slug.includes('keepsake') || slug.includes('mahjong') || slug.includes('sweepstake') || slug.includes('world-cup') || slug.includes('world-soccer') || slug.includes('soccer') || slug.includes('coloring'));
  if (isPortrait || isDigitalArt || isPartyPrintable) return '500044';
  return '505378';
}

function getProductType(slug: string, cat: string, name: string): string {
  const lowerName = (name || '').toLowerCase();
  const isPortrait = slug.includes('portrait') || slug.includes('sketch');
  const isDigitalArt = cat === 'Digital' && (slug.includes('christmas') || slug.includes('wholesale') || slug.includes('costco') || slug.includes('watercolour') || slug.includes('memorial'));
  const isPartyPrintable = cat === 'Digital';
  const isKids = cat === 'Kids' || lowerName.includes('treehouse') || lowerName.includes('mud kitchen') || lowerName.includes('playhouse');
  const isGarden = cat === 'Garden' || lowerName.includes('planter') || lowerName.includes('plant stand') || lowerName.includes('garden') || lowerName.includes('farmstand') || lowerName.includes('strawberry');
  const isOutdoor = cat === 'Outdoor' || lowerName.includes('pergola') || lowerName.includes('swing') || lowerName.includes('arbor') || lowerName.includes('sauna') || lowerName.includes('gazebo') || lowerName.includes('shed') || lowerName.includes('chicken') || lowerName.includes('catio') || lowerName.includes('food cart');
  const isBedroom = slug.includes('loft-bed') || slug.includes('murphy-desk') || slug.includes('storage-bench') || slug.includes('bunk-bed');

  if (isPortrait || isDigitalArt) return 'Decor > Digital Art > Printable Designs > Portrait & Wall Art';
  if (isPartyPrintable) return 'Decor > Digital Art > Printable Designs > Party Games & Printables';
  if (isKids) return `Woodworking Plans > Kids > DIY Blueprint > Outdoor Play Structures`;
  if (isGarden) return `Woodworking Plans > Garden > DIY Blueprint > Garden & Planter Builds`;
  if (isOutdoor) return `Woodworking Plans > Outdoor > DIY Blueprint > Outdoor Furniture & Structures`;
  if (isBedroom) return `Woodworking Plans > Furniture > DIY Blueprint > Bedroom & Storage Furniture`;
  return `Woodworking Plans > ${cat} > DIY Blueprint > Beginner-Friendly PDF`;
}

function buildEnrichedDescription(product: any): string {
  const rawDescription = product.longDescription || product.description || '';
  const cleanDesc = cleanText(rawDescription).slice(0, 300);
  const cat = (product.category || '').toLowerCase();
  const price = `$${(product.price || 0).toFixed(2)}`;

  let cta = `Get the complete step-by-step PDF blueprint for only ${price}. Instant download - cut list, 3D diagrams & material list included.`;
  let hashtags = '';

  if (cat === 'garden') {
    cta += ' Perfect DIY garden project for beginners and intermediate builders.';
    hashtags = '#diygarden #gardenproject #woodworkingplans #diywoodworking #raisedbed #gardenbed #backyarddiy #diyprojects #homeimprovement #gardendesign';
  } else if (cat === 'outdoor') {
    cta += ' Build beautiful outdoor furniture and structures for your backyard.';
    hashtags = '#outdoorfurniture #diyoutdoor #woodworkingplans #backyardideas #diywoodworking #pergola #patio #outdoorliving #diyprojects #homeimprovement';
  } else if (cat === 'furniture') {
    cta += ' Create beautiful handcrafted furniture with this beginner-friendly blueprint.';
    hashtags = '#diyfurniture #woodworkingplans #diywoodworking #furnitureplans #handmadefurniture #farmhousestyle #rusticfurniture #diyhomedecor #homeimprovement #diyprojects';
  } else if (cat === 'kids') {
    cta += ' Safe, fun woodworking project for kids play areas - detailed plans with safety notes.';
    hashtags = '#kidsfurniture #diykids #playhouse #treehouse #diywoodworking #woodworkingplans #familyproject #diyprojects #kidsoutdoor #backyardplay';
  } else if (cat === 'digital') {
    cta += ' Printable digital download - print at home and create instantly.';
    hashtags = '#printable #instantdownload #digitaldownload #diycraft #homedecor #printabledecor #diydecor #craftideas #diyhomedecor #crafting';
  } else {
    hashtags = '#woodworking #diywoodworking #woodworkingplans #diyprojects #diyhome #craftsman #buildyourown #homeimprovement #makersmovement #workshop';
  }

  const tagsFromProduct = product.tags && product.tags.length > 0 ? product.tags.slice(0, 5).join(', ') : '';
  const fullDesc = [cleanDesc, cta, tagsFromProduct ? `Keywords: ${tagsFromProduct}.` : '', hashtags]
    .filter(Boolean).join(' ').slice(0, 4990);

  return fullDesc.length > 80
    ? fullDesc
    : `${product.name} - Professional PDF woodworking plan with detailed diagrams, cut list, and step-by-step instructions. Instant digital download. ${hashtags}`;
}

function getCustomLabels(product: any) {
  const cat = (product.category || '').toLowerCase();
  const price = product.price || 0;
  const rating = product.rating || 0;
  const bestseller = product.bestseller ? 'bestseller' : 'standard';

  const label0 = cat === 'garden' ? 'garden-plans' :
    cat === 'outdoor' ? 'outdoor-plans' :
    cat === 'furniture' ? 'furniture-plans' :
    cat === 'kids' ? 'kids-plans' :
    cat === 'digital' ? 'printables' : 'woodworking-plans';

  const label1 = price < 2 ? 'price-under-2' : price < 5 ? 'price-2-5' : price < 8 ? 'price-5-8' : 'price-over-8';
  const label2 = rating >= 4.8 ? 'top-rated' : rating >= 4.5 ? 'high-rated' : 'standard';
  const label3 = bestseller;
  const diff = (product.difficulty || '').toLowerCase();
  const label4 = diff === 'easy' ? 'beginner-friendly' : diff === 'hard' ? 'advanced' : 'intermediate';

  return { label0, label1, label2, label3, label4 };
}

export async function GET() {
  const products = getProducts();
  const baseUrl = 'https://eleswooddesigns.com';

  const items = products.map((product) => {
    const title = cleanText(product.name).slice(0, 100);
    const description = buildEnrichedDescription(product);
    const siteUrl = `${baseUrl}/products/${product.slug}/`;

    // Static 2:3 Pinterest Pin image (pre-generated, serves in 20ms from Vercel Edge CDN)
    const hasStaticPin = PINTEREST_PIN_FILES.has(`${product.slug}.jpg`);
    const staticPinUrl = `${baseUrl}/pinterest-images/${product.slug}.jpg`;
    const rawProductImage = (product.images && product.images[0]) ? product.images[0] : '';

    const primaryImage = hasStaticPin ? staticPinUrl : rawProductImage;

    // Deduplicate additional images: never duplicate primaryImage or each other (fixes Pinterest Warning 203)
    const seenImages = new Set<string>();
    if (primaryImage) {
      seenImages.add(primaryImage);
    }

    const uniqueExtraImages: string[] = [];
    if (hasStaticPin && rawProductImage && !seenImages.has(rawProductImage)) {
      seenImages.add(rawProductImage);
      uniqueExtraImages.push(rawProductImage);
    }

    for (const img of (product.images || [])) {
      if (img && !seenImages.has(img)) {
        seenImages.add(img);
        uniqueExtraImages.push(img);
        if (uniqueExtraImages.length >= 9) break;
      }
    }

    const extraImagesXml = uniqueExtraImages
      .map((img: string) => `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`)
      .join('\n');

    const salePrice = product.price;
    const origPrice = product.originalPrice != null ? product.originalPrice : Math.round((salePrice / 0.30) * 100) / 100;
    const salePriceStr = `${salePrice.toFixed(2)} USD`;
    const origPriceStr = `${origPrice.toFixed(2)} USD`;

    const targetCountries = ['US'];
    const shippingXml = targetCountries.map(country => `      <g:shipping>
        <g:country>${country}</g:country>
        <g:service>Digital Download</g:service>
        <g:price>0.00 USD</g:price>
        <g:min_handling_time>0</g:min_handling_time>
        <g:max_handling_time>0</g:max_handling_time>
        <g:min_transit_time>0</g:min_transit_time>
        <g:max_transit_time>0</g:max_transit_time>
      </g:shipping>`).join('\n');

    const googleCategory = getGoogleCategory(product.slug, product.category || '');
    const productType = getProductType(product.slug, product.category || '', product.name);
    const pinterestId = product.slug.slice(0, 100);
    const labels = getCustomLabels(product);
    const nowIso = new Date().toISOString();

    // STRICT COMPLIANCE: NO <g:ads_redirect> to external marketplaces like etsy.com
    return `
    <item>
      <g:id>${escapeXml(pinterestId)}</g:id>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(siteUrl)}</link>
      <g:link>${escapeXml(siteUrl)}</g:link>
      <description>${escapeXml(description)}</description>
      <g:description>${escapeXml(description)}</g:description>
      <g:image_link>${escapeXml(primaryImage)}</g:image_link>
${extraImagesXml}
      <g:price>${origPriceStr}</g:price>
      <g:sale_price>${salePriceStr}</g:sale_price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>ElesWoodDesigns</g:brand>
      <g:google_product_category>${escapeXml(googleCategory)}</g:google_product_category>
      <g:product_type>${escapeXml(productType)}</g:product_type>
      <g:item_group_id>${escapeXml(pinterestId)}</g:item_group_id>
      <g:identifier_exists>no</g:identifier_exists>
      <g:custom_label_0>${escapeXml(labels.label0)}</g:custom_label_0>
      <g:custom_label_1>${escapeXml(labels.label1)}</g:custom_label_1>
      <g:custom_label_2>${escapeXml(labels.label2)}</g:custom_label_2>
      <g:custom_label_3>${escapeXml(labels.label3)}</g:custom_label_3>
      <g:custom_label_4>${escapeXml(labels.label4)}</g:custom_label_4>
      <g:updated_at>${nowIso}</g:updated_at>
${shippingXml}
    </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>ElesWoodDesigns – DIY Woodworking Plans</title>
    <link>${baseUrl}/</link>
    <description>Professional DIY woodworking PDF plans with 3D diagrams, cut lists, and material lists. Instant download.</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
