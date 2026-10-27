import { redirect } from 'next/navigation';

export default async function OpportunityRedirect({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}): Promise<never> {
  const { slug } = await searchParams;
  if (!slug) redirect('/opportunities');
  redirect(`/opportunities/${encodeURIComponent(slug)}/`);
}
