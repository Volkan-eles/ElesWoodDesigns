const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'etsy_products.json');
const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const updatedProducts = products.map(product => {
  // Use original price if already calculated, otherwise current price is original
  const originalPrice = product.originalPrice || product.price;
  const salePrice = Number((originalPrice * 0.3).toFixed(2));

  return {
    ...product,
    originalPrice: originalPrice,
    price: salePrice
  };
});

fs.writeFileSync(filePath, JSON.stringify(updatedProducts, null, 2));
console.log(`Successfully updated ${updatedProducts.length} products with 70% discount.`);
