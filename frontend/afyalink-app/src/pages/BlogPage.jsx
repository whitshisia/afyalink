import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, Search, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock blog posts (in production, fetch from API)
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Telemedicine in Kenya",
      excerpt: "Explore how telemedicine is transforming healthcare access across Kenya, making quality care available to everyone.",
      content: "Lorem ipsum...",
      author: "Dr. Sarah Wanjiku",
      authorAvatar: "SW",
      date: "2025-01-15",
      readTime: "5 min read",
      category: "telemedicine",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
      tags: ["telemedicine", "healthcare", "technology"]
    },
    {
      id: 2,
      title: "Managing Chronic Diseases with Digital Tools",
      excerpt: "Learn how digital health platforms are helping patients manage chronic conditions more effectively.",
      author: "Dr. James Otieno",
      authorAvatar: "JO",
      date: "2025-01-10",
      readTime: "7 min read",
      category: "chronic-diseases",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
      tags: ["chronic diseases", "digital health", "patient care"]
    },
    {
      id: 3,
      title: "Mental Health Awareness in the Digital Age",
      excerpt: "Breaking the stigma around mental health and how online platforms are making support more accessible.",
      author: "Dr. Mercy Kimani",
      authorAvatar: "MK",
      date: "2025-01-05",
      readTime: "6 min read",
      category: "mental-health",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800",
      tags: ["mental health", "wellness", "support"]
    },
    {
      id: 4,
      title: "Tips for a Successful Virtual Consultation",
      excerpt: "Prepare for your telemedicine appointment with these practical tips for a smooth experience.",
      author: "Dr. Michael Okello",
      authorAvatar: "MO",
      date: "2024-12-28",
      readTime: "4 min read",
      category: "telemedicine",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800",
      tags: ["telemedicine", "tips", "patient guide"]
    },
    {
      id: 5,
      title: "Understanding Your Medical Records",
      excerpt: "A guide to help patients understand and make the most of their electronic health records.",
      author: "Dr. Ann Wambui",
      authorAvatar: "AW",
      date: "2024-12-20",
      readTime: "8 min read",
      category: "education",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
      tags: ["medical records", "education", "patient rights"]
    },
    {
      id: 6,
      title: "Preventive Healthcare: What You Need to Know",
      excerpt: "Learn about preventive measures and regular check-ups that can save lives.",
      author: "Dr. Peter Maina",
      authorAvatar: "PM",
      date: "2024-12-15",
      readTime: "5 min read",
      category: "preventive-care",
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800",
      tags: ["preventive care", "health tips", "wellness"]
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts(blogPosts);
      setLoading(false);
    }, 500);
  }, []);

  const categories = [
    { value: 'all', label: 'All Posts' },
    { value: 'telemedicine', label: 'Telemedicine' },
    { value: 'mental-health', label: 'Mental Health' },
    { value: 'chronic-diseases', label: 'Chronic Diseases' },
    { value: 'education', label: 'Education' },
    { value: 'preventive-care', label: 'Preventive Care' }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Health Insights Blog</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Expert advice, latest news, and insights on healthcare in Africa
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                    selectedCategory === cat.value
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${post.image})` }} />
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Calendar size={12} />
                      <span>{formatDate(post.date)}</span>
                      <span>•</span>
                      <Clock size={12} />
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-bold">
                          {post.authorAvatar}
                        </div>
                        <span className="text-sm text-gray-600">{post.author}</span>
                      </div>
                      <Link
                        to={`/blog/${post.id}`}
                        className="text-brand-600 text-sm font-medium hover:text-brand-700 flex items-center gap-1"
                      >
                        Read More <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;