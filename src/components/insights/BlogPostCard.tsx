import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export interface BlogPost {
  id: number | string
  title: string
  slug?: string
  category: string
  image: string
  author: {
    name: string
    avatar: string
    date: string
  }
  readTime: string
  excerpt: string
  href?: string
}

interface BlogPostCardProps {
  post: BlogPost
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const href = post.href || `/insights/${post.slug}` || '#'
  
  const CardContent = () => (
    <div className="overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          loading="lazy"
        />
        <Badge className="absolute left-4 top-4 bg-surface-primary text-content-inverse">
          {post.category}
        </Badge>
      </div>
      <div className="flex flex-col gap-4 p-0 pt-6 flex-grow">
        <h3 className="line-clamp-2 text-3xl font-bold leading-tight text-content-primary text-left">
          {post.title}
        </h3>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.author.avatar} alt={post.author.name} loading="lazy" />
              <AvatarFallback className="bg-surface-tertiary text-content-muted text-xs font-medium">
                {post.author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-base font-medium text-content-primary">{post.author.name}</span>
              <span className="text-sm text-content-muted">{post.author.date}</span>
            </div>
          </div>
          <span className="text-sm text-content-muted">{post.readTime}</span>
        </div>
      </div>
    </div>
  )
  
  return href && href !== '#' ? (
    <Link href={href} className="block h-full">
      <CardContent />
    </Link>
  ) : (
    <CardContent />
  )
}