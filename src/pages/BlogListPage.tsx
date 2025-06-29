import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import NavBar from '../components/NavBar';
import { BlogPost, BlogCategory } from '../types';
import { 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Filter,
  BookOpen,
  ArrowRight,
  Tag,
  Eye
} from 'lucide-react';
import { useInView } from '../hooks/useInView';

const BlogListPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const { ref, inView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    fetchBlogData();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, selectedCategory]);

  const fetchBlogData = async () => {
    try {
      // Fetch published blog posts
      const { data: postsData, error: postsError } = await supabase
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
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (postsError) throw postsError;

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Transform posts data to include categories
      const transformedPosts = postsData?.map(post => ({
        ...post,
        categories: post.blog_post_categories?.map((bpc: any) => bpc.blog_categories) || []
      })) || [];

      setPosts(transformedPosts);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post =>
        post.categories?.some(cat => cat.slug === selectedCategory)
      );
    }

    setFilteredPosts(filtered);
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

  return (
    <div className="min-h-screen bg-dark text-white">
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-dark via-dark-light to-dark">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center bg-primary/20 border border-primary/30 rounded-full px-6 py-2 mb-8">
            <BookOpen className="text-primary mr-2" size={20} />
            <span className="text-sm font-medium">SkillRas Blog</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Learn, Grow, and <span className="text-primary">Succeed</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Discover expert insights, tutorials, and industry trends to accelerate your digital skills journey.
          </p>
          
          {/* Search and Filter */}
          <div className="bg-dark-light rounded-xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark border border-gray-600 rounded-lg text-white focus:border-primary focus:outline-none"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-dark border border-gray-600 rounded-lg text-white focus:border-primary focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">
              {filteredPosts.length} Article{filteredPosts.length !== 1 ? 's' : ''} Found
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <Filter size={16} />
              <span>
                {selectedCategory === 'all' ? 'All categories' : 
                 categories.find(cat => cat.slug === selectedCategory)?.name}
              </span>
            </div>
          </div>
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-dark-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">No Articles Found</h3>
              <p className="text-gray-300 mb-6">
                Try adjusting your search criteria or browse all articles.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div 
              ref={ref}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPosts.map((post, index) => (
                <article
                  key={post.id}
                  className={`bg-dark-light rounded-xl overflow-hidden transition-all duration-700 transform hover:scale-105 hover:shadow-2xl group ${
                    inView 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {post.featured_image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* Categories */}
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.categories.slice(0, 2).map((category) => (
                          <span
                            key={category.id}
                            className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-xs text-gray-400 bg-dark rounded px-2 py-1 flex items-center"
                          >
                            <Tag size={10} className="mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <div className="flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {formatDate(post.published_at || post.created_at)}
                      </div>
                      <div className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        {getReadingTime(post.content)}
                      </div>
                    </div>
                    
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-primary hover:text-primary-light transition-colors font-medium"
                    >
                      Read More
                      <ArrowRight size={14} className="ml-2" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-4 bg-dark-light">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Stay Updated with Our Latest Articles
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get expert insights and tutorials delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-dark border border-gray-600 rounded-lg text-white focus:border-primary focus:outline-none"
            />
            <button className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogListPage;