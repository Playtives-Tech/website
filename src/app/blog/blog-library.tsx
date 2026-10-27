'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { BlogPost } from '@/lib/blog';
import { articleImage, formatArticleDate, readingMinutes } from '@/lib/blog';
import styles from './blog.module.css';

function searchableText(post: BlogPost): string {
  return [post.title, post.excerpt, post.content, post.category, ...(post.tags ?? [])]
    .join(' ')
    .toLowerCase();
}

export function BlogLibrary({
  posts,
  available,
}: {
  posts: BlogPost[];
  available: boolean;
}): React.JSX.Element {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All topics');
  const categories = useMemo(
    () => ['All topics', ...new Set(posts.map((post) => post.category).filter(Boolean))],
    [posts],
  );
  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
      const text = searchableText(post);
      const matchesQuery = !normalizedQuery || text.includes(normalizedQuery);
      const matchesCategory = category === 'All topics' || post.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, posts, query]);

  return (
    <>
      <section className={styles.articles} id="articles" aria-labelledby="articles-title">
        <div className={styles.articleHeading}>
          <div>
            <p className={styles.eyebrow}>The learning library</p>
            <h2 id="articles-title">Ideas for building wealth with intention</h2>
          </div>
          <p>
            {posts.length} {posts.length === 1 ? 'guide' : 'guides'} published
          </p>
        </div>
        <div className={styles.filters}>
          <label className={styles.searchLabel}>
            <span className={styles.visuallyHidden}>Search learning guides</span>
            <span aria-hidden="true" className={styles.searchIcon}>
              ⌕
            </span>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              placeholder="Search wealth topics, questions, or ideas"
            />
          </label>
          <div className={styles.categoryList} aria-label="Filter by topic">
            {categories.map((item) => (
              <button
                className={category === item ? styles.categoryActive : styles.category}
                key={item}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        {filteredPosts.length ? (
          <div className={styles.articleGrid}>
            {filteredPosts.map((post, index) => {
              const image = articleImage(post.coverImageUrl);
              return (
                <Link
                  className={styles.articleCard}
                  href={`/blog/${encodeURIComponent(post.slug)}/`}
                  key={post._id}
                >
                  <div className={`${styles.cardImage} ${!image ? styles.cardImageFallback : ''}`}>
                    {image ? (
                      <img
                        src={image}
                        alt={post.coverImageAlt || ''}
                        loading={index < 3 ? 'eager' : 'lazy'}
                      />
                    ) : (
                      <span aria-hidden="true">{post.category || 'Playtives Journal'}</span>
                    )}
                    <span className={styles.cardCategory}>
                      {post.category || 'Wealth learning'}
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.articleMeta}>
                      {formatArticleDate(post.publishedAt)} <span aria-hidden="true">·</span>{' '}
                      {readingMinutes(post.content)} min read
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <span className={styles.readLink}>
                      Read the guide <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <span className={styles.emptyMark} aria-hidden="true">
              ✳
            </span>
            <h3>
              {posts.length
                ? 'No guides match that search yet'
                : 'The first guides are on their way'}
            </h3>
            <p>
              {posts.length
                ? 'Try another phrase or topic, or browse all published guides.'
                : available
                  ? 'We are preparing practical explainers on wealth, co-ownership and evaluating opportunities. Check back soon.'
                  : 'The learning library is temporarily unavailable. Please try again shortly.'}
            </p>
            {posts.length > 0 && (
              <button
                className={styles.resetButton}
                onClick={() => {
                  setCategory('All topics');
                  setQuery('');
                }}
              >
                Show all guides
              </button>
            )}
          </div>
        )}
        <p className={styles.disclaimer}>
          Our guides are educational and general in nature. They are not personal financial advice,
          a recommendation, or a promise of returns.
        </p>
      </section>
    </>
  );
}
