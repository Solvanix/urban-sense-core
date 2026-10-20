const auditKey = "sense-reviewer-audit-v1";
let currentToken = null;
let queue = [
  { id: "chk_014_04", pass: "pass_demo_014", stop: "الاقتصاد المحلي", action: "اشترِ أو أحِل منفعة", time: "اليوم · 10:42", status: "pending", note: "ختم نقطة البيع بانتظار مراجعة المنسق" },
  { id: "chk_011_02", pass: "pass_demo_011", stop: "الطريق", action: "اسأل مضيفًا", time: "اليوم · 10:18", status: "pending", note: "إجابة قصيرة مسجلة دون صورة" },
  { id: "chk_009_01", pass: "pass_demo_009", stop: "الزيتونة", action: "شارك قصة بإذن", time: "اليوم · 09:51", status: "approved", note: "موافقة نشر واضحة" }
];
let audit = JSON.parse(localStorage.getItem(auditKey) || "null") || [
  { time: "اليوم · 10:42", text: "استلام إنجاز جديد للفريق pass_demo_014", action: "بانتظار المراجعة" },
  { time: "اليوم · 10:31", text: "إصدار رمز لنقطة الاقتصاد المحلي", action: "رمز صادر" },
  { time: "اليوم · 10:18", text: "استلام إنجاز جديد للفريق pass_demo_011", action: "بانتظار المراجعة" }
];
const $ = (selector) => document.querySelector(selector);
const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
function saveAudit() { localStorage.setItem(auditKey, JSON.stringify(audit.slice(0, 30))); }
function addAudit(text, action) { audit.unshift({ time: "الآن", text, action }); saveAudit(); renderAudit(); }
function renderStats() { $("#stat-pending").textContent = queue.filter((item) => item.status === "pending").length; $("#stat-approved").textContent = queue.filter((item) => item.status === "approved").length + 7; }
function renderQueue() {
  const filter = $("#queue-filter").value;
  const visible = queue.filter((item) => filter === "all" || item.status === filter);
  $("#queue-list").innerHTML = visible.length ? visible.map((item) => `<article class="queue-item"><div class="queue-main"><span class="queue-icon">${item.status === "approved" ? "✓" : "?"}</span><div><h3>${escapeHTML(item.pass)} · ${escapeHTML(item.action)}</h3><p>${escapeHTML(item.note)}</p><div class="queue-meta"><span>النقطة: ${escapeHTML(item.stop)}</span><span>${escapeHTML(item.time)}</span><span>${escapeHTML(item.id)}</span></div>${item.status === "pending" ? `<div class="queue-actions"><button class="approve" data-approve="${escapeHTML(item.id)}">اعتماد الإنجاز</button><button class="reject" data-reject="${escapeHTML(item.id)}">رفض مع سبب</button></div>` : ""}</div></div><span class="queue-status ${item.status}">${item.status === "pending" ? "بانتظار المراجعة" : item.status === "approved" ? "معتمد" : "مرفوض"}</span></article>`).join("") : `<div class="empty-queue">لا توجد إنجازات بهذه الحالة.</div>`;
  document.querySelectorAll("[data-approve]").forEach((button) => button.addEventListener("click", () => updateQueue(button.dataset.approve, "approved")));
  document.querySelectorAll("[data-reject]").forEach((button) => button.addEventListener("click", () => { const reason = window.prompt("سبب الرفض (يظهر للمراجع فقط):", "الدليل غير كافٍ"); if (reason) updateQueue(button.dataset.reject, "rejected", reason); }));
  renderStats();
}
function updateQueue(id, status, reason = "") { const item = queue.find((entry) => entry.id === id); if (!item) return; item.status = status; if (reason) item.note = reason; addAudit(`${status === "approved" ? "اعتماد" : "رفض"} إنجاز ${item.pass}`, status === "approved" ? "معتمد" : "مرفوض"); renderQueue(); }
function renderAudit() { $("#audit-list").innerHTML = audit.map((item) => `<div class="audit-item"><time>${escapeHTML(item.time)}</time><div><strong>${escapeHTML(item.text)}</strong><small>المستخدم التجريبي · دون بيانات شخصية</small></div><span class="audit-action">${escapeHTML(item.action)}</span></div>`).join(""); }
function issueToken(event) {
  event.preventDefault();
  if (!$("#evidence-check").checked) { window.alert("أكد أولًا أنك راجعت الفعل أو الدليل المناسب."); return; }
  const pass = $("#pass-input").value.trim();
  if (!/^pass_[A-Za-z0-9_-]{4,80}$/.test(pass)) { window.alert("استخدم معرّفًا مجهّلًا يبدأ بـ pass_."); return; }
  const stop = $("#stop-select");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const code = `SQ-${Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")}`;
  currentToken = { code, pass, stop: stop.options[stop.selectedIndex].text, expires: Date.now() + 3 * 60 * 1000, used: false };
  $("#token-empty").hidden = true; $("#token-output").hidden = false; $("#token-status").textContent = "صالح مؤقتًا"; $("#token-status").className = "token-status live"; $("#token-code").textContent = code; $("#token-stop").textContent = currentToken.stop; $("#token-pass").textContent = pass; $("#token-expiry").textContent = "03:00"; $("#stat-issued").textContent = Number($("#stat-issued").textContent) + 1;
  addAudit(`إصدار ${code} للفريق ${pass}`, "رمز صادر");
}
function consumeToken() { if (!currentToken) return; currentToken.used = true; $("#token-status").textContent = "مستهلك"; $("#token-status").className = "token-status used"; $("#token-expiry").textContent = "استخدم مرة واحدة"; addAudit(`استهلاك ${currentToken.code} للفريق ${currentToken.pass}`, "رمز مستهلك"); }
function setupTabs() { document.querySelectorAll("[data-tab]").forEach((tab) => tab.addEventListener("click", () => { document.querySelectorAll(".tab").forEach((item) => item.classList.toggle("active", item === tab)); document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `tab-${tab.dataset.tab}`)); })); }
$("#issue-form").addEventListener("submit", issueToken); $("#consume-token").addEventListener("click", consumeToken); $("#copy-token").addEventListener("click", async () => { if (currentToken) { await navigator.clipboard?.writeText(currentToken.code); $("#copy-token").textContent = "تم النسخ ✓"; } }); $("#queue-filter").addEventListener("change", renderQueue); $("#role-toggle").addEventListener("click", (event) => { event.target.textContent = event.target.textContent.includes("المضيف") ? "الدور: المراجع" : "الدور: المضيف"; }); setupTabs(); renderQueue(); renderAudit();
