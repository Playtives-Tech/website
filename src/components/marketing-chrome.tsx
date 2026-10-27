import Link from 'next/link';

export function MarketingHeader({ active = 'learn' }: { active?: 'learn' }): React.JSX.Element {
  return (
    <nav className="nav" aria-label="Primary navigation">
      <div className="wrap nav-inner">
        <Link className="logo-link" href="/" aria-label="Playtives home">
          <img className="logo" src="/logo-navbar-light.png" alt="Playtives" width="1199" height="308" />
        </Link>
        <div className="nav-links">
          <Link href="/#why">Why Playtives</Link>
          <Link href="/#model">How it works</Link>
          <Link className={`nav-blog${active === 'learn' ? ' active' : ''}`} href="/blog/">Learn</Link>
          <Link href="/#community">Community</Link>
          <a className="nav-cta" href="https://dashboard.playtives.com/sign-up">Apply to Join</a>
        </div>
      </div>
    </nav>
  );
}

export function MarketingFooter(): React.JSX.Element {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-top">
          <div>
            <Link className="logo-link" href="/" aria-label="Playtives home">
              <img className="logo2" src="/logo-navbar-light.png" alt="Playtives" width="1199" height="308" />
            </Link>
            <p>Helping Africans home and abroad build wealth through co-ownership.</p>
            <p>Lagos, Nigeria.</p>
            <div className="footer-links">
              <Link href="/opportunities/">Opportunities</Link>
              {' · '}
              <Link href="/blog/">Learn about wealth</Link>
            </div>
            <div className="footer-links">
              <a href="mailto:coown@playtives.com">coown@playtives.com</a>
              {' · '}
              <a href="https://instagram.com/playtives" target="_blank" rel="noopener noreferrer">Instagram: @playtives</a>
            </div>
          </div>
          <div className="footer-entity">
            Playtives Technologies Limited<br />
            Playtives Cooperative Multipurpose Society Limited<br />
            Lagos, Nigeria
          </div>
        </div>
        <div className="legal">
          Educational content is for general information only and is not personal financial advice or a guarantee of performance. Opportunities are subject to eligibility, documentation, due diligence, opportunity-specific risks and applicable requirements. © 2026 Playtives Technologies Limited.
        </div>
      </div>
    </footer>
  );
}
