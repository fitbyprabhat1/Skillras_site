import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import NavBar from '../components/NavBar';
import { BlogPost } from '../types';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft,
  Share2,
  BookOpen,
  Tag,
  Eye,
  Heart,
  MessageCircle
} from 'lucide-react';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the blog post
      const { data: postData, error: postError } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_post_categories (
            blog_categories (
              id,
              name,
              slug
            )
          )
        `)
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (postError) {
        if (postError.code === 'PGRST116') {
          setError('Blog post not found');
        } else {
          throw postError;
        }
        return;
      }

      // Transform post data
      const transformedPost = {
        ...postData,
        categories: postData.blog_post_categories?.map((bpc: any) => bpc.blog_categories) || []
      };

      setPost(transformedPost);

      // Fetch related posts (same categories, excluding current post)
      if (transformedPost.categories.length > 0) {
        const categoryIds = transformedPost.categories.map(cat => cat.id);
        
        const { data: relatedData, error: relatedError } = await supabase
          .from('blog_posts')
          .select(`
            id,
            title,
            slug,
            excerpt,
            featured_image,
            published_at,
            created_at,
            blog_post_categories!inner (
              category_id
            )
          `)
          .eq('published', true)
          .neq('id', transformedPost.id)
          .in('blog_post_categories.category_id', categoryIds)
          .limit(3);

        if (!relatedError && relatedData) {
          setRelatedPosts(relatedData);
        }
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  const sharePost = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark">
        <NavBar />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-dark text-white">
        <NavBar />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-dark-light rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen size={32} className="text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">
              {error || 'Blog Post Not Found'}
            </h1>
            <p className="text-gray-300 mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              to="/blog"
              className="inline-flex items-center bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      <NavBar />
      
      <article className="pt-24 pb-16">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Back to Blog */}
          <Link 
            to="/blog"
            className="inline-flex items-center text-gray-400 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.categories.map((category) => (
                  <span
                    key={category.id}
                    className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                {formatDate(post.published_at || post.created_at)}
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                {getReadingTime(post.content)}
              </div>
              <button
                onClick={sharePost}
                className="flex items-center hover:text-primary transition-colors"
              >
                <Share2 size={16} className="mr-2" />
                Share
              </button>
            </div>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="aspect-video overflow-hidden rounded-xl mb-8">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </header>

          {/* Article Content */}
          <div className="prose prose-lg prose-invert max-w-none mb-12">
            <div 
              className="text-gray-200 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-bold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm text-gray-300 bg-dark-light rounded-lg px-3 py-2 flex items-center"
                  >
                    <Tag size={12} className="mr-2" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Sharing */}
          <div className="border-t border-gray-700 pt-8 mb-12">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Share this article</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={sharePost}
                  className="bg-dark-light hover:bg-dark-lighter text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <Share2 size={16} className="mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-4 bg-dark-light">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold mb-12 text-center">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="bg-dark rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 group"
                >
                  {relatedPost.featured_image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-3">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center text-xs text-gray-400 mt-4">
                      <Calendar size={12} className="mr-1" />
                      {formatDate(relatedPost.published_at || relatedPost.created_at)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of students who have transformed their careers with our courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/courses"
              className="bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              View Courses
            </Link>
            <Link 
              to="/blog"
              className="border border-primary text-primary hover:bg-primary/10 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              More Articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;