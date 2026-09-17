(() => {
  if (window.__senseNavigationLoaded) return;
  window.__senseNavigationLoaded = true;
  const base = location.pathname.includes('/urban-sense-core/') ? '/urban-sense-core/' : '/';
  const links = [
    ['home', '⌂', 'Home / المدخل العام', `${base}public-index/`],
    ['routes', '↗', 'SENSE Routes / السياحة', `${base}tourism/`],
    ['visualize', '◈', 'Visualize / لوحة التشغيل', `${base}visualize/`],
    ['experience', '✦', 'تجربة الزائر', `${base}visualize/experience.html`],
    ['validation', '✓', 'مركز التحقق', `${base}visualize/validation.html`],
    ['index', '≡', 'فهرس كل الروابط', `${base}visualize/link-index.html`],
    ['canvas', '□', 'Problem Canvas', `${base}visualize/problem-statement-canvas.html`],
    ['projects', '●', 'محفظة المشاريع', `${base}public-index/projects/`],
    ['stories', '✎', 'WordPress / القصص', 'https://sense133.wordpress.com/'],
    ['github', '⌘', 'GitHub / المصدر', 'https://github.com/Solvanix/urban-sense-core']
  ];
  const current = location.pathname;
  const isExternal = (href) => href.startsWith('http');
  const linkMarkup = links.map(([key, icon, label, href]) => {
    const active = (!isExternal(href) && ((key === 'home' && (current.endsWith('/public-index/') || current.endsWith('/public-index/index.html') || current.endsWith('/INDEX.html'))) || (key === 'routes' && current.includes('/tourism')) || (key === 'visualize' && current.endsWith('/visualize/')) || (key === 'experience' && current.includes('experience.html')) || (key === 'validation' && current.includes('validation.html')) || (key === 'index' && current.includes('link-index.html')) || (key === 'canvas' && current.includes('problem-statement-canvas.html')) || (key === 'projects' && current.includes('/public-index/projects')))) ? ' active' : '';
    return `<a class="sense-nav-link${active}" href="${href}"${isExternal(href) ? ' target="_blank" rel="noreferrer"' : ''}><span>${icon}</span><b>${label}</b></a>`;
  }).join('');
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = `${base}shared/sense-navigation.css`;
  document.head.appendChild(style);
  const widget = document.createElement('aside');
  widget.className = 'sense-nav-widget';
  widget.innerHTML = `<button class="sense-nav-toggle" type="button" aria-expanded="false" aria-controls="sense-nav-panel"><span class="sense-nav-toggle-icon">☰</span><span>تنقل SENSE</span></button><div class="sense-nav-overlay" data-sense-close></div><section class="sense-nav-panel" id="sense-nav-panel" aria-label="لوحة تنقل SENSE"><div class="sense-nav-panel-head"><div><span class="sense-nav-kicker">SENSE / NAVIGATION</span><h2>كل الطبقات في مكان واحد</h2></div><button class="sense-nav-close" type="button" data-sense-close aria-label="إغلاق">×</button></div><p class="sense-nav-note">من المدخل العام إلى أعمق بطاقة ومسار، مع Home واضح في كل صفحة.</p><nav class="sense-nav-list">${linkMarkup}</nav><div class="sense-nav-status"><span class="sense-nav-dot"></span><span>المصدر: GitHub · النسخة العامة</span></div></section>`;
  document.body.prepend(widget);
  const footer = document.createElement('div');
  footer.className = 'sense-global-footer';
  footer.innerHTML = `<span>SENSE / Urban-Sense Core</span><span class="sense-footer-links"><a href="${base}public-index/">Home / Index</a><a href="${base}tourism/">Routes</a><a href="${base}visualize/link-index.html">Link Index</a><a href="https://github.com/Solvanix/urban-sense-core" target="_blank" rel="noreferrer">GitHub</a></span>`;
  document.body.appendChild(footer);
  const toggle = widget.querySelector('.sense-nav-toggle');
  const panel = widget.querySelector('.sense-nav-panel');
  const close = () => { widget.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
  toggle.addEventListener('click', () => { const open = widget.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
  widget.querySelectorAll('[data-sense-close]').forEach((item) => item.addEventListener('click', close));
  panel.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
})();
