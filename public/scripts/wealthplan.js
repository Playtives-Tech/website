
let SYMBOL = '₦';
let FX = 1;

function setCurrency(code, sym, rate, event) {
  SYMBOL = sym; FX = rate;
  document.querySelectorAll('.ctab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  if (document.getElementById('results').classList.contains('show')) calculate();
}

function fmt(n) {
  const v = n * FX;
  if (v >= 1e9) return SYMBOL + (v/1e9).toFixed(2) + 'B';
  if (v >= 1e6) return SYMBOL + (v/1e6).toFixed(2) + 'M';
  if (v >= 1e3) return SYMBOL + (v/1e3).toFixed(1) + 'K';
  return SYMBOL + Math.round(v).toLocaleString();
}

function getBlended() {
  const rows = document.querySelectorAll('.vehicle-row');
  let blended = 0, totalAlloc = 0;
  rows.forEach(r => {
    const ret = parseFloat(r.querySelector('.v-return').value) || 0;
    const alloc = parseFloat(r.querySelector('.v-alloc').value) || 0;
    blended += (ret/100) * (alloc/100);
    totalAlloc += alloc;
  });
  return { blended, totalAlloc };
}

function projectPortfolio(opening, monthly, annualRate, years) {
  const monthlyRate = annualRate / 12;
  let balance = opening;
  for (let m = 0; m < years * 12; m++) {
    balance = balance * (1 + monthlyRate) + monthly;
  }
  return balance;
}

function calculate() {
  const income = parseFloat(document.getElementById('income').value) || 0;
  const monthly = parseFloat(document.getElementById('monthly').value) || 0;
  const opening = parseFloat(document.getElementById('opening').value) || 0;

  if (!monthly) { alert('Please enter your monthly wealth-building commitment.'); return; }

  const { blended, totalAlloc } = getBlended();

  const warn = document.getElementById('alloc-warn');
  if (totalAlloc > 100) { warn.style.display='block'; return; }
  warn.style.display = 'none';

  if (!blended) { alert('Please enter at least one vehicle with a return % and allocation %.'); return; }

  // Projections
  const years = [1, 5, 10, 20];
  const portfolios = years.map(y => projectPortfolio(opening, monthly, blended, y));

  // Snapshot
  const grid = document.getElementById('snapshot-grid');
  grid.innerHTML = '';
  years.forEach((y, i) => {
    const passiveMonthly = portfolios[i] * (blended / 12);
    const hl = y === 10;
    grid.innerHTML += `<div class="res-card ${hl?'highlight':''}">
      <div class="res-label">${y} Year${y>1?'s':''}</div>
      <div class="res-val">${fmt(portfolios[i])}</div>
      <div class="res-passive">~${fmt(passiveMonthly)}/mo passive</div>
    </div>`;
  });

  // Timeline bars (use 10-year as 100%)
  const maxVal = portfolios[3];
  const tl = document.getElementById('timeline-rows');
  tl.innerHTML = '';
  years.forEach((y, i) => {
    const pct = Math.round((portfolios[i]/maxVal)*100);
    const passive = portfolios[i] * (blended/12);
    tl.innerHTML += `<div class="tl-row">
      <div class="tl-year">${y} yr${y>1?'s':''}</div>
      <div class="tl-bar-wrap"><div class="tl-bar" style="width:${pct}%"></div></div>
      <div class="tl-val">${fmt(portfolios[i])}<br><span style="font-size:10px;color:var(--mgrey)">${fmt(passive)}/mo</span></div>
    </div>`;
  });

  // Sensitivity table
  const multipliers = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const tbody = document.getElementById('sens-body');
  tbody.innerHTML = '';
  multipliers.forEach(m => {
    const adj = monthly * m;
    const p5 = projectPortfolio(opening, adj, blended, 5);
    const p10 = projectPortfolio(opening, adj, blended, 10);
    const passive10 = p10 * (blended/12);
    const isCurrent = m === 1;
    tbody.innerHTML += `<tr>
      <td class="${isCurrent?'sens-highlight':''}">${fmt(adj)}/mo${isCurrent?' ← yours':''}</td>
      <td class="${isCurrent?'sens-highlight':''}">${fmt(p5)}</td>
      <td class="${isCurrent?'sens-highlight':''}">${fmt(p10)}</td>
      <td class="${isCurrent?'sens-highlight':''}">${fmt(passive10)}/mo</td>
    </tr>`;
  });

  document.getElementById('results').classList.add('show');
  document.getElementById('results').scrollIntoView({behavior:'smooth', block:'start'});
}

document.querySelector('[data-action="0"]').addEventListener("click", (event) => { setCurrency('NGN','₦',1, event); });

document.querySelector('[data-action="1"]').addEventListener("click", (event) => { setCurrency('GBP','£',0.00048, event); });

document.querySelector('[data-action="2"]').addEventListener("click", (event) => { setCurrency('USD','$',0.00062, event); });

document.querySelector('[data-action="3"]').addEventListener("click", (event) => { calculate(); });
