import { getProducts } from './lib/products';
import { GET } from './app/feed.xml/route';

async function run() {
  try {
    const res = await GET();
    const text = await res.text();
    require('fs').writeFileSync('test_feed.xml', text);
    console.log('Success, wrote test_feed.xml');
  } catch(e) {
    console.error(e);
  }
}
run();
