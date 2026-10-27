'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { BlogPost } from '@/lib/blog';
import { articleImage, formatArticleDate, readingMinutes } from '@/lib/blog';
import styles from './blog.module.css';

const learningPaths = [
  {
    eyebrow: 'Start here',
    title: 'Build your wealth foundations',
    text: 'Learn the language of saving, investing, risk and long-term wealth building.',
    terms: ['foundation', 'beginner', 'wealth', 'saving', 'investing'],
  },
  {
    eyebrow: 'Understand the model',
    title: 'Learn how co-ownership works',
    text: 'Explore ownership units, shared assets, distributions and the questions to ask.',
    terms: ['co-ownership', 'coownership', 'ownership', 'units', 'distribution'],
  },
  {
    eyebrow: 'Make informed decisions',
    title: 'Assess an opportunity',
    text: 'Understand business fundamentals, due diligence, returns and risks before deciding.',
    terms: ['due diligence', 'risk', 'returns', 'opportunity', 'business'],
  },
];

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
  const [pathTerms, setPathTerms] = useState<string[] | null>(null);
  const [category, setCategory] = useState('All topics');
  const categories = useMemo(
    () => ['All topics', ...new Set(posts.map((post) => post.category).filter(Boolean))],
    [posts],
  );
  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
      const text = searchableText(post);
      const matchesQuery = pathTerms?.length
        ? pathTerms.some((term) => text.includes(term))
        : !normalizedQuery || text.includes(normalizedQuery);
      const matchesCategory = category === 'All topics' || post.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, pathTerms, posts, query]);

  function explorePath(terms: string[]): void {
    setCategory('All topics');
    setPathTerms(terms);
    setQuery('');
    document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <>
      <section className={styles.paths} aria-labelledby="learning-paths-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>A more useful way to learn</p>
            <h2 id="learning-paths-title">Choose what you want to understand</h2>
          </div>
          <p>
            Start with a question or follow a topic. Each guide is designed to help you make sense
            of wealth, not just scroll through articles.
          </p>
        </div>
        <div className={styles.pathGrid}>
          {learningPaths.map((path, index) => (
            <button
              className={styles.pathCard}
              key={path.title}
              onClick={() => explorePath(path.terms)}
            >
              <span className={styles.pathNumber}>{String(index + 1).padStart(2, '0')}</span>
              <span className={styles.pathEyebrow}>{path.eyebrow}</span>
              <span className={styles.pathTitle}>{path.title}</span>
              <span className={styles.pathText}>{path.text}</span>
              <span className={styles.pathAction}>
                Explore guides <span aria-hidden="true">↗</span>
              </span>
            </button>
          ))}
        </div>
      </section>

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
                setPathTerms(null);
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
                  setPathTerms(null);
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
