import type { Metadata } from 'next';
import '@/styles/opportunities.css';
import { OpportunityCatalogue } from './catalogue';
export const metadata: Metadata = { title: 'Opportunities \u2014 Playtives' };
export default function Page(): React.JSX.Element {
  return (
    <>
      <nav className={'nav'} aria-label={'Primary navigation'}>
        <div className={'wrap nav-inner'}>
          <a className={'logo-link'} href={'../'} aria-label={'Playtives home'}>
            <img
              src={'../logo-navbar-light.png'}
              alt={'Playtives'}
              className={'logo'}
              width={'1199'}
              height={'308'}
            />
          </a>
          <div className={'nav-links'}>
            <a href={'../#why'}>{'Why Playtives'}</a>
            <a href={'../#model'}>{'How it works'}</a>
            <a className={'nav-blog'} href={'/blog/'}>{'Blog'}</a>
            <a href={'../#community'}>{'Community'}</a>
            <a
              className={'nav-cta'}
              href={'https://dashboard.playtives.com/sign-up'}
              target={'_blank'}
              rel="noopener noreferrer"
            >
              {'Apply to Join'}
            </a>
          </div>
        </div>
      </nav>
      <main>
        <header className={'page-hero'}>
          <div className={'wrap hero-content'}>
            <h1>{'Own productive things. Together.'}</h1>
            <p className={'hero-copy'}>
              {
                'Explore opportunities, review the details, and continue to your dashboard when you are ready.'
              }
            </p>
          </div>
        </header>
        <OpportunityCatalogue />
      </main>
      <footer>
        <div className={'wrap'}>
          <div className={'footer-top'}>
            <div>
              <a className={'logo-link'} href={'../'} aria-label={'Playtives home'}>
                <img
                  src={'../logo-navbar-light.png'}
                  alt={'Playtives'}
                  className={'logo'}
                  width={'1199'}
                  height={'308'}
                />
              </a>
              <p>{'Helping Africans home and abroad build wealth through co-ownership.'}</p>
              <p>{'NIG: 6 Gbemisola Street, Allen-Avenue, Ikeja, Lagos.'}</p>
              <div className={'footer-links'}>
                <a href={'mailto:coown@playtives.com'}>{'coown@playtives.com'}</a>
                {' | '}
                <a
                  href={'https://instagram.com/playtives'}
                  target={'_blank'}
                  rel="noopener noreferrer"
                >
                  {'IG: @playtives'}
                </a>
              </div>
            </div>
            <div className={'footer-entity'}>
              {'Playtives Technologies Limited'}
              <br />
              {'Playtives Cooperative Multipurpose Society Limited'}
              <br />
              {'Lagos, Nigeria'}
            </div>
          </div>
          <div className={'legal'}>
            {
              'Historical transaction, community and participation figures on this website are provided for company information only and do not guarantee future performance. Nothing on this website is personal financial advice or an invitation to the general public to invest. Any opportunity made available by Playtives is subject to community approval, eligibility, documentation, due diligence, opportunity-specific risk and applicable legal/regulatory requirements. \u00a9 2026 Playtives Technologies Limited.'
            }
          </div>
        </div>
      </footer>
    </>
  );
}
