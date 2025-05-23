// src/app/blog/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import SharedLayout from '@/components/layout/SharedLayout';
import { blogPosts } from '@/data/blogPosts';
import type { BlogPost as BlogPostType } from '@/types/blog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays } from 'lucide-react';

export default function BlogListPage() {
  const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  return (
    <SharedLayout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Blog WASP</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Mantente al día con nuestras últimas noticias, consejos de seguridad y novedades del sector.
          </p>
        </header>

        {sortedPosts.length === 0 ? (
          <p className="text-center text-lg text-muted-foreground">No hay artículos en el blog por el momento. ¡Vuelve pronto!</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts.map((post) => (
              <Card key={post.slug} className="flex flex-col shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {post.mediaType === 'image' && post.imageUrl && (
                  <div className="relative w-full h-48">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={post.imageHint || 'blog post image'}
                    />
                  </div>
                )}
                {/* Basic video thumbnail placeholder or iframe preview could go here if needed */}
                <CardHeader>
                  <CardTitle className="text-xl lg:text-2xl text-primary hover:underline">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                  {post.subtitle && (
                    <CardDescription className="text-sm text-muted-foreground mt-1">{post.subtitle}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
                    {post.content.substring(0, 150)}...
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground mb-3">
                    <CalendarDays className="h-4 w-4 mr-1.5" />
                    {format(new Date(post.publishDate), "d 'de' MMMM 'de' yyyy", { locale: es })}
                  </div>
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.hashtags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Link href={`/blog/${post.slug}`} passHref legacyBehavior>
                    <Button variant="default" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                      Leer Más
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SharedLayout>
  );
}
