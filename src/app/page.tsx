import type { Metadata } from 'next';
import '@/styles/home.css';

export const metadata: Metadata = { title: 'Playtives \u2014 Co-ownership platform for Africans' };
type Traction = { memberCapitalDeployed90DaysMinorUnits: number; activeCoOwners: number };

async function getTraction(): Promise<Traction | null> {
  try {
    const apiUrl =
      process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl.replace(/\/$/, '')}/v1/opportunities/traction`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as Traction;
    if (
      !Number.isSafeInteger(data.memberCapitalDeployed90DaysMinorUnits) ||
      !Number.isSafeInteger(data.activeCoOwners)
    )
      return null;
    return data;
  } catch {
    return null;
  }
}

function formatCapital(minorUnits: number): string {
  const amount = minorUnits / 100;
  const formatter = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const units = [
    { value: 1_000, suffix: 'K' },
    { value: 1_000_000, suffix: 'M' },
    { value: 1_000_000_000, suffix: 'B' },
    { value: 1_000_000_000_000, suffix: 'T' },
  ];
  let index = units.findLastIndex((unit) => amount >= unit.value);
  if (index < 0) return `₦${formatter.format(amount)}`;
  while (index < units.length - 1 && Math.round((amount / units[index].value) * 100) >= 100_000)
    index += 1;
  return `₦${formatter.format(amount / units[index].value)}${units[index].suffix}`;
}

export default async function Page(): Promise<React.JSX.Element> {
  const traction = await getTraction();
  return (
    <>
      <nav className={'nav'} aria-label={'Primary navigation'}>
        <div className={'wrap nav-inner'}>
          <a className={'logo-link'} href={'#top'} aria-label={'Playtives home'}>
            <img
              src={'./logo-navbar-light.png'}
              alt={'Playtives'}
              className={'logo'}
              width={'1199'}
              height={'308'}
            />
          </a>
          <div className={'nav-links'}>
            <a href={'#why'}>{'Why Playtives'}</a>
            <a href={'#model'}>{'How it works'}</a>
            <a href={'./wealthplan/'}>{'Wealth Plan'}</a>
            <a className={'nav-blog'} href={'/blog/'}>
              {'Blog'}
            </a>
            <a href={'#product'}>{'Product'}</a>
            <a href={'#community'}>{'Community'}</a>
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
      <main id={'top'}>
        <header className={'hero'}>
          <div className={'wrap hero-grid'}>
            <div>
              <div className={'eyebrow'}>
                <span className={'eyebrow-dot'} aria-hidden={'true'}></span>
                {'Co-own. Grow. Be Wealthy Together. '}
              </div>
              <h1>
                {'Own productive things. '}
                <em>{'Together.'}</em>
              </h1>
              <p className={'hero-sub'}>
                {
                  'Playtives helps Africans at home and abroad co-own productive assets and access opportunities they may not be able to afford or access alone.'
                }
              </p>
              <div className={'hero-actions'}>
                <a
                  className={'btn-primary'}
                  href={'https://dashboard.playtives.com/sign-up'}
                  target={'_blank'}
                  rel="noopener noreferrer"
                >
                  {'Apply to Join the Community \u2192'}
                </a>
                <a className={'btn-secondary'} href={'#model'}>
                  {'See How Playtives Works'}
                </a>
              </div>
              <p className={'hero-note'}>
                {
                  'Detailed opportunities are available only to approved community members and remain subject to eligibility, documentation, due diligence and applicable legal/regulatory requirements.'
                }
              </p>
            </div>
            <div className={'hero-card'} aria-label={'Preview of a live Playtives opportunity'}>
              <p className={'hero-card-label'}>{'What the platform is becoming'}</p>
              <h2>{'One place to discover, understand and track what you own together.'}</h2>
              <div className={'opportunity-card'}>
                <span className={'opportunity-chip'}>{'Live opportunity'}</span>
                <h3>{'Palm Oil Supply Trade Co-Funding'}</h3>
                <p className={'opportunity-sub'}>
                  {'Structured co-funding, documented units, transparent member records.'}
                </p>
                <div className={'opportunity-metrics'}>
                  <div className={'opportunity-metric'}>
                    <span>{'Monthly return'}</span>
                    <b>{'2% projected'}</b>
                  </div>
                  <div className={'opportunity-metric'}>
                    <span>{'Per unit'}</span>
                    <b>{'\u20a6500,000'}</b>
                  </div>
                  <div className={'opportunity-metric'}>
                    <span>{'Lock-in'}</span>
                    <b>{'30 days'}</b>
                  </div>
                  <div className={'opportunity-metric'}>
                    <span>{'Access'}</span>
                    <b>{'Members only'}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className={'proof'} aria-label={'Playtives traction'}>
          <div className={'wrap proof-grid'}>
            <div className={'proof-item'}>
              <span className={'proof-value'}>
                {traction ? formatCapital(traction.memberCapitalDeployed90DaysMinorUnits) : '—'}
              </span>
              <span className={'proof-label'}>{'Member capital deployed in 90 days'}</span>
            </div>
            <div className={'proof-item'}>
              <span className={'proof-value'}>{'100%'}</span>
              <span className={'proof-label'}>{'Monthly On-time settlements'}</span>
            </div>
            <div className={'proof-item'}>
              <span className={'proof-value'}>{'15K+'}</span>
              <span className={'proof-label'}>{'Followers'}</span>
            </div>
            <div className={'proof-item'}>
              <span className={'proof-value'}>
                {traction ? traction.activeCoOwners.toLocaleString('en-NG') : '—'}
              </span>
              <span className={'proof-label'}>{'Active co-owners'}</span>
            </div>
          </div>
        </div>
        <section className={'problem'} id={'why'}>
          <div className={'wrap'}>
            <div className={'problem-intro'}>
              <div>
                <p className={'kicker'}>{'Why Playtives exists'}</p>
                <h2 className={'section-title'}>
                  {'The opportunities are there. Access, structure and trust are not.'}
                </h2>
                <p className={'section-lead'}>
                  {
                    'Many productive assets and commercial opportunities are difficult for an individual to access alone. The problem is not only money. It is also knowing what exists, finding credible operators, coordinating multiple people, documenting ownership and keeping everyone informed.'
                  }
                </p>
              </div>
              <div className={'problem-callout'}>
                {
                  'Playtives is building the infrastructure that makes collective ownership structured, trackable and repeatable.'
                }
              </div>
            </div>
            <div className={'barriers'}>
              <article className={'barrier'}>
                <h3>{'Capital'}</h3>
                <p>
                  {
                    'Some productive opportunities simply cost more than one person can comfortably deploy.'
                  }
                </p>
              </article>
              <article className={'barrier'}>
                <h3>{'Access'}</h3>
                <p>
                  {
                    'Credible private opportunities are often hard to discover and even harder to evaluate.'
                  }
                </p>
              </article>
              <article className={'barrier'}>
                <h3>{'Trust'}</h3>
                <p>
                  {
                    'Informal pooling makes ownership, accountability, reporting and exit difficult to manage. '
                  }
                </p>
              </article>
            </div>
          </div>
        </section>
        <section className={'models-section'} id={'model'}>
          <div className={'wrap'}>
            <p className={'kicker'}>{'What we are building'}</p>
            <h2 className={'section-title'}>
              {'Two ways to access productive opportunities together.'}
            </h2>
            <p className={'section-lead'}>
              {
                'The opportunity changes. The infrastructure stays the same: clear structure, documented participation, transparent records and a member experience that makes collective ownership easier to understand and manage.'
              }
            </p>
            <div className={'models-grid'}>
              <article className={'model-card dark'}>
                <div className={'model-label'}>{'Co-Fund'}</div>
                <h3>{'Defined commercial cycles.'}</h3>
                <p>
                  {
                    'Members collectively fund structured commercial opportunities with defined terms, timelines, documentation and settlement mechanics. Returns, where projected, depend on the specific opportunity and are not guaranteed.'
                  }
                </p>
                <div className={'model-meta'}>
                  <span className={'model-chip'}>{'Commercial trades'}</span>
                  <span className={'model-chip'}>{'Defined duration'}</span>
                  <span className={'model-chip'}>{'Documented terms'}</span>
                </div>
              </article>
              <article className={'model-card light'}>
                <div className={'model-label'}>{'Co-Own'}</div>
                <h3>{'Productive assets.'}</h3>
                <p>
                  {
                    'Members collectively acquire documented economic ownership units in productive assets that may otherwise be difficult to access individually. Income and distributions depend on the performance of the underlying asset.'
                  }
                </p>
                <div className={'model-meta'}>
                  <span className={'model-chip'}>{'Logistics assets'}</span>
                  <span className={'model-chip'}>{'Businesses'}</span>
                  <span className={'model-chip'}>{'Real assets'}</span>
                </div>
              </article>
            </div>
            <div className={'cogrow'}>
              <div className={'cogrow-badge'}>{'Co-Grow.'}</div>
              <p>
                {
                  'Over time, members can build a portfolio of productive positions rather than waiting until they can afford an entire opportunity alone. Our aim is to make that portfolio visible, documented and easier to grow deliberately.'
                }
              </p>
            </div>
          </div>
        </section>
        <section className={'process'} id={'how'}>
          <div className={'wrap'}>
            <p className={'kicker'} style={{ color: 'var(--gold-2)' }}>
              {'The member journey'}
            </p>
            <h2 className={'section-title'}>
              {'From learning to ownership, without the informal chaos.'}
            </h2>
            <p className={'section-lead'}>
              {
                'We are intentionally community-first. People should understand an opportunity before they participate in it.'
              }
            </p>
            <div className={'steps'}>
              <article className={'step'}>
                <h3>{'Learn'}</h3>
                <p>
                  {
                    'Understand productive opportunities, how co-ownership works and what the risks and economics mean.'
                  }
                </p>
              </article>
              <article className={'step'}>
                <h3>{'Join'}</h3>
                <p>
                  {
                    'Apply to become a Playtives community member and complete the appropriate onboarding process.'
                  }
                </p>
              </article>
              <article className={'step'}>
                <h3>{'Review & participate'}</h3>
                <p>
                  {
                    'Approved members can review detailed opportunity information, agreements and unit structures before choosing whether to participate.'
                  }
                </p>
              </article>
              <article className={'step'}>
                <h3>{'Own & track'}</h3>
                <p>
                  {
                    'Track co-funded and co-owned positions, documents, updates and distributions through the member platform as it rolls out.'
                  }
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className={'product'} id={'product'}>
          <div className={'wrap'}>
            <div className={'product-head'}>
              <div>
                <p className={'kicker'}>{'The product'}</p>
                <h2 className={'section-title'}>
                  {'We proved the behaviour manually. Now we are building the software.'}
                </h2>
              </div>
              <div className={'product-side'}>
                {/* <span className={'build-badge'}>
                  <span className={'build-dot'}></span>
                  {'Product in development'}
                </span> */}
                {/* <br /> */}
                {
                  'Our first transactions were coordinated through community, agreements, transfers, spreadsheets and direct reporting. The member platform is bringing opportunity discovery, commercial terms, agreements, allocations, portfolios and distributions into one system.'
                }
              </div>
            </div>
            <div className={'screens'}>
              <div className={'screen-wrap'}>
                <div className={'browser'}>
                  <div className={'browser-bar'}>
                    <span className={'browser-dot'}></span>
                    <span className={'browser-dot'}></span>
                    <span className={'browser-dot'}></span>
                    <span className={'browser-url'}>{'playtives / opportunity editor'}</span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '1.35/1',
                      background: 'linear-gradient(160deg,#0d2219,#1a4030)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '24px',
                    }}
                  >
                    <div
                      style={{
                        width: '80%',
                        background: 'rgba(255,255,255,0.06)',
                        borderRadius: '8px',
                        padding: '16px 20px',
                        border: '1px solid rgba(199,155,42,0.2)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '9px',
                          letterSpacing: '0.16em',
                          textTransform: 'uppercase',
                          color: 'rgba(199,155,42,0.6)',
                          fontWeight: '700',
                          marginBottom: '8px',
                        }}
                      >
                        {' Opportunity Editor'}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'white',
                          fontWeight: '600',
                          marginBottom: '4px',
                        }}
                      >
                        {'Haulage Truck Co-Ownership '}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                        {'\u20a62,000,000 per unit \u00b7 40 units \u00b7 \u20a680M total '}
                      </div>
                    </div>
                    <div
                      style={{
                        width: '80%',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                      }}
                    >
                      <div
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          borderRadius: '6px',
                          padding: '10px 12px',
                          border: '1px solid rgba(255,255,255,0.07)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '9px',
                            color: 'rgba(255,255,255,0.3)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                          }}
                        >
                          {' Status'}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgba(199,155,42,0.8)',
                            fontWeight: '600',
                            marginTop: '3px',
                          }}
                        >
                          {'Open'}
                        </div>
                      </div>
                      <div
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          borderRadius: '6px',
                          padding: '10px 12px',
                          border: '1px solid rgba(255,255,255,0.07)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '9px',
                            color: 'rgba(255,255,255,0.3)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                          }}
                        >
                          {' Slots filled'}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'white',
                            fontWeight: '600',
                            marginTop: '3px',
                          }}
                        >
                          {'4 / 40'}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.2)',
                        fontStyle: 'italic',
                        marginTop: '4px',
                      }}
                    >
                      {'Screenshot coming \u2014 product in development'}
                    </div>
                  </div>
                </div>
                <p className={'screen-caption'}>
                  <b>{'Opportunity configuration.'}</b>
                  {
                    ' The internal editor drives the member-facing opportunity: summary, documents, commercial structure and the information members see before participating.'
                  }
                </p>
              </div>
              <div className={'screen-wrap'}>
                <div className={'browser'}>
                  <div className={'browser-bar'}>
                    <span className={'browser-dot'}></span>
                    <span className={'browser-dot'}></span>
                    <span className={'browser-dot'}></span>
                    <span className={'browser-url'}>{'playtives / commercial terms'}</span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '1.35/1',
                      background: 'linear-gradient(160deg,#0d2219,#1a4030)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '24px',
                    }}
                  >
                    <div
                      style={{
                        width: '80%',
                        background: 'rgba(255,255,255,0.06)',
                        borderRadius: '8px',
                        padding: '16px 20px',
                        border: '1px solid rgba(199,155,42,0.2)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '9px',
                          letterSpacing: '0.16em',
                          textTransform: 'uppercase',
                          color: 'rgba(199,155,42,0.6)',
                          fontWeight: '700',
                          marginBottom: '8px',
                        }}
                      >
                        {' Commercial Terms'}
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: 'white',
                          fontWeight: '600',
                          marginBottom: '12px',
                        }}
                      >
                        {'Palm Oil Trade Co-Funding \u2014 Cycle 4'}
                      </div>
                      <div
                        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '15px',
                              color: 'rgba(199,155,42,0.9)',
                              fontWeight: '700',
                            }}
                          >
                            {'2%'}
                          </div>
                          <div
                            style={{
                              fontSize: '9px',
                              color: 'rgba(255,255,255,0.3)',
                              marginTop: '2px',
                            }}
                          >
                            {'Monthly'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '15px',
                              color: 'rgba(199,155,42,0.9)',
                              fontWeight: '700',
                            }}
                          >
                            {'3 mo'}
                          </div>
                          <div
                            style={{
                              fontSize: '9px',
                              color: 'rgba(255,255,255,0.3)',
                              marginTop: '2px',
                            }}
                          >
                            {'Lock-in'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '15px',
                              color: 'rgba(199,155,42,0.9)',
                              fontWeight: '700',
                            }}
                          >
                            {'\u20a6500k'}
                          </div>
                          <div
                            style={{
                              fontSize: '9px',
                              color: 'rgba(255,255,255,0.3)',
                              marginTop: '2px',
                            }}
                          >
                            {'Per unit'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        width: '80%',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '6px',
                        padding: '10px 14px',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div
                        style={{
                          height: '3px',
                          background: 'rgba(255,255,255,0.06)',
                          borderRadius: '2px',
                          overflow: 'hidden',
                          marginBottom: '6px',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: '68%',
                            background: 'rgba(199,155,42,0.6)',
                            borderRadius: '2px',
                          }}
                        ></div>
                      </div>
                      <div
                        style={{
                          fontSize: '9px',
                          color: 'rgba(255,255,255,0.25)',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>{'Slots filled'}</span>
                        <span>{'27 / 40'}</span>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.2)',
                        fontStyle: 'italic',
                        marginTop: '4px',
                      }}
                    >
                      {'Screenshot coming \u2014 product in development'}
                    </div>
                  </div>
                </div>
                <p className={'screen-caption'}>
                  <b>{'Structured commercial terms.'}</b>
                  {
                    ' We are building one flexible opportunity model that can support co-funding cycles and co-owned assets without forcing every deal into the same structure. '
                  }
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className={'community'} id={'community'}>
          <div className={'wrap'}>
            <div className={'community-shell'}>
              <div className={'community-content'}>
                <div>
                  <p className={'kicker'} style={{ color: 'var(--gold-2)' }}>
                    {'Community first'}
                  </p>
                  <h2>
                    {'Playtives is a community '}
                    <em>{'before'}</em>
                    {' it is a product.'}
                  </h2>
                  <p>
                    {
                      'Education is part of the trust infrastructure. We use the community to explain opportunities, learn directly from members and build the product around real behaviour instead of assumptions.'
                    }
                  </p>
                  <div className={'community-actions'}>
                    <a
                      className={'btn-primary'}
                      href={'https://dashboard.playtives.com/sign-up'}
                      target={'_blank'}
                      rel="noopener noreferrer"
                    >
                      {'Apply to Join the Community \u2192'}
                    </a>
                  </div>
                  <p className={'community-micro'}>
                    {
                      'After applying, approved members receive community onboarding information. Opportunity participation is separate from community membership.'
                    }
                  </p>
                </div>
                <div className={'community-stats'} aria-label={'Community traction'}>
                  <div className={'community-stat'}>
                    <b>{'394'}</b>
                    <span>{'WhatsApp community members'}</span>
                  </div>
                  <div className={'community-stat'}>
                    <b>{'821'}</b>
                    <span>{'Email subscribers'}</span>
                  </div>
                  <div></div>
                  <div className={'community-stat'}>
                    <b>{'90 days'}</b>
                    <span>{'To first \u20a694.68M (~$70K) deployed'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={'mission'}>
          <div className={'wrap mission-copy'}>
            <p className={'kicker'}>{'The bigger mission'}</p>
            <p className={'mission-small'}>
              {
                'People often say Africans do not collaborate enough economically. We think collaboration becomes much easier when the structure is clear, ownership is documented, the operator is accountable and everyone can see what is happening.'
              }
            </p>
            <p className={'mission-big'}>
              {'We are building the infrastructure for a generation of Africans to '}
              <em>{'own productive things together.'}</em>
            </p>
          </div>
        </section>
        <section className={'final'}>
          <div className={'wrap final-grid'}>
            <div>
              <h2>{'Want to understand what we are building?'}</h2>
              <p>
                {
                  'Join the Playtives community. Learn how collective ownership works, follow what we are building and help shape the product as we grow.'
                }
              </p>
            </div>
            <div>
              <a
                className={'btn-primary'}
                href={'https://dashboard.playtives.com/sign-up'}
                target={'_blank'}
                rel="noopener noreferrer"
              >
                {'Apply to Join \u2192'}
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div className={'wrap'}>
          <div className={'footer-top'}>
            <div>
              <a className={'logo-link'} href={'#top'} aria-label={'Playtives home'}>
                <img
                  src={'./logo-navbar-light.png'}
                  alt={'Playtives'}
                  className={'logo2'}
                  width={'1199'}
                  height={'308'}
                />
              </a>
              <p>{' Helping Africans home and abroad, build wealth through co-ownership. '}</p>
              <p>{' NIG: 6 Gbemisola Street, Allen-Avenue, Ikeja, Lagos. '}</p>
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
