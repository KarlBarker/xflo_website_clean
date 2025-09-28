interface CategoryPillsProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryPills({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-button text-sm font-featured transition-all duration-200 ${
            activeCategory === category
              ? 'bg-surface-primary text-content-inverse'
              : 'bg-surface-light border border-stroke-primary text-content-muted hover:bg-surface-tertiary'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}