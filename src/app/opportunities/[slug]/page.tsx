import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './detail.module.css';

type Opportunity = {
  slug: string;
  title: string;
  summary?: string;
  about?: string;
  category?: string;
  location?: string;
  imageUrl?: string;
  imageAlt?: string;
  status?: string;
  acquisitionStatus?: 'OPEN' | 'CLOSED' | 'COMMENCED';
  interestModeEnabled?: boolean;
  publishedAt?: string;
  createdAt?: string;
  memberAvailabilityDate?: string;
  opportunityStructure?: string;
  interestCurrency?: string;
  interestTargetAmount?: number | null;
  pricePerUnitMinorUnits?: number;
  projectedReturnRatePercent?: number;
  equivalentProjectedPercentage?: number | null;
  equivalentProjectedMinimumPercentage?: number | null;
  equivalentProjectedMaximumPercentage?: number | null;
  durationMonths?: number | null;
  durationValue?: number | null;
  durationUnit?: string | null;
  termType?: string;
  returnSchedule?: string;
  availableUnits?: number;
  offerClosesAt?: string | null;
  commencementDate?: string | null;
  distributionStartAt?: string | null;
  projectionDisclaimer?: string;
};

function words(value?: string | null): string {
  return (value ?? '')
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function validImage(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: /^[A-Z]{3}$/.test(currency) ? currency : 'NGN',
    maximumFractionDigits: 0,
  }).format(amount / 100);
}

function formatInterestTarget(amount: number, currency: string): string {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: /^[A-Z]{3}$/.test(currency) ? currency : 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value?: string | null): string {
  if (!value) return 'To be confirmed';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'To be confirmed'
    : new Intl.DateTimeFormat('en', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(date);
}

async function getOpportunity(slug: string): Promise<Opportunity | null> {
  const configuredUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const backendUrl =
    configuredUrl || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001');
  if (!backendUrl) return null;
  try {
    const response = await fetch(
      `${backendUrl.replace(/\/$/, '')}/v1/opportunities/${encodeURIComponent(slug)}`,
      {
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
        headers: { Accept: 'application/json' },
      },
    );
    if (!response.ok) return null;
    return (await response.json()) as Opportunity;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const opportunity = await getOpportunity(slug);
  return { title: opportunity ? `${opportunity.title} — Playtives` : 'Opportunity — Playtives' };
}

function AboutContent({ value }: { value?: string }): React.JSX.Element {
  const lines = (value ?? '').split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  const flushList = (): void => {
    if (list.length)
      blocks.push(
        <ul key={`list-${blocks.length}`}>
          {list.map((item, index) => (
            <li key={index}>{item.replace(/^\*\*(.*?)\*\*$/, '$1')}</li>
          ))}
        </ul>,
      );
    list = [];
  };
  lines.forEach((raw, index) => {
    const line = raw.trim();
    if (!line) {
      flushList();
      return;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      list.push(line.slice(2));
      return;
    }
    flushList();
    const heading = line.match(/^#{1,3}\s+(.+)$/);
    if (heading) blocks.push(<h3 key={`heading-${index}`}>{heading[1]}</h3>);
    else blocks.push(<p key={`paragraph-${index}`}>{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>);
  });
  flushList();
  return (
    <div className={styles.about}>
      {blocks.length ? (
        blocks
      ) : (
        <p>{value || 'Further details are available when you continue to the member dashboard.'}</p>
      )}
    </div>
  );
}

export default async function OpportunityDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;
  const opportunity = await getOpportunity(slug);
  if (!opportunity) notFound();

  const isCollective =
    opportunity.slug.toLowerCase().includes('collective') ||
    opportunity.title.toLowerCase().includes('collective');
  let interestOpen = opportunity.status === 'INTEREST_OPEN';
  if (opportunity.interestModeEnabled && isCollective) {
    const interestStart = new Date(
      opportunity.commencementDate ??
        opportunity.memberAvailabilityDate ??
        opportunity.publishedAt ??
        opportunity.createdAt ??
        '',
    );
    if (!Number.isNaN(interestStart.getTime())) {
      interestStart.setUTCMonth(interestStart.getUTCMonth() + 12);
      interestOpen = Date.now() < interestStart.getTime();
    }
  }
  const isOpen = opportunity.interestModeEnabled
    ? interestOpen
    : opportunity.acquisitionStatus === 'OPEN';
  const statusLabel = opportunity.interestModeEnabled
    ? interestOpen
      ? isCollective
        ? 'Join now'
        : 'Registering interest'
      : 'Interest closed'
    : opportunity.acquisitionStatus === 'OPEN'
      ? 'Open'
      : opportunity.acquisitionStatus === 'COMMENCED'
        ? 'Deal live'
        : 'Offer closed';
  const dashboardUrl = isCollective
    ? 'https://dashboard.playtives.com/collectives'
    : `https://dashboard.playtives.com/discover/${encodeURIComponent(opportunity.slug)}`;
  const actionLabel = !isOpen
    ? 'Continue to dashboard'
    : opportunity.interestModeEnabled
      ? isCollective
        ? 'Ready to join'
        : 'Ready to register interest'
      : opportunity.opportunityStructure === 'CO_FUNDING'
        ? 'Ready to co-fund'
        : opportunity.opportunityStructure === 'FULL_OWNERSHIP'
          ? 'Ready to own'
          : 'Ready to co-own';
  const minimumReturn = opportunity.equivalentProjectedMinimumPercentage;
  const maximumReturn = opportunity.equivalentProjectedMaximumPercentage;
  const rate = opportunity.equivalentProjectedPercentage ?? opportunity.projectedReturnRatePercent;
  const projectedReturn =
    minimumReturn != null && maximumReturn != null
      ? `${minimumReturn}%–${maximumReturn}%`
      : Number(rate) > 0
        ? `${Number(rate)}%`
        : 'Variable';
  const duration =
    opportunity.termType === 'LIFE_OF_ASSET'
      ? 'Life of asset'
      : opportunity.durationValue
        ? `${opportunity.durationValue} ${words(opportunity.durationUnit).toLowerCase()}`
        : opportunity.durationMonths
          ? `${opportunity.durationMonths} months`
          : 'To be confirmed';
  const image = validImage(opportunity.imageUrl);

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <Link className={styles.back} href="/opportunities/">
          ← All opportunities
        </Link>
        <section className={styles.hero}>
          <div className={styles.image}>
            {image ? <img src={image} alt={opportunity.imageAlt || opportunity.title} /> : null}
          </div>
          <div className={styles.heroCopy}>
            <span className={`${styles.status}${isOpen ? '' : ` ${styles.closed}`}`}>
              {statusLabel}
            </span>
            <p className={styles.kicker}>
              {words(opportunity.opportunityStructure)}
              {opportunity.category ? ` · ${opportunity.category}` : ''}
            </p>
            <h1>{opportunity.title}</h1>
            <p className={styles.summary}>{opportunity.summary}</p>
            <a className={styles.action} href={dashboardUrl}>
              {actionLabel}
              <span aria-hidden="true">→</span>
            </a>
            {/* <p className={styles.actionNote}>
              Continue securely in your Playtives member dashboard.
            </p> */}
          </div>
        </section>
        <div className={styles.details}>
          <section className={styles.panel}>
            <h2>About this opportunity</h2>
            <AboutContent value={opportunity.about || opportunity.summary} />
          </section>
          <aside className={styles.panel}>
            <h2>At a glance</h2>
            <dl className={styles.metrics}>
              {opportunity.interestModeEnabled && opportunity.interestTargetAmount != null ? (
                <Metric
                  label="Indicative target"
                  value={formatInterestTarget(
                    opportunity.interestTargetAmount,
                    opportunity.interestCurrency ?? 'NGN',
                  )}
                />
              ) : null}
              {!opportunity.interestModeEnabled ? (
                <Metric
                  label="Price per unit"
                  value={formatMoney(opportunity.pricePerUnitMinorUnits ?? 0, 'NGN')}
                />
              ) : null}
              <Metric label="Projected return" value={projectedReturn} />
              <Metric label="Structure" value={words(opportunity.opportunityStructure)} />
              <Metric label="Return schedule" value={words(opportunity.returnSchedule)} />
              <Metric label="Term" value={duration} />
              <Metric label="Location" value={opportunity.location || 'To be confirmed'} />
              {!opportunity.interestModeEnabled ? (
                <Metric
                  label="Units available"
                  value={Number(opportunity.availableUnits ?? 0).toLocaleString()}
                />
              ) : null}
              <Metric label="Offer closes" value={formatDate(opportunity.offerClosesAt)} />
              <Metric
                label="Deal starts"
                value={formatDate(opportunity.distributionStartAt || opportunity.commencementDate)}
              />
            </dl>
          </aside>
        </div>
        <Link className={styles.learningLink} href="/blog/">
          New to co-ownership? Explore our wealth learning guides <span aria-hidden="true">→</span>
        </Link>
        <p className={styles.disclaimer}>
          {opportunity.projectionDisclaimer ||
            'Projected earnings are estimates and are not guaranteed. Review the full opportunity terms before participating.'}
        </p>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className={styles.metric}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
