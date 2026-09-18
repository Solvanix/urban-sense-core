const target = document.querySelector('#destinationDetail');
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const id = new URLSearchParams(location.search).get('id') || 'DEST-EIZ-001';
const readiness = {pilot: 3, researching: 1, candidate: 0, reviewed: 4, public: 5, paused: 0};
function render(item) {
  const score = readiness[item.status] ?? 0;
  const facts = item.facts.map((fact) => `<span>${esc(fact)}</span>`).join('');
  const steps = ['معرف وجهة مستقل', 'مالك محتوى ومراجع معلوم', 'مصدر محلي قابل للمراجعة', 'مسار بحدود وصول واضحة', 'موافقة نشر أو شراكة مثبتة'];
  const checks = steps.map((step, index) => `<li class="${index < score ? 'checked' : ''}"><b>${index < score ? '✓' : '○'}</b>${step}</li>`).join('');
  target.innerHTML = `<div class="detail-hero ${item.status === 'pilot' ? 'live' : ''}"><span class="status ${item.status !== 'pilot' ? 'candidate' : ''}">${esc(item.statusLabel)}</span><p class="destination-type">${esc(item.cluster)} · ${esc(item.region)} · ${esc(item.type)}</p><h1>${esc(item.name)}</h1><p>${esc(item.summary)}</p></div><div class="detail-grid"><section class="detail-card"><p class="kicker">01 / TRUST CARD</p><h2>ما الذي نعرفه الآن؟</h2><p>هذه بطاقة تشغيلية إرشادية، وليست اعتمادًا حكوميًا أو وعدًا بالحجز. كلما نقصت البيانات، يظهر ذلك صراحة للزائر.</p><div class="facts">${facts}</div><p class="source-line"><b>حالة المصدر:</b> ${esc(item.ownerStatus)}</p></section><section class="detail-card"><p class="kicker">02 / READINESS</p><h2>بوابة الجاهزية</h2><ul class="readiness">${checks}</ul><p class="source-line"><b>النتيجة الإرشادية:</b> ${score}/5 عناصر مكتملة</p></section></div><div class="detail-actions"><a class="button" href="./">← العودة إلى الفهرس</a>${item.href ? `<a class="button primary" href="${item.href}">افتح المسارات المنشورة ↗</a>` : ''}</div>`;
}
fetch('./destinations.json', {cache:'no-store'}).then((response) => { if (!response.ok) throw new Error(response.status); return response.json(); }).then((data) => { const item = data.destinations.find((entry) => entry.id === id); if (!item) throw new Error('destination not found'); render(item); }).catch(() => { target.innerHTML = '<div class="notice">تعذر العثور على بطاقة الوجهة. <a href="./">العودة إلى الفهرس</a></div>'; });
