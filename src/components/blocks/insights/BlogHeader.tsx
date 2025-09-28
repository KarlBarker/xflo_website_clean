import { SearchBar } from '@/components/insights/SearchBar'
import { CategoryPills } from '@/components/insights/CategoryPills'

interface BlogHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function BlogHeader({
  searchQuery,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange
}: BlogHeaderProps) {
  return (
    <div className="mb-12">
      <h1 className="title-6xl text-content-primary mb-8 md:mb-12">
        Insights
      </h1>
      
      <SearchBar 
        value={searchQuery}
        onChange={onSearchChange}
      />
      
      <CategoryPills
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
      />
    </div>
  )
}