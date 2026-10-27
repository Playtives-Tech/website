import type { Metadata } from 'next';
import { MarketingFooter, MarketingHeader } from '@/components/marketing-chrome';
import { getPublishedBlogPage } from '@/lib/blog';
import { BlogLibrary } from './blog-library';
import styles from './blog.module.css';

export const metadata: Metadata = {
  title: 'Learn about wealth | Playtives',
  description:
    'Practical guides to wealth building, co-ownership, productive assets and evaluating opportunities.',
};

export default async function BlogPage(): Promise<React.JSX.Element> {
  const blog = await getPublishedBlogPage(50);
  return (
    <>
      <MarketingHeader />
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className="wrap">
            <p className={styles.heroEyebrow}>The Playtives learning room</p>
            <h1>Build your understanding of wealth.</h1>
            <p className={styles.heroCopy}>
              Clear, practical learning for making thoughtful decisions about money, ownership and
              opportunity — wherever you are starting from.
            </p>
            <a className={styles.heroLink} href="#articles">
              Browse guides <span aria-hidden="true">↓</span>
            </a>
          </div>
        </header>
        <div className="wrap">
          <BlogLibrary posts={blog.items} available={blog.available} />
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
