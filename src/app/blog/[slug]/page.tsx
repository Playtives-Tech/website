import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MarketingFooter, MarketingHeader } from '@/components/marketing-chrome';
import {
  articleImage,
  formatArticleDate,
  getPublishedBlogPage,
  getPublishedBlogPost,
  readingMinutes,
} from '@/lib/blog';
import { ArticleContent, articleHeadings } from '../article-content';
import styles from '../blog.module.css';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  return post
    ? { title: `${post.title} | Playtives Learn`, description: post.excerpt }
    : { title: 'Guide not found | Playtives Learn' };
}

export default async function BlogArticlePage({ params }: Props): Promise<React.JSX.Element> {
  const { slug } = await params;
  const [post, library] = await Promise.all([getPublishedBlogPost(slug), getPublishedBlogPage(50)]);
  if (!post) notFound();

  const headings = articleHeadings(post.content);
  const image = articleImage(post.coverImageUrl);
  const relatedPosts = library.items
    .filter(
      (item) =>
        item.slug !== post.slug &&
        (item.category === post.category ||
          (item.tags ?? []).some((tag) => (post.tags ?? []).includes(tag))),
    )
    .slice(0, 3);

  return (
    <>
      <MarketingHeader />
      <main className={styles.articlePage}>
        <div className="wrap">
          <Link className={styles.backLink} href="/blog/">
            ← Back to the learning library
          </Link>
          <article>
            <header className={styles.articleHero}>
              <span className={styles.articlePill}>{post.category || 'Wealth learning'}</span>
              <h1>{post.title}</h1>
              <p className={styles.articleExcerpt}>{post.excerpt}</p>
              <div className={styles.byline}>
                {'Playtives'} <span aria-hidden="true">·</span>{' '}
                {formatArticleDate(post.publishedAt)} <span aria-hidden="true">·</span>{' '}
                {readingMinutes(post.content)} min read
              </div>
              {image && (
                <div className={styles.articleCover}>
                  <img src={image} alt={post.coverImageAlt || post.title} />
                </div>
              )}
            </header>
            <div className={styles.readerLayout}>
              {headings.length > 0 && (
                <aside className={styles.contents}>
                  <p>In this guide</p>
                  <nav aria-label="Article contents">
                    {headings.map((heading) => (
                      <a
                        className={heading.level === 3 ? styles.subheadingLink : ''}
                        href={`#${heading.id}`}
                        key={heading.id}
                      >
                        {heading.title}
                      </a>
                    ))}
                  </nav>
                </aside>
              )}
              <ArticleContent markdown={post.content} />
            </div>
          </article>
          {/* <aside className={styles.learningNote}>
            <span aria-hidden="true">✳</span>
            <div>
              <strong>Keep learning with Playtives</strong>
              <p>
                Understanding the model, the terms and the risks is part of building wealth with
                intention.
              </p>
            </div>
            <Link href="/blog/">
              Explore more guides <span aria-hidden="true">→</span>
            </Link>
          </aside> */}
          {relatedPosts.length > 0 && (
            <section className={styles.related}>
              <div className={styles.sectionHeading}>
                <div>
                  <p className={styles.eyebrow}>Continue learning</p>
                  <h2>Related guides</h2>
                </div>
                <Link href="/blog/">All guides →</Link>
              </div>
              <div className={styles.relatedGrid}>
                {relatedPosts.map((item) => (
                  <Link href={`/blog/${encodeURIComponent(item.slug)}/`} key={item._id}>
                    <span>
                      {item.category || 'Wealth learning'} · {readingMinutes(item.content)} min read
                    </span>
                    <strong>{item.title}</strong>
                    <span className={styles.relatedArrow}>Read guide →</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
