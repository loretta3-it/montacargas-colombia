// src/types/blog.ts
export interface BlogPost {
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  mediaType: 'image' | 'video' | 'none';
  imageUrl?: string;
  imageHint?: string; // For data-ai-hint
  videoUrl?: string; // Full embed URL for videos
  hashtags?: string[];
  publishDate: string; // ISO date string e.g., "2024-07-30"
}
