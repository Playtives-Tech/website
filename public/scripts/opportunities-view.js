
    (() => {
      const apiBaseUrl = document.querySelector('meta[name="playtives-api-url"]').content.replace(/\/$/, '');
      const params = new URLSearchParams(window.location.search);
      const slug = params.get('slug');
      const loadingState = document.getElementById('loading-state');
      const errorState = document.getElementById('error-state');
      const content = document.getElementById('opportunity-content');

      const money = (minorUnits) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format((Number(minorUnits) || 0) / 100);
      const percentage = (value) => `${Number(value).toFixed(1).replace(/\.0$/, '')}%`;
      const words = (value) => String(value || '').toLowerCase().replaceAll('_', ' ').replace(/^./, (letter) => letter.toUpperCase());
      const date = (value) => {
        if (!value) return 'To be confirmed';
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? 'To be confirmed' : parsed.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
      };
      const projectedReturn = (opportunity) => {
        const minimum = opportunity.equivalentProjectedMinimumPercentage;
        const maximum = opportunity.equivalentProjectedMaximumPercentage;
        if (minimum != null && maximum != null) return `${percentage(minimum)}–${percentage(maximum)}`;
        const value = opportunity.equivalentProjectedPercentage ?? opportunity.projectedReturnRatePercent;
        return Number(value) > 0 ? percentage(value) : 'Variable';
      };
      const term = (opportunity) => {
        if (opportunity.termType === 'LIFE_OF_ASSET') return 'Life of asset';
        const value = opportunity.durationValue ?? opportunity.durationMonths;
        return value ? `${value} ${words(opportunity.durationUnit || 'MONTHS').toLowerCase()}` : 'Fixed term';
      };
      const appendFormattedText = (parent, text) => {
        String(text).split(/(\*\*[^*]+\*\*)/g).filter(Boolean).forEach((part) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const strong = document.createElement('strong');
            strong.textContent = part.slice(2, -2);
            parent.append(strong);
          } else {
            parent.append(document.createTextNode(part));
          }
        });
      };
      const renderAbout = (value) => {
        const about = document.getElementById('about');
        about.replaceChildren();
        const lines = String(value || '').split(/\r?\n/);
        let list = null;
        lines.forEach((rawLine) => {
          const line = rawLine.trim();
          if (!line) { list = null; return; }
          if (line.startsWith('- ')) {
            if (!list) { list = document.createElement('ul'); about.append(list); }
            const item = document.createElement('li');
            appendFormattedText(item, line.slice(2));
            list.append(item);
            return;
          }
          list = null;
          const heading = line.match(/^#{1,3}\s+(.+)$/);
          const element = document.createElement(heading ? 'h3' : 'p');
          appendFormattedText(element, heading ? heading[1] : line);
          about.append(element);
        });
        if (!about.childElementCount) {
          const paragraph = document.createElement('p');
          paragraph.textContent = 'More information about this opportunity is available on the Playtives member dashboard.';
          about.append(paragraph);
        }
      };
      const addMetric = (label, value) => {
        const row = document.createElement('div');
        row.className = 'metric';
        const name = document.createElement('span');
        name.textContent = label;
        const result = document.createElement('strong');
        result.textContent = value;
        row.append(name, result);
        document.getElementById('metrics').append(row);
      };

      const render = (opportunity) => {
        document.title = `${opportunity.title || 'Opportunity'} — Playtives`;
        const isOpen = opportunity.acquisitionStatus === 'OPEN';
        const status = document.getElementById('status');
        status.textContent = isOpen ? 'Open' : opportunity.acquisitionStatus === 'COMMENCED' ? 'Deal live' : 'Offer closed';
        if (!isOpen) status.classList.add('closed');
        document.getElementById('kicker').textContent = `${words(opportunity.opportunityStructure)} · ${opportunity.category || 'Opportunity'}`;
        document.getElementById('title').textContent = opportunity.title || 'Playtives opportunity';
        document.getElementById('summary').textContent = opportunity.summary || 'View this opportunity and its participation details.';

        try {
          const imageUrl = new URL(opportunity.imageUrl);
          if (['http:', 'https:'].includes(imageUrl.protocol)) {
            const image = document.createElement('img');
            image.src = imageUrl.toString();
            image.alt = opportunity.imageAlt || opportunity.title || 'Playtives opportunity';
            document.getElementById('hero-image').append(image);
          }
        } catch { /* Keep the branded image background. */ }

        const action = document.getElementById('dashboard-action');
        action.href = `https://dashboard.playtives.com/discover/${encodeURIComponent(opportunity.slug || slug)}`;
        document.getElementById('status-note').textContent = isOpen
          ? 'Sign in or create an account to continue.'
          : 'Join us to co-own or co-fund this';

        renderAbout(opportunity.about || opportunity.summary);
        addMetric('Monthly projected', projectedReturn(opportunity));
        addMetric('Price per unit', money(opportunity.pricePerUnitMinorUnits));
        addMetric('Deal type', words(opportunity.opportunityStructure));
        addMetric('Return schedule', words(opportunity.returnSchedule));
        addMetric('Term', term(opportunity));
        addMetric('Location', opportunity.location || 'Nigeria');
        addMetric('Units available', Math.max(0, Number(opportunity.availableUnits) || 0).toLocaleString());
        addMetric('Offer closes', date(opportunity.offerClosesAt));
        addMetric('Deal starts', date(opportunity.commencementDate));
        document.getElementById('disclaimer').textContent = opportunity.projectionDisclaimer || 'Projected earnings are estimates and are not guaranteed. Review the full opportunity terms before participating.';

        loadingState.hidden = true;
        content.hidden = false;
      };

      const fail = (message) => {
        loadingState.hidden = true;
        document.getElementById('error-message').textContent = message;
        errorState.hidden = false;
      };

      if (!slug) {
        fail('No opportunity was selected. Return to the catalogue and choose an opportunity.');
        return;
      }

      fetch(`${apiBaseUrl}/v1/opportunities/${encodeURIComponent(slug)}`, { headers: { Accept: 'application/json' }, cache: 'no-store' })
        .then((response) => {
          if (!response.ok) throw new Error(`Request failed with ${response.status}`);
          return response.json();
        })
        .then(render)
        .catch((error) => {
          console.error('Unable to load Playtives opportunity', error);
          fail('This opportunity could not be loaded. It may no longer be publicly available.');
        });
    })();
  
