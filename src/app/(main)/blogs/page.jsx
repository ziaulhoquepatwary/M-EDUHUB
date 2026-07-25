'use client';

import { useState, useMemo } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import BlogCard from './BlogCard';
import PaginationControls from './PaginationControls';
import { blogsData } from '@/data/blogsData';

const CATEGORIES = [
    'All',
    'Development',
    'Technology',
    'Creativity & Design',
    'Professional Development',
    'Sales & Marketing',
    'Freelance Marketplace',
    'Business',
    'Personal Development',
    'Language Learning',
    'Teaching & Academic',
    'Workshop & Live',
];

const BLOGS_PER_PAGE = 9;

export default function BlogsPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredBlogs = useMemo(() => {
        return blogsData.filter((blog) => {
            const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                blog.title.toLowerCase().includes(query) ||
                blog.excerpt.toLowerCase().includes(query) ||
                blog.author.toLowerCase().includes(query);

            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    const totalPages = Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE);
    const paginatedBlogs = useMemo(() => {
        const start = (currentPage - 1) * BLOGS_PER_PAGE;
        return filteredBlogs.slice(start, start + BLOGS_PER_PAGE);
    }, [filteredBlogs, currentPage]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen pt-24 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-6xl mx-auto space-y-5">

                {/* Header */}
                <div className="space-y-4">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                        <span className="bg-gradient-to-r from-[#04cccc] to-[#15a3a3] bg-clip-text text-transparent">
                            EduHub
                        </span>{' '}
                        <span className="text-slate-900 dark:text-slate-100">
                            Knowledge Hub
                        </span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
                        Explore insights, tips, and expert knowledge across technology, design, and business.
                    </p>
                </div>

                {/* Controls: Search & Category */}
                <div className="space-y-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#04cccc] transition-colors"
                        />
                    </div>

                    {/* Responsive Categories: Overflow on small/medium screens, Flex wrap on large screens */}
                    <div className="flex overflow-x-auto lg:flex-wrap gap-2 pb-2 lg:pb-0 scrollbar-none">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategorySelect(category)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === category
                                    ? 'bg-[#04cccc] text-white shadow-sm'
                                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-[#04cccc] dark:hover:border-[#04cccc]'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Blog Grid */}
                {paginatedBlogs.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedBlogs.map((blog) => (
                                <BlogCard key={blog.id} blog={blog} />
                            ))}
                        </div>

                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">
                            No articles found matching your criteria.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('All');
                            }}
                            className="px-4 py-2 rounded-lg bg-[#04cccc] text-white text-xs font-medium hover:opacity-90 transition-opacity"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}

                {/* Newsletter Section (Centered layout) */}
                <section className="p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-teal-500/5 to-transparent border border-cyan-500/20 text-center flex flex-col items-center justify-center">
                    <div className="max-w-xl space-y-4">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            Subscribe to our newsletter
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Get weekly updates with curated articles sent straight to your inbox.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-2 pt-2 w-full max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                required
                                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#04cccc] transition-colors"
                            />
                            <button
                                type="submit"
                                className="px-5 py-2.5 rounded-lg bg-[#04cccc] text-white text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2 transition-opacity whitespace-nowrap"
                            >
                                <span>Subscribe</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </section>

            </div>
        </div>
    );
}