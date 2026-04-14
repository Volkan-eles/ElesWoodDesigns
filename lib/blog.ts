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
  }
];

export function getPosts(): BlogPost[] {
  return blogPosts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug);
}
