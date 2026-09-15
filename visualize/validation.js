const DATA_URL = "./data/validation.json";
const $ = (selector) => document.querySelector(selector);
let data = null;
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
const dateText = (value) => new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(new Date(value));

function renderLadder() {
  $("#ladderVisual").innerHTML = data.ladder.map((item) => `<div class="ladder-step ${esc(item.status)}"><span class="ladder-number">${esc(item.level)}</span><strong>${esc(item.name)}</strong><span class="ladder-evidence">${esc(item.evidence)}</span></div>`).join("");
}
function renderOnePager() {
  const items = [
    ["المشكلة", data.one_pager.problem, "#d97850"],
    ["MVP", data.one_pager.mvp, "#5d8fa3"],
    ["Pilot", data.one_pager.pilot, "#8aa37b"],
    ["القرار المطلوب", data.one_pager.decision, "#b78b51"]
  ];
  $("#onePager").innerHTML = items.map(([title, text, color]) => `<article class="one-card" style="--accent:${color}"><span>DECISION SURFACE</span><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join("");
}
function confidenceClass(value) {
  if (value === "منخفض") return "confidence-low";
  if (value === "غير معروف") return "confidence-unknown";
  return "confidence-medium";
}
function renderAssumptions() {
  $("#assumptionTable").innerHTML = data.assumptions.map((item) => `<tr><td>${esc(item.id)}</td><td>${esc(item.claim)}</td><td class="${confidenceClass(item.confidence)}">${esc(item.confidence)}</td><td>${esc(item.evidence)}</td><td>${esc(item.next_test)}</td><td>${esc(item.owner)}</td></tr>`).join("");
}
function renderDimensions() {
  $("#dimensionGrid").innerHTML = data.dimensions.map((item) => `<article class="dimension-card"><h3>${esc(item.name)}</h3><p>${esc(item.question)}</p><span class="dimension-status">${esc(item.status)}</span><div class="dimension-next"><strong>الخطوة التالية</strong><br />${esc(item.next)}</div></article>`).join("");
}
function renderPilot() {
  $("#pilotDuration").textContent = data.pilot.duration;
  $("#pilotPlace").textContent = data.pilot.place;
  $("#pilotUsers").textContent = data.pilot.users;
  $("#kpiList").innerHTML = data.pilot.kpis.map((item) => `<div class="kpi-item"><strong>${esc(item.name)}</strong><p>${esc(item.definition)}</p><span class="kpi-source">المصدر المقترح: ${esc(item.source)}</span></div>`).join("");
}
function renderOffline() {
  $("#offlineList").innerHTML = data.offline.map((item) => `<div class="offline-item">${esc(item)}</div>`).join("");
}
function renderMeta() {
  $("#statusLabel").textContent = data.meta.status_label;
  $("#statusDate").textContent = dateText(data.meta.last_updated);
}
function render() {
  renderMeta(); renderLadder(); renderOnePager(); renderAssumptions(); renderDimensions(); renderPilot(); renderOffline();
}
$("#printButton").addEventListener("click", () => window.print());
fetch(DATA_URL, { cache: "no-store" }).then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); }).then((json) => { data = json; render(); }).catch((error) => { $("#statusLabel").textContent = `تعذر تحميل مركز التحقق: ${error.message}`; document.querySelector(".status span").style.background = "#ba5d67"; });
