import type { Metadata } from 'next';
import '@/styles/globals.css';
export const metadata: Metadata = {
  description:
    'Playtives is a community-first co-ownership platform helping Africans at home and abroad access productive assets and commercial opportunities together.',
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
