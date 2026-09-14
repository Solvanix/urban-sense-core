const DATA_URL = "./data/maba-bridge.json";
const $ = (selector) => document.querySelector(selector);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
const money = (value) => `$${new Intl.NumberFormat("en-US").format(value)}`;
function render(data) {
  $("#statusLabel").textContent = data.meta.status_label;
  $("#quoteRef").textContent = `${data.meta.quotation_reference} · ${data.meta.quotation_date}`;
  $("#sensePosition").textContent = data.positioning.sense;
  $("#mabaPosition").textContent = data.positioning.maba;
  $("#layerRows").innerHTML = data.layers.map((item) => `<div class="layer-row"><span>${esc(item.sense_layer)}</span><span>${esc(item.maba_fit)}</span><span>${esc(item.owner)}</span><span>${esc(item.decision)}</span></div>`).join("");
  $("#requirementsGrid").innerHTML = data.functional_requirements.map((item) => `<article class="req-card"><span>${esc(item.id)} / ${esc(item.priority)}</span><h3>${esc(item.name)}</h3><p>المالك: ${esc(item.owner)}</p><small>معيار القبول: ${esc(item.acceptance)}</small></article>`).join("");
  const q = data.quotation_snapshot;
  const quoteItems = [["برمجيات MABA", money(q.software_items_usd), "عرض إرشادي"], ["نموذج بلدية واحدة", money(q.indicative_one_municipality_usd), "قبل إعادة التحقق"], ["بديل Validator اقتصادي", money(q.economy_validator_indicative_usd), "نموذج إرشادي"], ["الجدول المعلن", `${q.timeline_weeks} أسبوعاً`, `${q.validity_days} يوم صلاحية`]];
  $("#quoteGrid").innerHTML = quoteItems.map(([label, value, note]) => `<div class="quote-card"><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(note)}</small></div>`).join("");
  $("#meetingList").innerHTML = data.next_meeting.map((item) => `<div class="meeting-item">${esc(item)}</div>`).join("");
}
$("#printButton").addEventListener("click", () => window.print());
fetch(DATA_URL, { cache: "no-store" }).then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); }).then(render).catch((error) => { $("#statusLabel").textContent = `تعذر تحميل وثيقة الجسر: ${error.message}`; document.querySelector(".status span").style.background = "#ba5d67"; });
