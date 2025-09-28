'use client'

import { useState } from 'react'
import { BlogHeader } from './BlogHeader'
import { BlogGrid } from './BlogGrid'
import { BlogPost } from '@/components/insights'

interface InsightsContentProps {
  initialPosts: BlogPost[]
  categories: string[]
}

export function InsightsContent({ initialPosts, categories }: InsightsContentProps) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filter posts based on current search and category
  const filteredPosts = initialPosts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="container-inner">
      <BlogHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      {filteredPosts.length > 0 ? (
        <BlogGrid posts={filteredPosts} />
      ) : (
        <div className="text-center py-12">
          <h3 className="title-3xl text-content-primary mb-4">
            {searchQuery ? 'No posts found' : 'No insights available yet'}
          </h3>
          <p className="text-content-muted mb-6">
            {searchQuery 
              ? 'Try adjusting your search terms or browse all categories.' 
              : 'We\'re working on bringing you valuable insights. Check back soon!'
            }
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('All')
              }}
              className="text-content-brand hover:underline"
            >
              Clear search and show all posts
            </button>
          )}
        </div>
      )}
    </div>
  )
}