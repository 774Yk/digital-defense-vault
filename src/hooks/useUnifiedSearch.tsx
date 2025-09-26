import { useState, useEffect, useMemo } from 'react'
import articlesData from '@/data/dos-articles.json'

export interface Tool {
  id: string
  name: string
  description: string
  category: string
  icon: string
  source_type: string
  website_url: string
  download_url: string
  github_url: string
  tags: string[]
  is_downloadable: boolean
  version: string
  created_at: string
}

interface SearchableArticle {
  id: string
  title: string
  slug: string
  description: string
  category: string
  tags: string[]
  type: 'article'
}

interface SearchableItem {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  type: 'tool' | 'article'
  url?: string
  downloadUrl?: string
  slug?: string
}

export const useUnifiedSearch = (tools: Tool[]) => {
  const [searchResults, setSearchResults] = useState<SearchableItem[]>([])
  
  // Convert articles to searchable format
  const searchableArticles: SearchableArticle[] = useMemo(() => 
    articlesData.map(article => ({
      ...article,
      type: 'article' as const
    })), []
  )
  
  // Convert tools to searchable format
  const searchableTools: SearchableItem[] = useMemo(() => 
    tools.map(tool => ({
      id: tool.id,
      title: tool.name,
      description: tool.description,
      category: tool.category,
      tags: tool.tags || [],
      type: 'tool' as const,
      url: tool.website_url,
      downloadUrl: tool.download_url
    })), [tools]
  )
  
  // Combine all searchable items
  const allSearchableItems: SearchableItem[] = useMemo(() => [
    ...searchableTools,
    ...searchableArticles
  ], [searchableTools, searchableArticles])
  
  const performSearch = (query: string): SearchableItem[] => {
    if (!query.trim()) return []
    
    const lowerQuery = query.toLowerCase()
    
    return allSearchableItems.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(lowerQuery)
      const descriptionMatch = item.description.toLowerCase().includes(lowerQuery)
      const categoryMatch = item.category.toLowerCase().includes(lowerQuery)
      const tagsMatch = item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      
      // Special matching for DoS/DDoS related terms
      const dosTerms = ['dos', 'ddos', 'denial', 'service', 'attack', 'هجوم', 'حرمان', 'خدمة']
      const dosMatch = dosTerms.some(term => 
        item.title.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term) ||
        item.tags.some(tag => tag.toLowerCase().includes(term))
      ) && dosTerms.some(term => lowerQuery.includes(term))
      
      return titleMatch || descriptionMatch || categoryMatch || tagsMatch || dosMatch
    })
  }
  
  return {
    searchableArticles,
    searchableTools,
    allSearchableItems,
    performSearch
  }
}

export default useUnifiedSearch