
/** Normalize Turkish / non-ASCII chars to ASCII equivalents */
function normalizeSlug(slug) {
  return slug
    .replace(/ı/g, 'i').replace(/İ/g, 'i')
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/Ü/g, 'u')
    .replace(/ş/g, 's').replace(/Ş/g, 's')
    .replace(/ö/g, 'o').replace(/Ö/g, 'o')
    .replace(/ç/g, 'c').replace(/Ç/g, 'c');
}

const tests = [
    { input: '/products/diy-masa-yapimi', expected: '/products/diy-masa-yapimi/' },
    { input: '/products/diy-masa-yapımı', expected: '/products/diy-masa-yapimi/' },
    { input: '/products/küçük-tabure-planı', expected: '/products/kucuk-tabure-plani/' },
    { input: '/plans/bahçe-mobilyaları', expected: '/plans/bahce-mobilyalari/' },
];

console.log('--- Middleware Logic Test ---');

tests.forEach(test => {
    const decoded = decodeURIComponent(test.input);
    const normalized = normalizeSlug(decoded);
    let final = normalized;
    if (!final.endsWith('/')) {
        final += '/';
    }
    
    const passed = final === test.expected;
    console.log(`Input: ${test.input}`);
    console.log(`Output: ${final}`);
    console.log(`Expected: ${test.expected}`);
    console.log(`Status: ${passed ? 'PASSED' : 'FAILED'}`);
    console.log('---');
});
