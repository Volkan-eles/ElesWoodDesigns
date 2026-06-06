const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const CSV_PATH = path.join(ROOT, '..', 'EtsyListingsDownload.csv');
const JSON_OUT = path.join(ROOT, '..', 'data', 'etsy_products.json');

const DISCOUNT_RATE = 0.30;
const DEFAULT_RATING = 4.7;
const DEFAULT_REVIEW_COUNT = 285;
const DEFAULT_DIFFICULTY = "Easy";
const DEFAULT_TIME = "8 hours";
const DEFAULT_PAGES = 15;

const CATEGORY_MAP = [
    [["bar cart", "charcuterie", "serving cart", "beverage cart", "coffee cart", "mobile bar", "food cart", "vendor cart", "catering"], "Kitchen"],
    [["outdoor kitchen", "grill station", "bbq", "grill table"], "Kitchen"],
    [["farmstand", "farm stand", "farm cart", "flower cart", "produce", "roadside", "flower stand", "planter", "garden", "plant stand"], "Garden"],
    [["workbench", "workshop", "garage", "shop table", "tool bench"], "Workshop"],
    [["bed frame", "bunk bed", "loft bed", "kids", "playhouse", "treehouse"], "Bedroom"],
    [["digital", "digital download", "svg", "pdf", "plans"], "Digital"],
];

const DIFFICULTY_HINTS = [
    [["folding", "foldable", "collapsible", "beginner", "simple"], "Easy"],
    [["rotating", "lift top", "lift-top", "ping pong", "outdoor kitchen", "modular"], "Hard"],
];

function slugify(text) {
    let t = text.toLowerCase().trim();
    t = t.replace(/[^\w\s-]/g, "");
    t = t.replace(/[\s_]+/g, "-");
    t = t.replace(/-+/g, "-");
    t = t.substring(0, 120);
    return t.replace(/^-+|-+$/g, "");
}

function guessCategory(title, desc = "") {
    const combined = (title + " " + desc.substring(0, 200)).toLowerCase();
    for (const [keywords, cat] of CATEGORY_MAP) {
        if (keywords.some(kw => combined.includes(kw))) {
            return cat;
        }
    }
    return "Furniture";
}

function guessDifficulty(title, desc = "") {
    const combined = (title + " " + desc.substring(0, 200)).toLowerCase();
    for (const [keywords, diff] of DIFFICULTY_HINTS) {
        if (keywords.some(kw => combined.includes(kw))) {
            return diff;
        }
    }
    return DEFAULT_DIFFICULTY;
}

function buildImageUrl(url, size = "fullxfull") {
    if (!url) return "";
    return url.replace(/il_[^.]+\./, `il_${size}.`);
}

function parsePrice(s) {
    const val = parseFloat(s.replace(/[^\d.]/g, ""));
    return isNaN(val) ? 0.0 : val;
}

function parseTags(s) {
    if (!s) return [];
    return s.split(",").map(t => t.trim().replace(/\s+/g, "_")).filter(t => t);
}

const NEW_URLS = {
    "Tiered Planter Box Plans | 2-Level Raised Garden Bed Woodworking Blueprint (PDF Download)": "https://www.etsy.com/listing/4493928541/tiered-planter-box-plans-2-level-raised",
    "Tiered Plant Stand Plans | DIY Outdoor Wooden Garden Shelf (PDF Download)": "https://www.etsy.com/listing/4493892575/tiered-plant-stand-plans-diy-outdoor",
};

function main() {
    if (!fs.existsSync(CSV_PATH)) {
        console.error("ERROR: CSV not found");
        return;
    }

    let catMapOld = {};
    let urlMapOld = {};
    try {
        const oldData = JSON.parse(fs.readFileSync(JSON_OUT, 'utf-8'));
        for (const p of oldData) {
            if (p.name && p.category) catMapOld[p.name.trim()] = p.category;
            if (p.name && p.etsy_url) urlMapOld[p.name.trim()] = p.etsy_url;
        }
    } catch (e) {
        // ignore
    }

    const csvData = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = [];
    let insideQuote = false;
    let currentLine = "";
    for (let char of csvData) {
        if (char === '"') insideQuote = !insideQuote;
        if (char === '\n' && !insideQuote) {
            lines.push(currentLine);
            currentLine = "";
        } else {
            currentLine += char;
        }
    }
    if (currentLine) lines.push(currentLine);

    if (lines.length === 0) return;
    
    // Parse headers
    function parseCSVLine(line) {
        const row = [];
        let cur = "";
        let inQ = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                if (inQ && line[i+1] === '"') {
                    cur += '"';
                    i++;
                } else {
                    inQ = !inQ;
                }
            } else if (ch === ',' && !inQ) {
                row.push(cur);
                cur = "";
            } else {
                cur += ch;
            }
        }
        row.push(cur);
        return row;
    }

    const unbommed = lines[0].replace(/^\uFEFF/, '');
    const headers = parseCSVLine(unbommed.trim());
    const headerIndex = {};
    headers.forEach((h, i) => headerIndex[h.trim()] = i);

    const products = [];
    let idx = 1;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const rowArr = parseCSVLine(line);
        const row = {};
        for(let j=0; j<headers.length; j++){
            row[headers[j].trim()] = rowArr[j] || "";
        }

        const title = (row["TITLE"] || "").trim();
        if (!title) continue;

        const desc = (row["DESCRIPTION"] || "").trim();
        let rawPrice = parsePrice(row["PRICE"] || "0");
        if (rawPrice <= 0) rawPrice = 9.99;

        const salePrice = Math.round(rawPrice * DISCOUNT_RATE * 100) / 100;
        
        const fullImages = [];
        const thumbImages = [];
        for (let j = 1; j <= 10; j++) {
            let url = (row[`IMAGE${j}`] || "").trim();
            if (url) {
                fullImages.push(buildImageUrl(url, "fullxfull"));
                thumbImages.push(buildImageUrl(url, "794xN"));
            }
        }

        const tags = parseTags(row["TAGS"] || "");
        let category = catMapOld[title];
        if (!category) category = guessCategory(title, desc);
        const difficulty = guessDifficulty(title, desc);

        let etsyUrl = NEW_URLS[title] || urlMapOld[title] || "";

        const slug = slugify(title);
        const shortDesc = desc.replace(/\s+/g, " ").substring(0, 220).trim();

        const quantityText = row["QUANTITY"] || "0";
        const stockQuantity = parseInt(quantityText, 10);
        const inStock = stockQuantity > 0;

        products.push({
            id: `etsy-${idx}`,
            slug: slug,
            name: title,
            category: category,
            price: salePrice,
            originalPrice: rawPrice,
            rating: DEFAULT_RATING,
            reviewCount: DEFAULT_REVIEW_COUNT,
            difficulty: difficulty,
            estimatedTime: DEFAULT_TIME,
            pages: DEFAULT_PAGES,
            description: shortDesc,
            longDescription: desc,
            features: tags.slice(0, 5),
            tags: tags,
            materials: ["Digital Download", "PDF File", "Instant Download"],
            image: fullImages[0] || "",
            thumbnail: thumbImages[0] || "",
            images: fullImages,
            imagesThumbnails: thumbImages,
            etsy_url: etsyUrl,
            bestseller: false,
            inStock: inStock,
            stockQuantity: isNaN(stockQuantity) ? 0 : stockQuantity
        });
        idx++;
    }

    fs.writeFileSync(JSON_OUT, JSON.stringify(products, null, 2), 'utf-8');
    console.log(`Updated ${products.length} products!`);
}

main();
