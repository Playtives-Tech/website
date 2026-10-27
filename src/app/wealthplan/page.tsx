import type { Metadata } from 'next';
import '@/styles/wealth-plan.css';
import Script from 'next/script';
import { MarketingHeader } from '@/components/marketing-chrome';
export const metadata: Metadata = { title: 'The Predictable Wealth Plan \u2014 Calculator' };
export default function Page(): React.JSX.Element {
  return (
    <>
      <MarketingHeader active="wealthplan" />
      <header>
        <h1>{'The Predictable Wealth Plan'}</h1>
        <p>{'Interactive Calculator \u2014 by Gabriel Olatunji-Legend'}</p>
      </header>
      <div className={'wrap'}>
        <div className={'card'}>
          <h2>{'Your Currency'}</h2>
          <div className={'currency-tabs'}>
            <div className={'ctab active'} data-action="0">
              {'\u20a6 Naira'}
            </div>
            <div className={'ctab'} data-action="1">
              {'\u00a3 Pounds'}
            </div>
            <div className={'ctab'} data-action="2">
              {'$ Dollars'}
            </div>
          </div>
        </div>
        <div className={'card'}>
          <h2>{'Your Monthly Numbers'}</h2>
          <label>{'Monthly take-home income'}</label>
          <input type={'number'} id={'income'} placeholder={'e.g. 5000000'} min={'0'} />
          <label>{'Monthly wealth-building commitment'}</label>
          <input
            type={'number'}
            id={'monthly'}
            placeholder={'e.g. 1250000 (25% of income)'}
            min={'0'}
          />
          <label>{'Opening capital (what you already have saved/invested)'}</label>
          <input
            type={'number'}
            id={'opening'}
            placeholder={'e.g. 0 or 500000'}
            min={'0'}
            defaultValue={'0'}
          />
        </div>
        <div className={'card'}>
          <h2>{'Your Investment Vehicles'}</h2>
          <p style={{ fontSize: '13px', color: 'var(--mgrey)', marginBottom: '8px' }}>
            {'Enter up to 3 vehicles with their expected annual return and allocation.'}
          </p>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--mgrey)',
              marginBottom: '12px',
              background: 'var(--lgrey)',
              padding: '10px 12px',
              borderRadius: '8px',
              lineHeight: '1.6',
            }}
          >
            <b>{'What is allocation?'}</b>
            {
              ' This is the percentage of your monthly wealth-building commitment you are putting into each vehicle. For example, if you invest \u00a3500/month and put \u00a3250 into equities, your allocation to equities is 50%. All vehicles should add up to 100%.'
            }
          </p>
          <div id={'vehicles'}>
            <div className={'vehicle-row'} style={{ marginBottom: '12px' }}>
              <label>{'Vehicle 1 \u2014 Name'}</label>
              <input type={'text'} className={'v-name'} placeholder={'e.g. Long-term equities'} />
              <div className={'row2'} style={{ marginTop: '8px' }}>
                <div>
                  <label>{'Annual return (%)'}</label>
                  <input
                    type={'number'}
                    className={'v-return'}
                    placeholder={'e.g. 15'}
                    min={'0'}
                    max={'100'}
                  />
                </div>
                <div>
                  <label>{'Allocation (%)'}</label>
                  <input
                    type={'number'}
                    className={'v-alloc'}
                    placeholder={'e.g. 50'}
                    min={'0'}
                    max={'100'}
                  />
                </div>
              </div>
            </div>
            <div className={'vehicle-row'} style={{ marginBottom: '12px' }}>
              <label>{'Vehicle 2 \u2014 Name'}</label>
              <input
                type={'text'}
                className={'v-name'}
                placeholder={'e.g. Co-funding (commodity trades)'}
              />
              <div className={'row2'} style={{ marginTop: '8px' }}>
                <div>
                  <label>{'Annual return (%)'}</label>
                  <input
                    type={'number'}
                    className={'v-return'}
                    placeholder={'e.g. 24'}
                    min={'0'}
                    max={'100'}
                  />
                </div>
                <div>
                  <label>{'Allocation (%)'}</label>
                  <input
                    type={'number'}
                    className={'v-alloc'}
                    placeholder={'e.g. 30'}
                    min={'0'}
                    max={'100'}
                  />
                </div>
              </div>
            </div>
            <div className={'vehicle-row'}>
              <label>{'Vehicle 3 \u2014 Name (optional)'}</label>
              <input
                type={'text'}
                className={'v-name'}
                placeholder={'e.g. Co-ownership (trucks/property)'}
              />
              <div className={'row2'} style={{ marginTop: '8px' }}>
                <div>
                  <label>{'Annual return (%)'}</label>
                  <input
                    type={'number'}
                    className={'v-return'}
                    placeholder={'e.g. 46'}
                    min={'0'}
                    max={'100'}
                  />
                </div>
                <div>
                  <label>{'Allocation (%)'}</label>
                  <input
                    type={'number'}
                    className={'v-alloc'}
                    placeholder={'e.g. 20'}
                    min={'0'}
                    max={'100'}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            id={'alloc-warn'}
            style={{
              display: 'none',
              background: '#fff3cd',
              borderRadius: '8px',
              padding: '10px 14px',
              marginTop: '12px',
              fontSize: '13px',
              color: '#856404',
            }}
          >
            {' \u26a0\ufe0f Your allocations add up to more than 100%. Please adjust them. '}
          </div>
        </div>
        <button className={'calc-btn'} data-action="3">
          {'Calculate My Wealth Plan \u2192'}
        </button>
        <div className={'results card'} id={'results'} style={{ marginTop: '20px' }}>
          <h2>{'Your Projected Wealth Plan'}</h2>
          <div className={'results-grid'} id={'snapshot-grid'}></div>
          <div className={'timeline'} id={'timeline-section'}>
            <h3
              style={{
                fontSize: '14px',
                color: 'var(--green)',
                margin: '20px 0 10px',
                fontWeight: '700',
              }}
            >
              {'Portfolio Growth Timeline'}
            </h3>
            <div id={'timeline-rows'}></div>
          </div>
          <div className={'sensitivity'}>
            <h3
              style={{
                fontSize: '14px',
                color: 'var(--green)',
                margin: '20px 0 10px',
                fontWeight: '700',
              }}
            >
              {'What if you increased your monthly commitment?'}
            </h3>
            <table className={'sens-table'} id={'sens-table'}>
              <thead>
                <tr>
                  <th>{'Monthly commitment'}</th>
                  <th>{'5-year portfolio'}</th>
                  <th>{'10-year portfolio'}</th>
                  <th>{'Monthly passive income (10yr)'}</th>
                </tr>
              </thead>
              <tbody id={'sens-body'}></tbody>
            </table>
          </div>
          <div style={{ marginTop: '24px' }}>
            <p
              style={{
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--green)',
                marginBottom: '14px',
                textTransform: 'uppercase',
                letterSpacing: '.06em',
              }}
            >
              {'Ready to go further?'}
            </p>
            <div
              style={{
                background: 'var(--green)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--gold)',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                  marginBottom: '6px',
                }}
              >
                {'01'}
              </div>
              <div
                style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}
              >
                {'Book a 1-on-1 Session with Mr. Legend'}
              </div>
              <p
                style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,.65)',
                  marginBottom: '14px',
                  lineHeight: '1.6',
                }}
              >
                {
                  'Build your personal wealth plan with Mr. Legend directly \u2014 your real numbers, your situation, your vehicles. You leave with a custom plan, not a template.'
                }
              </p>
              <a
                href={'https://stan.store/mrlegend/p/book-a-11-call-with-me-e967d3hq'}
                target={'_blank'}
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  background: 'var(--gold)',
                  color: 'var(--green)',
                  textAlign: 'center',
                  padding: '11px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  textDecoration: 'none',
                }}
              >
                {'Book a 1-on-1 Session with Mr. Legend'}
              </a>
            </div>
            <div
              style={{
                background: 'var(--green)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--gold)',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                  marginBottom: '6px',
                }}
              >
                {'02'}
              </div>
              <div
                style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}
              >
                {'Join the Wealth Table Fellowship'}
              </div>
              <p
                style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,.65)',
                  marginBottom: '14px',
                  lineHeight: '1.6',
                }}
              >
                {
                  'A private 12-month programme where you build and execute your wealth plan with accountability, bi-monthly 1-on-1 calls, group sessions, portfolio reviews, and exclusive investment opportunities. From \u00a339/month.'
                }
              </p>
              <a
                href={'https://stan.store/mrlegend/p/join-the-wealth-table-fellowship'}
                target={'_blank'}
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  background: 'var(--gold)',
                  color: 'var(--green)',
                  textAlign: 'center',
                  padding: '11px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  textDecoration: 'none',
                }}
              >
                {'Join the Wealth Table Fellowship'}
              </a>
            </div>
            <div
              style={{
                background: 'var(--green)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--gold)',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                  marginBottom: '6px',
                }}
              >
                {'03'}
              </div>
              <div
                style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}
              >
                {'Join the Playtives Community'}
              </div>
              <p
                style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,.65)',
                  marginBottom: '14px',
                  lineHeight: '1.6',
                }}
              >
                {
                  'The Playtives community is where people serious about building wealth come together to co-own and co-fund verified opportunities \u2014 commodity trades, haulage trucks, real estate, and more. Members get first access before the general public.'
                }
              </p>
              <a
                href={'https://forms.gle/atg3njjXQKn3eCys6'}
                target={'_blank'}
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  background: 'var(--gold)',
                  color: 'var(--green)',
                  textAlign: 'center',
                  padding: '11px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  textDecoration: 'none',
                }}
              >
                {'Apply to Join the Playtives Community'}
              </a>
            </div>
            <div style={{ background: 'var(--green)', borderRadius: '12px', padding: '20px' }}>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--gold)',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                  marginBottom: '6px',
                }}
              >
                {'04'}
              </div>
              <div
                style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}
              >
                {'See Opportunities to Co-Own or Co-Fund'}
              </div>
              <p
                style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,.65)',
                  marginBottom: '14px',
                  lineHeight: '1.6',
                }}
              >
                {
                  'Already a Playtives community member? See the current opportunities available \u2014 from commodity trade co-funding to haulage truck co-ownership \u2014 and start putting your wealth plan into action.'
                }
              </p>
              <a
                href={'https://playtives.com/opportunities'}
                target={'_blank'}
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  background: 'var(--gold)',
                  color: 'var(--green)',
                  textAlign: 'center',
                  padding: '11px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  textDecoration: 'none',
                }}
              >
                {'See Opportunities on Playtives'}
              </a>
            </div>
          </div>
        </div>
        <div className={'cta-strip'}>
          <h3>{'Download the Full Guide'}</h3>
          <p>
            {
              'The Predictable Wealth Plan PDF includes the full framework, five questions, wealth structure, vehicle guide, and your personal plan template.'
            }
          </p>
          <a href={'The_Predictable_Wealth_Plan.pdf'} download={true} className={'btn-gold'}>
            {'Download PDF Guide'}
          </a>
        </div>
        <p className={'disclaimer'}>
          {
            'All projections are illustrative only. Investment returns are not guaranteed. Past performance does not predict future results. This calculator is a planning tool, not financial advice. Gabriel Olatunji-Legend | playtives.com'
          }
        </p>
      </div>
      <Script src="/scripts/wealthplan.js" strategy="afterInteractive" />
    </>
  );
}
