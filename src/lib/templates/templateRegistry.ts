export interface TemplateDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  style: 'Modern' | 'Minimal' | 'Cyber' | 'Luxury' | 'Sunset' | 'Elegant' | 'Bold' | 'Gradient';
  isPro: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  previewImage?: string;
  themePreset: string;
  blocks: {
    type: string;
    content: any;
  }[];
}

export const TEMPLATE_CATEGORIES = [
  { id: 'creators', name: '⭐ Creators', icon: 'Sparkles', isFlagship: true },
  { id: 'portfolio', name: 'Portfolio & Personal Brand', icon: 'User' },
  { id: 'business', name: 'Business & Services', icon: 'Briefcase' },
  { id: 'freelancer', name: 'Freelancer', icon: 'Laptop' },
  { id: 'store', name: 'E-commerce & Store', icon: 'ShoppingBag' },
  { id: 'blog', name: 'Blogger & Writer', icon: 'BookOpen' },
  { id: 'education', name: 'Education & Course', icon: 'GraduationCap' },
  { id: 'professional', name: 'Professional & Resume', icon: 'FileText' },
  { id: 'fitness', name: 'Health & Fitness', icon: 'Activity' },
  { id: 'beauty', name: 'Beauty & Lifestyle', icon: 'Heart' },
  { id: 'food', name: 'Food & Restaurant', icon: 'Utensils' },
  { id: 'photography', name: 'Photography & Film', icon: 'Camera' },
  { id: 'music', name: 'Music & Audio', icon: 'Music' },
  { id: 'gaming', name: 'Gaming & Streaming', icon: 'Gamepad2' },
  { id: 'tech', name: 'Technology & Startup', icon: 'Cpu' },
  { id: 'linkinbio', name: 'Link-in-Bio / Mini Web', icon: 'Link2' },
  { id: 'landing', name: 'Landing Page', icon: 'Layout' },
];

export const TEMPLATE_REGISTRY: TemplateDefinition[] = [
  // ==================== FLAGSHIP CATEGORY: CREATORS ====================
  {
    id: 'creator-pro',
    slug: 'creator-pro',
    name: 'Creator Pro',
    description: 'Flagship modern space for multi-platform content creators, vloggers, and influencers.',
    category: 'Creators',
    subcategory: 'Content Creator',
    style: 'Modern',
    isPro: false,
    isFeatured: true,
    isPopular: true,
    isNew: true,
    themePreset: 'modern',
    blocks: [
      {
        type: 'hero',
        content: {
          title: 'Creating Digital Magic & Empowering Creators',
          subtitle: 'Tech Vlogger, Entrepreneur & Community Builder in Dhaka, Bangladesh.',
          ctaText: 'Explore My Space',
          ctaUrl: '#content',
        },
      },
      {
        type: 'links',
        content: {
          title: 'Connect Across Platforms',
          links: [
            { title: 'YouTube Channel (100K Subscribers)', url: 'https://youtube.com' },
            { title: 'Instagram Feed & Stories', url: 'https://instagram.com' },
            { title: 'Join Discord Community', url: 'https://discord.gg' },
            { title: 'EarnSpace Digital Shop', url: '/marketplace' },
          ],
        },
      },
      {
        type: 'video',
        content: {
          title: 'Latest YouTube Masterclass',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'How to build and monetize your personal brand in 2026.',
        },
      },
      {
        type: 'services',
        content: {
          title: 'Products & Brand Sponsorships',
          items: [
            { name: '1-on-1 Creator Mentorship', price: '৳1,500', description: '60 min strategy session on channel growth & monetization.' },
            { name: 'Lightroom Color Presets', price: '৳499', description: 'Cinematic Bangladeshi outdoor photo presets.' },
          ],
        },
      },
      {
        type: 'contact',
        content: {
          title: 'Work With Me',
          email: 'sponsor@creator.com',
          location: 'Dhaka, Bangladesh',
          showSocials: true,
        },
      },
    ],
  },
  {
    id: 'youtuber-studio',
    slug: 'youtuber-studio',
    name: 'YouTuber Studio',
    description: 'Designed specifically for video creators with video carousels, channel stats, and sponsor info.',
    category: 'Creators',
    subcategory: 'YouTuber',
    style: 'Bold',
    isPro: false,
    isFeatured: true,
    themePreset: 'modern',
    blocks: [
      {
        type: 'hero',
        content: {
          title: 'Welcome to My YouTube Headquarters 🎬',
          subtitle: 'Weekly Tech Reviews, Unboxings & Coding Tutorials.',
          ctaText: 'Subscribe on YouTube',
          ctaUrl: 'https://youtube.com',
        },
      },
      {
        type: 'video',
        content: {
          title: 'Featured Upload of the Week',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Top 10 Laptops for Developers in Bangladesh.',
        },
      },
      {
        type: 'gallery',
        content: {
          title: 'Behind The Scenes Studio Setup',
          images: [
            { url: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800', caption: 'Camera & Lighting Studio Setup' },
          ],
        },
      },
      {
        type: 'contact',
        content: {
          title: 'Business Inquiries & Sponsorships',
          email: 'business@youtuber.com',
          location: 'Dhaka, BD',
          showSocials: true,
        },
      },
    ],
  },
  {
    id: 'tiktok-viral-hub',
    slug: 'tiktok-viral-hub',
    name: 'Shorts & TikTok Viral Hub',
    description: 'Mobile-first vertical layout showcasing Reels, Shorts, and instant bio links.',
    category: 'Creators',
    subcategory: 'TikTok / Short Video',
    style: 'Cyber',
    isPro: false,
    isPopular: true,
    themePreset: 'cyber',
    blocks: [
      {
        type: 'hero',
        content: {
          title: 'Viral Shorts & Tech Hacks 🚀',
          subtitle: 'Daily 60-second tips for digital creators & freelancers.',
          ctaText: 'Follow My Reels',
          ctaUrl: '/reels',
        },
      },
      {
        type: 'links',
        content: {
          title: 'Quick Access Links',
          links: [
            { title: '🔥 Latest Viral Reel', url: '#' },
            { title: '🛍️ Download Free Preset Pack', url: '#' },
            { title: '💬 Join VIP Telegram Channel', url: '#' },
          ],
        },
      },
    ],
  },
  {
    id: 'streamer-neon',
    slug: 'streamer-neon',
    name: 'Streamer & Esports Gaming',
    description: 'Futuristic neon aesthetic for Twitch, Kick, and Facebook Gaming streamers.',
    category: 'Creators',
    subcategory: 'Streamer',
    style: 'Cyber',
    isPro: true,
    isFeatured: true,
    themePreset: 'cyber',
    blocks: [
      {
        type: 'hero',
        content: {
          title: 'LIVE STREAMING DAILY 🎮',
          subtitle: 'Competitive Free Fire, Valorant & PUBG Mobile Gameplay.',
          ctaText: 'Watch Live Stream',
          ctaUrl: 'https://twitch.tv',
        },
      },
      {
        type: 'services',
        content: {
          title: 'Gaming Gear Specs & Rig',
          items: [
            { name: 'GPU: RTX 4080 Super', price: 'Specs', description: 'Ultra 4K 144Hz Gaming Performance' },
            { name: 'Mic: Shure SM7B', price: 'Audio', description: 'Broadcast Quality Vocal Setup' },
          ],
        },
      },
      {
        type: 'contact',
        content: {
          title: 'Tournament & Team Sponsorships',
          email: 'esports@streamer.com',
          showSocials: true,
        },
      },
    ],
  },
  {
    id: 'creator-media-kit',
    slug: 'creator-media-kit',
    name: 'Creator Media Kit & Rate Card',
    description: 'Professional media kit template displaying audience demographics, platforms, and collaboration rates.',
    category: 'Creators',
    subcategory: 'Personal Brand',
    style: 'Luxury',
    isPro: true,
    isFeatured: true,
    themePreset: 'elegant',
    blocks: [
      {
        type: 'hero',
        content: {
          title: 'Official Media Kit & Sponsorship Rates 📊',
          subtitle: 'Connecting Premium Brands with 250,000+ Engaged Bangladeshi Tech & Lifestyle Enthusiasts.',
          ctaText: 'Download PDF Media Kit',
          ctaUrl: '#',
        },
      },
      {
        type: 'text',
        content: {
          title: 'Audience Demographics & Reach',
          body: '82% Male | 18% Female • Key Age Group: 18-34 • Top Locations: Dhaka (45%), Chattogram (22%), Sylhet (12%). Average YouTube Engagement Rate: 9.4%.',
        },
      },
      {
        type: 'services',
        content: {
          title: 'Standard Collaboration Packages',
          items: [
            { name: 'Dedicated YouTube Video', price: '৳50,000', description: 'Full 8-12 minute product review & integration.' },
            { name: 'Integrated Video Sponsor Slot', price: '৳20,000', description: '60-90 second dedicated mid-roll sponsor segment.' },
            { name: 'Reels / Shorts Promo Pack', price: '৳15,000', description: '1x Reel + Instagram Story tag + Facebook Share.' },
          ],
        },
      },
      {
        type: 'contact',
        content: {
          title: 'Direct Brand Inquiries',
          email: 'collab@creator.com',
          location: 'Dhaka, Bangladesh',
          showSocials: true,
        },
      },
    ],
  },

  // ==================== PORTFOLIO & PERSONAL BRAND ====================
  {
    id: 'dev-minimal',
    slug: 'dev-minimal',
    name: 'Full-Stack Developer Minimal',
    description: 'Clean, high-performance portfolio for software engineers, web developers, and architects.',
    category: 'Portfolio & Personal Brand',
    subcategory: 'Software Engineer',
    style: 'Minimal',
    isPro: false,
    isPopular: true,
    themePreset: 'minimal',
    blocks: [
      {
        type: 'hero',
        content: {
          title: 'Building Scalable Web Applications & Open-Source Tools',
          subtitle: 'Full-Stack Engineer specialized in TypeScript, Next.js, Node.js, PostgreSQL & Cloud Infrastructure.',
          ctaText: 'View Github Projects',
          ctaUrl: 'https://github.com',
        },
      },
      {
        type: 'text',
        content: {
          title: 'Technical Expertise',
          body: 'Frontend: React, Next.js, TailwindCSS, Redux\nBackend: Node.js, Go, Express, Prisma, REST & GraphQL APIs\nDatabases: PostgreSQL, Redis, Supabase, MongoDB',
        },
      },
      {
        type: 'services',
        content: {
          title: 'Recent Projects & Case Studies',
          items: [
            { name: 'EarnSpace Monetization Platform', price: 'Full Stack', description: 'Built multi-user wallet, bKash integration & real-time feed engine.' },
            { name: 'SaaS Analytics Engine', price: 'Backend', description: 'High-throughput event logging infrastructure handling 10k req/sec.' },
          ],
        },
      },
      {
        type: 'contact',
        content: {
          title: 'Hire / Consult',
          email: 'dev@domain.com',
          showSocials: true,
        },
      },
    ],
  },
  {
    id: 'photographer-lens',
    slug: 'photographer-lens',
    name: 'Photographer & Visual Artist',
    description: 'High-res image masonry portfolio designed for wedding, portrait, and commercial photographers.',
    category: 'Photography & Film',
    subcategory: 'Photographer',
    style: 'Elegant',
    isPro: false,
    themePreset: 'minimal',
    blocks: [
      {
        type: 'hero',
        content: {
          title: 'Capturing Moments, Stories & Emotions 📷',
          subtitle: 'Commercial & Fine Art Photographer based in Dhaka & Available Worldwide.',
          ctaText: 'Book Photo Session',
          ctaUrl: '#contact',
        },
      },
      {
        type: 'gallery',
        content: {
          title: 'Selected Portfolio Highlights',
          images: [
            { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', caption: 'Wedding Elegance' },
            { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', caption: 'Portrait Lighting' },
          ],
        },
      },
      {
        type: 'services',
        content: {
          title: 'Photography Packages',
          items: [
            { name: 'Wedding Full Day Coverage', price: '৳45,000', description: '2 Senior Photographers + Album + Edited High-Res Photos.' },
            { name: 'Commercial Brand Shoot', price: '৳25,000', description: 'Studio Product & Model Photography session.' },
          ],
        },
      },
      {
        type: 'contact',
        content: {
          title: 'Booking & Inquiries',
          email: 'photo@studio.com',
          location: 'Gulshan, Dhaka',
          showSocials: true,
        },
      },
    ],
  },

  // ==================== BUSINESS & SERVICES ====================
  {
    id: 'agency-growth',
    slug: 'agency-growth',
    name: 'Digital Growth Agency',
    description: 'Conversion-focused agency landing page for digital marketing, SEO, and web agencies.',
    category: 'Business & Services',
    subcategory: 'Agency',
    style: 'Modern',
    isPro: true,
    themePreset: 'modern',
    blocks: [
      {
        type: 'hero',
        content: {
          title: 'We Grow Bangladeshi Brands Through Digital Advertising',
          subtitle: 'Data-driven Meta Ads, Google Ads, SEO & High-Converting Website Development.',
          ctaText: 'Get Free Strategy Audit',
          ctaUrl: '#contact',
        },
      },
      {
        type: 'services',
        content: {
          title: 'Our Core Growth Services',
          items: [
            { name: 'Facebook & Instagram Ad Management', price: 'From ৳15,000/mo', description: 'ROI-optimized ad campaigns with custom creative design.' },
            { name: 'Custom E-commerce Web Build', price: 'From ৳30,000', description: 'Fast Next.js online store with bKash/Nagad checkout.' },
          ],
        },
      },
      {
        type: 'contact',
        content: {
          title: 'Schedule a Consultation Call',
          email: 'hello@agency.com',
          location: 'Banani, Dhaka, Bangladesh',
          showSocials: true,
        },
      },
    ],
  },

  // ==================== E-COMMERCE & STORE ====================
  {
    id: 'digital-product-store',
    slug: 'digital-product-store',
    name: 'Digital Product & Course Store',
    description: 'Sell e-books, Lightroom presets, templates, and courses with direct bKash/Nagad checkout.',
    category: 'E-commerce & Store',
    subcategory: 'Digital Products',
    style: 'Modern',
    isPro: false,
    isFeatured: true,
    themePreset: 'modern',
    blocks: [
      {
        type: 'hero',
        content: {
          title: 'Level Up Your Skills with Premium Digital Assets 🛍️',
          subtitle: 'Instant file download after bKash / Nagad payment verification.',
          ctaText: 'Browse Store Items',
          ctaUrl: '/marketplace',
        },
      },
      {
        type: 'services',
        content: {
          title: 'Best Selling Downloads',
          items: [
            { name: 'Next.js 15 Full Stack E-Book', price: '৳799', description: 'Complete step-by-step developer guide with source code.' },
            { name: '15 Cinematic Color Presets', price: '৳499', description: 'Lightroom Mobile & Desktop preset collection.' },
          ],
        },
      },
      {
        type: 'contact',
        content: {
          title: 'Customer Support',
          email: 'support@store.com',
          showSocials: true,
        },
      },
    ],
  },
];
