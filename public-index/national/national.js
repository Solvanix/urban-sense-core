const grid = document.querySelector('#destinationGrid');
const result = document.querySelector('#destinationResult');
let destinations = [];
let filters = { stage: 'all', type: 'all', region: 'all' };
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function card(item) {
  const facts = item.facts.map((fact) => `<span>${esc(fact)}</span>`).join('');
  const action = `<a href="${item.href || `./destination.html?id=${encodeURIComponent(item.id)}`}" ${item.href ? '' : 'class="profile-link"'}>${item.href ? 'افتح التجربة ↗' : 'افتح بطاقة الوجهة ↗'}</a>`;
  return `<article class="destination ${item.status === 'pilot' ? 'live' : ''}"><span class="status ${item.status !== 'pilot' ? 'candidate' : ''}">${esc(item.statusLabel)}</span><span class="destination-type">${esc(item.cluster)} · ${esc(item.type)}</span><h3>${esc(item.name)}</h3><p>${esc(item.summary)}</p><div class="facts">${facts}</div>${action}</article>`;
}
function render() {
  const items = destinations.filter((item) => (filters.stage === 'all' || item.status === filters.stage) && (filters.type === 'all' || item.type === filters.type) && (filters.region === 'all' || item.region === filters.region));
  grid.innerHTML = items.length ? items.map(card).join('') : '<div class="no-results">لا توجد وجهات بهذا الاختيار.</div>';
  result.textContent = `يعرض ${items.length} من ${destinations.length} وجهات`;
}
async function load() {
  try { const response = await fetch('./destinations.json', { cache: 'no-store' }); if (!response.ok) throw new Error(`destinations.json ${response.status}`); const data = await response.json(); destinations = data.destinations; render(); }
  catch (error) { result.textContent = 'تعذر تحميل عقد الوجهات؛ راجع نسخة GitHub.'; console.warn(error); }
}
document.querySelector('#stageFilter').addEventListener('change', (event) => { filters.stage = event.target.value; render(); });
document.querySelector('#typeFilter').addEventListener('change', (event) => { filters.type = event.target.value; render(); });
document.querySelector('#regionFilter').addEventListener('change', (event) => { filters.region = event.target.value; render(); });
document.querySelector('#resetFilters').addEventListener('click', () => { filters = { stage: 'all', type: 'all', region: 'all' }; document.querySelector('#stageFilter').value = 'all'; document.querySelector('#typeFilter').value = 'all'; document.querySelector('#regionFilter').value = 'all'; render(); });
load();
