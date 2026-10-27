export type BlogPost = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  authorName: string;
  publishedAt: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
};

export type BlogPageData = {
  items: BlogPost[];
  page: number;
  total: number;
  totalPages: number;
  available: boolean;
};

function backendOrigin(): string | null {
  const configured = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (configured) return configured.replace(/\/$/, '');
  return process.env.NODE_ENV === 'production' ? null : 'http://localhost:3001';
}

export async function getPublishedBlogPage(limit = 12): Promise<BlogPageData> {
  const origin = backendOrigin();
  if (!origin) return { items: [], page: 1, total: 0, totalPages: 1, available: false };
  try {
    const response = await fetch(`${origin}/v1/blog?page=1&limit=${limit}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return { items: [], page: 1, total: 0, totalPages: 1, available: false };
    const data = (await response.json()) as Omit<BlogPageData, 'available'>;
    return { ...data, items: Array.isArray(data.items) ? data.items : [], available: true };
  } catch {
    return { items: [], page: 1, total: 0, totalPages: 1, available: false };
  }
}

export async function getPublishedBlogPost(slug: string): Promise<BlogPost | null> {
  const origin = backendOrigin();
  if (!origin) return null;
  try {
    const response = await fetch(`${origin}/v1/blog/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return null;
    return (await response.json()) as BlogPost;
  } catch {
    return null;
  }
}

export function readingMinutes(content: string): number {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 200));
}

export function formatArticleDate(value?: string | null): string {
  if (!value) return 'Recently published';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Recently published'
    : new Intl.DateTimeFormat('en', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(date);
}

export function articleImage(value?: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}
