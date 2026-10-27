import styles from './blog.module.css';

type Heading = { id: string; title: string; level: 2 | 3 };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function articleHeadings(markdown: string): Heading[] {
  return markdown.split(/\r?\n/).flatMap((line) => {
    const match = line.match(/^(##|###)\s+(.+)$/);
    if (!match) return [];
    const title = match[2].replace(/[*_`]/g, '').trim();
    return [{ id: slugify(title), title, level: match[1].length as 2 | 3 }];
  });
}

function safeHref(value: string): string | null {
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

function youtubeVideoId(value: string): string | null {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    const host = url.hostname.toLowerCase();
    let id: string | null = null;
    if (host === 'youtu.be' || host === 'www.youtu.be') {
      id = url.pathname.split('/').filter(Boolean)[0] ?? null;
    } else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)) {
      id =
        url.pathname === '/watch'
          ? url.searchParams.get('v')
          : (url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ?? null);
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

function inline(text: string): React.ReactNode[] {
  const parts = text
    .split(
      /(@\[youtube\]\([^)]+\)|<u>[^<]*<\/u>|<sub>[^<]*<\/sub>|<sup>[^<]*<\/sup>|!\[[^\]]*\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g,
    )
    .filter(Boolean);
  return parts.map((part, index) => {
    const key = `${index}-${part.slice(0, 12)}`;
    const video = part.match(/^@\[youtube\]\(([^)]+)\)$/);
    if (video) {
      const videoId = youtubeVideoId(video[1]);
      return videoId ? (
        <span className={styles.videoEmbed} key={key}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title="YouTube video"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </span>
      ) : null;
    }
    const image = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      const src = safeHref(image[2]);
      return src ? <img className={styles.inlineImage} key={key} src={src} alt={image[1]} /> : null;
    }
    const markup = part.match(/^<(u|sub|sup)>(.*?)<\/\1>$/);
    if (markup) {
      if (markup[1] === 'u') return <u key={key}>{markup[2]}</u>;
      if (markup[1] === 'sub') return <sub key={key}>{markup[2]}</sub>;
      return <sup key={key}>{markup[2]}</sup>;
    }
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={key}>{part.slice(1, -1)}</em>;
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={key}>{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = safeHref(link[2]);
      return href ? (
        <a
          key={key}
          href={href}
          target={href.startsWith('/') ? undefined : '_blank'}
          rel={href.startsWith('/') ? undefined : 'noopener noreferrer'}
        >
          {link[1]}
        </a>
      ) : (
        <span key={key}>{link[1]}</span>
      );
    }
    return <span key={key}>{part}</span>;
  });
}

export function ArticleContent({ markdown }: { markdown: string }): React.JSX.Element {
  const lines = markdown.replace(/\r/g, '').split('\n');
  const blocks: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }
    if (
      index + 1 < lines.length &&
      /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(lines[index + 1].trim())
    ) {
      const cells = (row: string) =>
        row
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((cell) => cell.trim());
      const headers = cells(line);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        rows.push(cells(lines[index]));
        index += 1;
      }
      blocks.push(
        <div className={styles.tableWrap} key={`table-${index}`}>
          <table>
            <thead>
              <tr>
                {headers.map((cell, cellIndex) => (
                  <th key={cellIndex}>{inline(cell)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((_, cellIndex) => (
                    <td key={cellIndex}>{inline(row[cellIndex] ?? '')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const title = heading[2].replace(/[*_`]/g, '').trim();
      const id = slugify(title);
      if (level === 1)
        blocks.push(
          <h2 id={id} key={index}>
            {inline(heading[2])}
          </h2>,
        );
      else if (level === 2)
        blocks.push(
          <h2 id={id} key={index}>
            {inline(heading[2])}
          </h2>,
        );
      else
        blocks.push(
          <h3 id={id} key={index}>
            {inline(heading[2])}
          </h3>,
        );
      index += 1;
      continue;
    }
    const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      const src = safeHref(image[2]);
      if (src) {
        blocks.push(
          <figure className={styles.articleFigure} key={index}>
            <img src={src} alt={image[1]} />
            {image[1] ? <figcaption>{image[1]}</figcaption> : null}
          </figure>,
        );
      }
      index += 1;
      continue;
    }
    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index].trim()))
        quote.push(lines[index++].trim().replace(/^>\s?/, ''));
      blocks.push(
        <blockquote key={`quote-${index}`}>
          {quote.map((item, quoteIndex) => (
            <p key={quoteIndex}>{inline(item)}</p>
          ))}
        </blockquote>,
      );
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim()))
        items.push(lines[index++].trim().replace(/^[-*]\s+/, ''));
      blocks.push(
        <ul key={`list-${index}`}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{inline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    if (/^\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+[.)]\s+/.test(lines[index].trim()))
        items.push(lines[index++].trim().replace(/^\d+[.)]\s+/, ''));
      blocks.push(
        <ol key={`ordered-${index}`}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{inline(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }
    const paragraph = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,3}\s|>\s?|[-*]\s+|\d+[.)]\s+|!\[)/.test(lines[index].trim())
    )
      paragraph.push(lines[index++].trim());
    blocks.push(<p key={`paragraph-${index}`}>{inline(paragraph.join(' '))}</p>);
  }

  return <div className={styles.articleContent}>{blocks}</div>;
}
