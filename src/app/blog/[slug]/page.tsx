// src/app/blog/[slug]/page.tsx
import { blogPosts } from '@/data/blogPosts';
import type { BlogPost as BlogPostType } from '@/types/blog';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SharedLayout from '@/components/layout/SharedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays, Tags } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Helper to get video ID from YouTube URL
function getYouTubeVideoId(url: string): string | null {
  try {
    const videoUrl = new URL(url);
    if (videoUrl.hostname === 'youtu.be') {
      return videoUrl.pathname.slice(1);
    }
    if (videoUrl.hostname === 'www.youtube.com' || videoUrl.hostname === 'youtube.com') {
      if (videoUrl.pathname === '/watch') {
        return videoUrl.searchParams.get('v');
      }
      if (videoUrl.pathname.startsWith('/embed/')) {
        return videoUrl.pathname.split('/embed/')[1].split('?')[0];
      }
    }
  } catch (error) {
    console.error("Error parsing video URL:", error);
  }
  return null;
}


export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const videoId = post.mediaType === 'video' && post.videoUrl ? getYouTubeVideoId(post.videoUrl) : null;


  return (
    <SharedLayout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" passHref legacyBehavior>
            <Button variant="outline" className="mb-8 group">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Volver al Blog
            </Button>
          </Link>

          <article>
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-3">{post.title}</h1>
              {post.subtitle && (
                <p className="text-lg md:text-xl text-muted-foreground mb-4">{post.subtitle}</p>
              )}
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 mr-1.5" />
                <span>Publicado el {format(new Date(post.publishDate), "d 'de' MMMM 'de' yyyy", { locale: es })}</span>
              </div>
            </header>

            {post.mediaType === 'image' && post.imageUrl && (
              <div className="relative w-full aspect-video rounded-lg shadow-lg overflow-hidden mb-8">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={post.imageHint || 'blog post detail image'}
                  priority
                />
              </div>
            )}

            {post.mediaType === 'video' && videoId && (
              <div className="aspect-video mb-8 rounded-lg shadow-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={post.title || "YouTube video player"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            )}
             {post.mediaType === 'video' && !videoId && post.videoUrl && (
                <div className="mb-8 p-4 border rounded-md bg-muted">
                    <p className="text-muted-foreground">No se pudo mostrar el video. Enlace al video: <a href={post.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{post.videoUrl}</a></p>
                </div>
            )}


            <div
              className="prose prose-lg dark:prose-invert max-w-none mb-8 text-foreground whitespace-pre-wrap"
            >
              {post.content}
            </div>

            {post.hashtags && post.hashtags.length > 0 && (
              <footer className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center mb-2">
                  <Tags className="h-5 w-5 mr-2 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground">Etiquetas</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.hashtags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-sm">{tag}</Badge>
                  ))}
                </div>
              </footer>
            )}
          </article>
        </div>
      </div>
    </SharedLayout>
  );
}
