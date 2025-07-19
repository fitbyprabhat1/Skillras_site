import React from 'react';
import { blogPosts } from '../data/blogPosts';
import { Link } from 'react-router-dom';
import SEOWrapper from '../components/SEOWrapper';
import NavBarWithPackages from '../components/NavBarWithPackages';
import FooterSection from '../sections/FooterSection';

const BlogListPage: React.FC = () => {
  return (
    <>
      <NavBarWithPackages />
      <div className="mt-12">
        <SEOWrapper
          title="Blog | Latest SEO & Marketing Tips"
          description="Read the latest blog posts on SEO, marketing, and ranking your website on Google."
        >
          <div className="max-w-5xl mx-auto py-8 px-2 md:px-4">
            <h1 className="text-3xl font-bold mb-6">Blog</h1>
            <div className="space-y-8">
              {blogPosts.map(post => (
                <div key={post.id} className="border-b pb-6">
                  {post.coverImage && (
                    <img src={post.coverImage} alt={post.title} className="w-full h-48 object-cover rounded mb-4" />
                  )}
                  <h2 className="text-2xl font-semibold mb-2">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-gray-500 text-sm mb-2">{new Date(post.date).toLocaleDateString()}</p>
                  <p className="mb-2">{post.excerpt}</p>
                  <Link to={`/blog/${post.slug}`} className="text-blue-600 hover:underline font-medium">Read More</Link>
                </div>
              ))}
            </div>
          </div>
        </SEOWrapper>
      </div>
      <FooterSection />
    </>
  );
};

export default BlogListPage; 