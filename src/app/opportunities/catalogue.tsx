'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type Opportunity = {
  _id: string;
  slug: string;
  title: string;
  summary?: string;
  category?: string;
  location?: string;
  imageUrl?: string;
  imageAlt?: string;
  status: string;
  acquisitionStatus: 'OPEN' | 'CLOSED' | 'COMMENCED';
  interestModeEnabled?: boolean;
  opportunityStructure?: string;
  pricePerUnitMinorUnits?: number;
  projectedReturnRatePercent?: number;
  equivalentProjectedPercentage?: number | null;
  commencementDate?: string;
  memberAvailabilityDate?: string;
  publishedAt?: string;
  createdAt?: string;
};

function isCollective(opportunity: Opportunity): boolean {
  const title = opportunity.title.toLowerCase();
  const slug = opportunity.slug.toLowerCase();
  return (
    (title.includes('collective') && (title.includes('wealth') || title.includes('playtives'))) ||
    slug.includes('wealth-collective') ||
    slug.includes('playtives-collective')
  );
}

function isInterestOpen(opportunity: Opportunity): boolean {
  if (!isCollective(opportunity)) return opportunity.status === 'INTEREST_OPEN';
  const start = new Date(
    opportunity.commencementDate ??
      opportunity.memberAvailabilityDate ??
      opportunity.publishedAt ??
      opportunity.createdAt ??
      '',
  );
  if (Number.isNaN(start.getTime())) return opportunity.status === 'INTEREST_OPEN';
  start.setUTCMonth(start.getUTCMonth() + 12);
  return Date.now() < start.getTime();
}

function safeImageUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function StateIcon({ kind }: { kind: 'loading' | 'search' | 'opportunity' | 'error' }) {
  if (kind === 'loading') {
    return (
      <svg className="state-spinner" viewBox="0 0 40 40" aria-hidden="true">
        <circle className="state-spinner-track" cx="20" cy="20" r="16" />
        <circle className="state-spinner-progress" cx="20" cy="20" r="16" />
      </svg>
    );
  }

  if (kind === 'search') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.2 4.2" />
      </svg>
    );
  }

  if (kind === 'error') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3.5 21 20H3l9-16.5Z" />
        <path d="M12 9v5m0 3h.01" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 8.5h16v11H4z" />
      <path d="M9 8.5V6h6v2.5M4 12h16m-10 0v1.5h4V12" />
    </svg>
  );
}

function compactNaira(minorUnits: number): string {
  const amount = minorUnits / 100;
  if (amount >= 1_000_000) return `₦${Number((amount / 1_000_000).toFixed(1))}M`;
  if (amount >= 1_000) return `₦${Number((amount / 1_000).toFixed(1))}K`;
  return `₦${Math.round(amount).toLocaleString('en-NG')}`;
}

function OpportunityCard({ opportunity }: { opportunity: Opportunity }): React.JSX.Element {
  const collective = isCollective(opportunity);
  const interestOpen = isInterestOpen(opportunity);
  const open = opportunity.interestModeEnabled
    ? interestOpen
    : opportunity.acquisitionStatus === 'OPEN';
  const structure =
    opportunity.opportunityStructure === 'CO_FUNDING'
      ? 'CO-FUND'
      : opportunity.opportunityStructure === 'FULL_OWNERSHIP'
        ? 'OWN'
        : 'CO-OWN';
  const badge = opportunity.interestModeEnabled
    ? interestOpen
      ? collective
        ? 'JOIN NOW'
        : 'REGISTER INTEREST'
      : 'INTEREST CLOSED'
    : `${compactNaira(opportunity.pricePerUnitMinorUnits ?? 0)} · ${structure}`;
  const rate = opportunity.equivalentProjectedPercentage ?? opportunity.projectedReturnRatePercent;
  const footer = opportunity.interestModeEnabled
    ? interestOpen
      ? collective
        ? 'Join now'
        : 'Register interest'
      : 'Registration closed'
    : Number(rate) > 0
      ? `${Number(rate).toFixed(1).replace(/\.0$/, '')}% projected`
      : 'View opportunity';
  const href = `/opportunities/${encodeURIComponent(opportunity.slug)}/`;
  const imageUrl = safeImageUrl(opportunity.imageUrl);

  return (
    <a
      className="opportunity-card"
      href={href}
      aria-label={`View details for ${opportunity.title}`}
    >
      <div className="card-image">
        {imageUrl ? (
          <img src={imageUrl} alt={opportunity.imageAlt || opportunity.title} loading="lazy" />
        ) : null}
        <span className={`status${open ? '' : ' closed'}`}>{badge}</span>
      </div>
      <div className="card-body">
        <span className="card-kicker">⚡ VETTED OPPORTUNITIES</span>
        <h4 className="card-title" title={opportunity.title}>
          {opportunity.title}
        </h4>
        <p className="card-subtitle">{footer}</p>
      </div>
    </a>
  );
}

export function OpportunityCatalogue(): React.JSX.Element {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('All');
  const [availability, setAvailability] = useState<'OPEN' | 'CLOSED'>('OPEN');

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/opportunities', { cache: 'no-store', signal });
      const result: unknown = await response.json();
      if (!response.ok) {
        throw new Error(
          typeof result === 'object' && result !== null && 'error' in result
            ? String(result.error)
            : 'Could not load opportunities',
        );
      }
      if (!Array.isArray(result)) throw new Error('Unexpected opportunity response');
      setOpportunities(result as Opportunity[]);
    } catch (cause) {
      if (signal?.aborted) return;
      setError(cause instanceof Error ? cause.message : 'Could not load opportunities');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const sectors = useMemo(
    () => [
      'All',
      ...new Set(
        opportunities
          .map((item) => item.category)
          .filter((value): value is string => Boolean(value)),
      ),
    ],
    [opportunities],
  );
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return opportunities.filter(
      (item) =>
        (sector === 'All' || item.category === sector) &&
        `${item.title} ${item.summary ?? ''} ${item.location ?? ''}`
          .toLowerCase()
          .includes(normalized),
    );
  }, [opportunities, query, sector]);
  const interest = filtered.filter(
    (item) =>
      item.interestModeEnabled &&
      (availability === 'OPEN' ? isInterestOpen(item) : !isInterestOpen(item)),
  );
  const regular = filtered.filter(
    (item) =>
      (!item.interestModeEnabled || isCollective(item)) &&
      (isCollective(item)
        ? availability === 'OPEN'
          ? isInterestOpen(item)
          : !isInterestOpen(item)
        : availability === 'OPEN'
          ? item.acquisitionStatus === 'OPEN'
          : item.acquisitionStatus !== 'OPEN'),
  );
  const hasFilters = Boolean(query.trim()) || sector !== 'All';

  function clearFilters() {
    setQuery('');
    setSector('All');
  }

  return (
    <section className="catalogue" aria-labelledby="catalogue-title">
      <div className="wrap">
        <div className="catalogue-heading">
          <div>
            <h2 id="catalogue-title">Explore opportunities</h2>
            <p>Explore what you can own together.</p>
          </div>
          {!loading && !error ? (
            <span className="count-pill">{opportunities.length} opportunities</span>
          ) : null}
        </div>
        {/* <p className={`catalogue-connection${error ? ' error' : ''}`} role="status">
          {loading
            ? 'Connecting to Playtives backend…'
            : error
              ? `Backend connection failed: ${error}`
              : `Connected to Playtives backend · ${opportunities.length} public opportunities loaded`}
        </p> */}
        <label className="catalogue-search">
          <span className="sr-only">Search opportunities</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder="Search what you would like to own or co-own"
          />
        </label>
        <div className="catalogue-sectors" aria-label="Filter by sector">
          {sectors.map((label) => (
            <button
              key={label}
              type="button"
              className={sector === label ? 'selected' : ''}
              onClick={() => setSector(label)}
            >
              {label}
            </button>
          ))}
        </div>
        {!loading && !error && interest.length > 0 ? (
          <section className="join-now">
            <div className="catalogue-section-heading">
              <div>
                <h3>{availability === 'OPEN' ? 'JOIN NOW' : 'CLOSED INTERESTS'}</h3>
                <p>Browse upcoming opportunities.</p>
              </div>
              <span>{interest.length} available</span>
            </div>
            <div className="opportunity-grid">
              {interest.map((item) => (
                <OpportunityCard key={item._id} opportunity={item} />
              ))}
            </div>
          </section>
        ) : null}
        <div className="catalogue-section-heading">
          <div>
            <h3>{availability === 'OPEN' ? 'Open opportunities' : 'Closed opportunities'}</h3>
            <p>Available to co-own or co-fund.</p>
          </div>
          <span>{regular.length} opportunities</span>
        </div>
        <div className="catalogue-tabs" role="tablist" aria-label="Opportunity availability">
          <button
            type="button"
            role="tab"
            aria-selected={availability === 'OPEN'}
            onClick={() => setAvailability('OPEN')}
          >
            All opportunities
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={availability === 'CLOSED'}
            onClick={() => setAvailability('CLOSED')}
          >
            Closed opportunities
          </button>
        </div>
        <div className="opportunity-grid" aria-live="polite" aria-busy={loading}>
          {loading ? (
            <div className="state state-loading" role="status">
              <span className="state-icon state-icon-loading">
                <StateIcon kind="loading" />
              </span>
              <h3>Finding opportunities</h3>
              <p>We’re loading the latest opportunities for you.</p>
            </div>
          ) : null}
          {!loading && error ? (
            <div className="state state-error" role="alert">
              <span className="state-icon state-icon-error">
                <StateIcon kind="error" />
              </span>
              <h3>Opportunities could not be loaded</h3>
              <p>We couldn’t load opportunities just now. Please try again in a moment.</p>
              <button className="state-action" type="button" onClick={() => void load()}>
                Try again
              </button>
            </div>
          ) : null}
          {!loading && !error && regular.length === 0 && interest.length === 0 ? (
            <div className="state state-empty" role="status">
              <span className="state-icon state-icon-empty">
                <StateIcon kind={hasFilters ? 'search' : 'opportunity'} />
              </span>
              <h3>
                {hasFilters
                  ? 'No matching opportunities'
                  : availability === 'OPEN'
                    ? 'No open opportunities right now'
                    : 'No closed opportunities yet'}
              </h3>
              <p>
                {hasFilters
                  ? 'Try a different search or sector, or clear your filters to see all opportunities.'
                  : availability === 'OPEN'
                    ? 'There are no opportunities available to join at the moment. Check back soon or browse closed opportunities.'
                    : 'There are no closed opportunities to show right now. You can browse what’s currently open.'}
              </p>
              <button
                className="state-action"
                type="button"
                onClick={
                  hasFilters
                    ? clearFilters
                    : () => setAvailability(availability === 'OPEN' ? 'CLOSED' : 'OPEN')
                }
              >
                {hasFilters
                  ? 'Clear filters'
                  : availability === 'OPEN'
                    ? 'View closed opportunities'
                    : 'View open opportunities'}
              </button>
            </div>
          ) : null}
          {!loading && !error
            ? regular.map((item) => <OpportunityCard key={item._id} opportunity={item} />)
            : null}
        </div>
        <p className="notice">
          Projected earnings are estimates, not guarantees. All opportunities remain subject to
          eligibility, documentation, due diligence, and their terms.
        </p>
      </div>
    </section>
  );
}
