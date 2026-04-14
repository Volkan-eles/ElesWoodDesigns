export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author: string;
  category: string;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    slug: "best-wood-for-outdoor-projects",
    title: "The 5 Best Woods for Outdoor Woodworking Projects",
    excerpt: "Choosing the right lumber is critical for durability. Discover which woods stand up to the elements and which to avoid.",
    content: `
      <h2>Why Wood Choice Matters</h2>
      <p>When you're building a pergola, a garden chair, or an outdoor planter, the wood you choose is the single most important factor in how long your project will last.</p>
      
      <h3>1. Western Red Cedar</h3>
      <p>Cedar is the gold standard for outdoor projects. It's naturally resistant to rot and insects, smells great, and looks beautiful with just a clear sealer.</p>
      
      <h3>2. Pressure-Treated Pine</h3>
      <p>The most budget-friendly option. Modern ACQ treatment is safe for garden beds and offers excellent durability, though it can warp more easily than cedar.</p>
      
      <h3>3. Teak</h3>
      <p>If you want pure luxury, teak is the answer. It's incredibly dense and oily, making it nearly impervious to water, though it comes at a premium price.</p>
      
      <h3>4. White Oak</h3>
      <p>Unlike red oak, white oak is very rot-resistant. It's excellent for heavy-duty outdoor furniture that needs to withstand weight and weather.</p>
      
      <h3>5. Redwood</h3>
      <p>Common on the West Coast, redwood contains natural tannins that protect it from moisture. It's a premium choice for high-end decks and architectural features.</p>
    `,
    publishedAt: "2026-04-10",
    author: "ElesWood",
    category: "Tips & Tricks",
    image: "/blog/best_woods_for_outdoor.png"
  },
  {
    slug: "essential-tools-for-beginners",
    title: "10 Essential Tools for Beginner Woodworkers",
    excerpt: "Don't break the bank! Here are the 10 must-have tools you need to start building our plans today.",
    content: `
      <h2>Starting Your DIY Journey</h2>
      <p>You don't need a professional shop to build great furniture. Start with these basics and grow your collection as you go.</p>
      <ol>
        <li>Circular Saw</li>
        <li>Drill & Impact Driver Set</li>
        <li>Random Orbit Sander</li>
        <li>Speed Square</li>
        <li>Tape Measure</li>
        <li>Kreg Jig (Optional but recommended)</li>
        <li>Clamps (You can never have enough!)</li>
        <li>Chisel Set</li>
        <li>Block Plane</li>
        <li>Eye and Ear Protection</li>
      </ol>
    `,
    publishedAt: "2026-04-12",
    author: "ElesWood",
    category: "Guides",
    image: "/blog/essential_woodworking_tools.png"
  },
  {
    slug: "diy-pergola-plans-for-beginners",
    title: "DIY Pergola Plans for Beginners: How to Build Your Own",
    excerpt: "Looking for a weekend project that transforms your backyard? Our beginner-friendly pergola guide is the perfect place to start.",
    content: `
      <h2>Why Build a Pergola?</h2>
      <p>A pergola is the perfect architectural addition to any garden. It provides shade, supports climbing plants, and defines your outdoor living space.</p>
      <h3>Step 1: Location and Footings</h3>
      <p>Choose a level spot. We recommend using 6x6 posts for a substantial, professional look. Ensure your post bases are set deep enough to resist local frost lines.</p>
      <h3>Step 2: Joists and Rafters</h3>
      <p>Precision is key. Our plans use detailed templates for decorative rafter tails that give your pergola that professional "custom-built" finish.</p>
    `,
    publishedAt: "2026-04-14",
    author: "ElesWood",
    category: "Garden",
    image: "/blog/best_woods_for_outdoor.png"
  },
  {
    slug: "modern-farmhouse-table-guide",
    title: "Crafting a Modern Farmhouse Dining Table",
    excerpt: "Learn the secrets to building a table that is both structurally sound and aesthetically stunning for your dining room.",
    content: `
      <h2>The Heart of the Home</h2>
      <p>Building a table is a rite of passage for woodworkers. Our modern farmhouse design balances rustic charm with clean, contemporary lines.</p>
      <h3>The Importance of Breadboards</h3>
      <p>Don't just screw your ends on! We explain how to correctly implement breadboard ends to allow for natural wood movement throughout the seasons.</p>
    `,
    publishedAt: "2026-04-15",
    author: "ElesWood",
    category: "Furniture",
    image: "/blog/essential_woodworking_tools.png"
  },
  {
    slug: "wood-storage-shed-blueprints",
    title: "Essential Wood Storage Shed Blueprints",
    excerpt: "Keep your firewood dry and organized with these efficient and stylish storage shed designs.",
    content: `
      <h2>Stay Dry, Build Smart</h2>
      <p>Seasoned wood is essential for efficient heating. A well-designed wood shed allows for maximum airflow while protecting your stack from rain and snow.</p>
    `,
    publishedAt: "2026-04-16",
    author: "ElesWood",
    category: "Garden",
    image: "/blog/best_woods_for_outdoor.png"
  },
  {
    slug: "5-beginner-woodworking-projects",
    title: "5 Easy Woodworking Projects for Total Beginners",
    excerpt: "New to the craft? Start with these simple, high-impact projects that require only basic tools.",
    content: `
      <h2>Start Building Today</h2>
      <p>Don't let a lack of experience hold you back. These five projects are designed to be completed in a few hours with minimal tools.</p>
      <ul>
        <li>Modern Square Planters</li>
        <li>Simple Floating Shelves</li>
        <li>A-Frame Workbench</li>
        <li>Custom Cutting Board</li>
        <li>Outdoor Side Table</li>
      </ul>
    `,
    publishedAt: "2026-04-17",
    author: "ElesWood",
    category: "Guides",
    image: "/blog/essential_woodworking_tools.png"
  },
  {
    slug: "how-to-build-a-roadside-farmstand",
    title: "How to Build a Roadside Farmstand from Scratch",
    excerpt: "Turn your homegrown produce into a business with this professional, mobile farmstand design.",
    content: `
      <h2>From Garden to Retail</h2>
      <p>A good farmstand needs to be durable, eye-catching, and easy to clean. Our plans focus on modular design so you can scale your stand as your business grows.</p>
    `,
    publishedAt: "2026-04-18",
    author: "ElesWood",
    category: "Garden",
    image: "/blog/best_woods_for_outdoor.png"
  },
  {
    slug: "best-finish-for-indoor-furniture",
    title: "The Ultimate Guide to Indoor Furniture Finishes",
    excerpt: "Polyurethane, Oil, or Wax? Learn which finish is right for your project to provide beauty and durability.",
    content: `
      <h2>Protecting Your Hard Work</h2>
      <p>The finish is what makes your project pop. We compare the durability and application ease of the top five furniture finishes.</p>
    `,
    publishedAt: "2026-04-19",
    author: "ElesWood",
    category: "Tips & Tricks",
    image: "/blog/essential_woodworking_tools.png"
  },
  {
    slug: "smart-workshop-organization-hacks",
    title: "10 Smart Workshop Organization Hacks",
    excerpt: "Small shop? No problem. These organization tips will help you maximize your space and boost your productivity.",
    content: `
      <h2>Work Smarter, Not Harder</h2>
      <p>A cluttered shop is a dangerous shop. Learn how to implement french cleats and mobile carts to reclaim your workspace.</p>
    `,
    publishedAt: "2026-04-20",
    author: "ElesWood",
    category: "Guides",
    image: "/blog/best_woods_for_outdoor.png"
  },
  {
    slug: "building-safe-outdoor-playhouses",
    title: "Building Safe and Fun Outdoor Playhouses",
    excerpt: "Ensure your kids' playhouse is built to last and meet safety standards with our expert advice.",
    content: `
      <h2>Built for Adventure</h2>
      <p>Safety is the top priority when building for children. We cover rail heights, non-toxic finishes, and structural stability for your backyard playhouse.</p>
    `,
    publishedAt: "2026-04-21",
    author: "ElesWood",
    category: "Kids",
    image: "/blog/essential_woodworking_tools.png"
  },
  {
     slug: "essential-sanding-secrets-for-pro-results",
     title: "Essential Sanding Secrets for Professional Results",
     excerpt: "The difference between an amateur and professional look is often in the sanding. Learn how to do it right.",
     content: `
       <h2>The Grind is Real</h2>
       <p>No one likes sanding, but it's the most critical step. We explain how to move through the grits and how to verify you're ready for finish.</p>
     `,
     publishedAt: "2026-04-22",
     author: "ElesWood",
     category: "Tips & Tricks",
     image: "/blog/best_woods_for_outdoor.png"
   },
   {
     slug: "woodworking-safety-essentials",
     title: "Woodworking Safety Essentials: Protect Your Hands and Eyes",
     excerpt: "Safety should never be an afterthought. This guide covers the absolute basics of shop safety.",
     content: `
       <h2>Stay Safe, Keep Building</h2>
       <p>From push sticks to proper eye protection, we list the gear and habits that will keep you safe in the shop for years to come.</p>
     `,
     publishedAt: "2026-04-23",
     author: "ElesWood",
     category: "Guides",
     image: "/blog/essential_woodworking_tools.png"
   }
];

export function getPosts(): BlogPost[] {
  return blogPosts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug);
}
