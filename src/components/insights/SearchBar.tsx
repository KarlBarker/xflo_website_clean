import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = "Search topics" }: SearchBarProps) {
  return (
    <div className="relative mb-8 max-w-md">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-11 bg-surface-light border-stroke-primary text-content-primary placeholder:text-content-muted focus:ring-content-brand focus:border-content-brand"
      />
    </div>
  )
}