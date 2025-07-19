export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  date: string;
  coverImage?: string;
  author?: string;
  ctaLinks?: Array<{ label: string; url: string }>;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How to Rank Your Blog on Google in 2024',
    slug: 'rank-blog-on-google-2024',
    content: `
  <p>This is my first paragraph.</p>
  <img src="https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg" alt="Photo 1" style="margin-bottom:16px;"/>
  <p>This is another paragraph with an image below:</p>
  <img src="/public/photo2.jpg" alt="Photo 2" style="margin-bottom:16px;"/>
  <p>And you can add more images as needed.</p>
`,
    excerpt: 'Learn the latest SEO strategies to rank your blog on Google in 2024.',
    metaTitle: 'How to Rank Your Blog on Google in 2024 | My Blog',
    metaDescription: 'Discover actionable SEO tips and strategies to help your blog rank higher on Google in 2024.',
    date: '2024-07-08',
    coverImage: '/public/android-chrome-512x512.png',
    author: 'Jane Doe',
    ctaLinks: [
      { label: 'Download SEO Checklist', url: '/downloads/seo-checklist.pdf' },
      { label: 'Contact Us', url: '/contact' }
    ]
  },
  {
    id: '2',
    title: 'Meta Tags for SEO: Best Practices',
    slug: 'meta-tags-seo-best-practices',
    content: `<p>Meta tags are essential for SEO. This guide explains which meta tags matter most and how to use them effectively...</p>`,
    excerpt: 'A complete guide to using meta tags for better SEO.',
    metaTitle: 'Meta Tags for SEO: Best Practices | My Blog',
    metaDescription: 'Learn which meta tags are most important for SEO and how to implement them for maximum impact.',
    date: '2024-07-07',
    coverImage: '/public/android-chrome-192x192.png',
    author: 'John Smith',
    ctaLinks: [
      { label: 'Read More SEO Tips', url: '/blog' }
    ]
  }
]; 