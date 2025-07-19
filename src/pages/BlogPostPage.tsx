import React from 'react';
import { useParams } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import SEOWrapper from '../components/SEOWrapper';
import NavBarWithPackages from '../components/NavBarWithPackages';
import FooterSection from '../sections/FooterSection';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <>
        <NavBarWithPackages />
        <div className="mt-12">
          <SEOWrapper title="Post Not Found | Blog" description="Sorry, the blog post you are looking for does not exist.">
            <div className="max-w-2xl mx-auto py-16 px-4 md:px-8">
              <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
              <p>The blog post you are looking for does not exist.</p>
            </div>
          </SEOWrapper>
        </div>
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <NavBarWithPackages />
      <div className="mt-12">
        <SEOWrapper title={post.metaTitle} description={post.metaDescription}>
          <div className="max-w-3xl mx-auto py-16 px-2 md:px-4 blog-content">
            {post.coverImage && (
              <img src={post.coverImage} alt={post.title} className="w-full h-64 object-cover rounded mb-6" />
            )}
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <div className="flex items-center text-gray-500 text-sm mb-4">
              <span>{new Date(post.date).toLocaleDateString()}</span>
              {post.author && <span className="ml-4">By {post.author}</span>}
            </div>
            <div className="prose mb-6" dangerouslySetInnerHTML={{ __html: post.content }} />
            {post.ctaLinks && post.ctaLinks.length > 0 && (
              <div className="mt-8 space-x-4">
                {post.ctaLinks.map((cta, idx) => (
                  <a
                    key={idx}
                    href={cta.url}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    target={cta.url.startsWith('http') ? '_blank' : undefined}
                    rel={cta.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {cta.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </SEOWrapper>
      </div>
      <FooterSection />
    </>
  );
};

export default BlogPostPage; 