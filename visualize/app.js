const DEFAULT_SOURCE = "./data/dashboard.json";
const LOCAL_DATA_KEY = "sense-visualize-local-data";
const COPY_KEY = "sense-visualize-copy";
const REFRESH_KEY = "sense-visualize-refresh";

const $ = (selector) => document.querySelector(selector);
const metricGrid = $("#metricGrid");
const funnelChart = $("#funnelChart");
const workflowChart = $("#workflowChart");
const categoryChart = $("#categoryChart");
const creatorChart = $("#creatorChart");
const partnerList = $("#partnerList");
const assumptionList = $("#assumptionList");
const sourceInput = $("#sourceInput");
const refreshSelect = $("#refreshSelect");
const statusText = $("#dataStatus");
const statusDot = document.querySelector(".status-dot");
const notice = $("#dataNotice");
const lastUpdated = $("#lastUpdated");
const periodLabel = $("#periodLabel");
const footerSource = $("#footerSource");
const editorDialog = $("#editorDialog");
const jsonEditor = $("#jsonEditor");
const editorError = $("#editorError");
const trendChart = $("#trendChart");
const areaTable = $("#areaTable");
const alertList = $("#alertList");
const methodNote = $("#methodNote");

let currentData = null;
let refreshTimer = null;
let activeSource = new URLSearchParams(location.search).get("data") || localStorage.getItem("sense-visualize-source") || DEFAULT_SOURCE;

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
const formatNumber = (value) => new Intl.NumberFormat("ar-EG").format(Number(value || 0));
const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", timeStyle: "short" }).format(date);
};

function setLoadingState(message) {
  statusText.textContent = message;
  statusDot.classList.add("busy");
  statusDot.classList.remove("error");
}

function setErrorState(message) {
  statusText.textContent = "تعذر تحميل مصدر البيانات";
  statusDot.classList.remove("busy");
  statusDot.classList.add("error");
  notice.textContent = message;
}

function setSuccessState(data) {
  statusText.textContent = `${data.meta?.status_label || "مصدر محمل"} · متاح للتحليل`;
  statusDot.classList.remove("busy", "error");
  lastUpdated.textContent = `آخر تحديث: ${formatDate(data.meta?.last_updated)}`;
}

function metricCard(key, item) {
  const target = item.target === undefined ? "—" : `${formatNumber(item.target)} ${item.unit || ""}`;
  return `<article class="metric-card" data-metric="${escapeHtml(key)}">
    <div>
      <div class="metric-label">${escapeHtml(item.label)}</div>
      <div class="metric-value">${formatNumber(item.value)}<span class="metric-unit">${escapeHtml(item.unit)}</span></div>
    </div>
    <div>
      <div class="metric-target"><span>الهدف</span><strong>${escapeHtml(target)}</strong></div>
      <div class="metric-confidence">${escapeHtml(item.confidence || "مصدر غير محدد")}</div>
    </div>
  </article>`;
}

function renderMetrics(data) {
  const entries = Object.entries(data.metrics || {});
  metricGrid.innerHTML = entries.map(([key, item]) => metricCard(key, item)).join("");
}

function renderFunnel(data) {
  const items = data.funnel || [];
  const max = Math.max(...items.map((item) => Number(item.value) || 0), 1);
  funnelChart.innerHTML = items.map((item) => {
    const width = Math.max(26, Math.round(((Number(item.value) || 0) / max) * 100));
    return `<div class="funnel-step" style="width:${width}%"><span>${escapeHtml(item.stage)}</span><span>${formatNumber(item.value)}</span></div>`;
  }).join("");
}

function renderBars(data) {
  const items = data.reports?.workflow || [];
  const max = Math.max(...items.map((item) => Number(item.value) || 0), 1);
  workflowChart.innerHTML = items.map((item) => {
    const width = Math.round(((Number(item.value) || 0) / max) * 100);
    return `<div class="bar-row"><span class="bar-label">${escapeHtml(item.stage)}</span><div class="bar-track"><div class="bar-fill" style="width:${width}%"></div></div><span class="bar-value">${formatNumber(item.value)}</span></div>`;
  }).join("");
}

function renderCategories(data) {
  const items = data.reports?.by_category || [];
  const max = Math.max(...items.map((item) => Number(item.value) || 0), 1);
  categoryChart.innerHTML = items.map((item) => {
    const width = Math.round(((Number(item.value) || 0) / max) * 100);
    return `<div class="category-row"><span class="category-label">${escapeHtml(item.category)}</span><div class="category-track"><div class="category-fill" style="width:${width}%;--color:${escapeHtml(item.color || "#d97850")}"></div></div><span class="category-count">${formatNumber(item.value)}</span></div>`;
  }).join("");
}

function renderNetwork(data) {
  const creators = data.network?.creator_categories || [];
  const max = Math.max(...creators.map((item) => Number(item.value) || 0), 1);
  creatorChart.innerHTML = creators.map((item) => {
    const width = Math.round(((Number(item.value) || 0) / max) * 100);
    return `<div class="creator-row"><span>${escapeHtml(item.label)}</span><div class="creator-track"><div class="creator-fill" style="width:${width}%"></div></div><span class="creator-count">${formatNumber(item.value)}</span></div>`;
  }).join("");

  partnerList.innerHTML = (data.network?.partners || []).map((item) => `<div class="partner-item"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.role)}</span><span>${escapeHtml(item.status)}</span></div>`).join("");
}

function renderAssumptions(data) {
  assumptionList.innerHTML = (data.assumptions || []).map((item) => `<div class="assumption-item">${escapeHtml(item)}</div>`).join("");
}

function renderAnalyticalProof(data) {
  const trend = data.trend || [];
  const max = Math.max(...trend.map((item) => Number(item.median_close_hours) || 0), 1);
  trendChart.innerHTML = `<div class="proof-heading"><strong>اتجاه الوسيط حتى الإغلاق</strong><span>بالساعات · ${escapeHtml(data.period?.label || "")}</span></div>${trend.map((item) => {
    const height = Math.max(8, Math.round((Number(item.median_close_hours) / max) * 100));
    return `<div class="trend-column" title="${escapeHtml(item.date)}: ${escapeHtml(item.median_close_hours)} ساعة"><span style="height:${height}%"></span><small>${escapeHtml(item.date.slice(5))}</small></div>`;
  }).join("")}`;
  areaTable.innerHTML = `<div class="proof-heading"><strong>مقارنة حسب المنطقة</strong><span>مشتقة من السجلات</span></div><table><thead><tr><th>المنطقة</th><th>البلاغات</th><th>وسيط الإغلاق</th><th>إعادة الفتح</th></tr></thead><tbody>${(data.area_analysis || []).map((item) => `<tr><td>${escapeHtml(item.area)}</td><td>${formatNumber(item.reports)}</td><td>${escapeHtml(item.median_close_hours)} س</td><td>${escapeHtml(item.reopen_rate)}%</td></tr>`).join("")}</tbody></table>`;
  alertList.innerHTML = (data.alerts || []).map((item) => `<div class="analysis-alert ${escapeHtml(item.severity)}"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.detail)}</span><small>الدليل: ${escapeHtml(item.evidence)}</small></div>`).join("");
  methodNote.textContent = data.meta?.method ? `المحرك: ${data.meta.method} · ${formatNumber(data.meta.record_count)} سجل` : "لا يوجد وصف للمحرك";
}

function renderMeta(data) {
  periodLabel.textContent = data.period?.label || "فترة غير محددة";
  footerSource.textContent = `المصدر: ${data.meta?.source || activeSource}`;
  notice.textContent = data.meta?.data_status === "synthetic_pilot"
    ? "تم تشغيل محرك التحليل على Fixture اصطناعي موثق. النتائج محسوبة فعليًا من 112 سجلًا لكنها لا تمثل أداءً بلديًا."
    : data.meta?.data_status === "prototype"
      ? "النموذج يعرض بيانات أولية/تجريبية. لا تستخدم الأرقام كأثر محقق قبل استبدال المصدر وتسجيل خط الأساس."
      : `تم تحميل المصدر: ${data.meta?.source || activeSource}`;
}

function render(data) {
  currentData = data;
  renderMetrics(data);
  renderFunnel(data);
  renderBars(data);
  renderCategories(data);
  renderNetwork(data);
  renderAssumptions(data);
  renderAnalyticalProof(data);
  renderMeta(data);
  setSuccessState(data);
  applyCopy();
}

async function fetchData() {
  setLoadingState("جاري مزامنة مصدر البيانات…");
  const localData = localStorage.getItem(LOCAL_DATA_KEY);
  try {
    if (localData) {
      const parsed = JSON.parse(localData);
      render(parsed);
      notice.textContent = "يُعرض الآن تعديل محلي محفوظ في هذا المتصفح. استخدم زر إزالة النسخة المحلية للعودة إلى المصدر.";
      return;
    }
    const url = new URL(activeSource, location.href);
    url.searchParams.set("t", Date.now().toString());
    const response = await fetch(url.toString(), { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    render(data);
  } catch (error) {
    setErrorState(`${error.message}. تأكد من أن الرابط يعيد JSON صالحاً ويدعم CORS عند استخدام مصدر خارجي.`);
  }
}

function setRefreshTimer() {
  if (refreshTimer) window.clearInterval(refreshTimer);
  const seconds = Number(refreshSelect.value || 0);
  localStorage.setItem(REFRESH_KEY, String(seconds));
  if (seconds > 0) refreshTimer = window.setInterval(fetchData, seconds * 1000);
}

function exportJson() {
  if (!currentData) return;
  const blob = new Blob([JSON.stringify(currentData, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `sense-dashboard-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function loadCopy() {
  try { return JSON.parse(localStorage.getItem(COPY_KEY) || "{}"); } catch { return {}; }
}
function applyCopy() {
  const copy = loadCopy();
  document.querySelectorAll("[data-editable]").forEach((element) => {
    const key = element.dataset.editable;
    if (copy[key]) element.textContent = copy[key];
  });
}
function enableCopyEditing() {
  document.body.classList.toggle("editing-copy");
  document.querySelectorAll("[data-editable]").forEach((element) => {
    element.contentEditable = document.body.classList.contains("editing-copy");
    element.addEventListener("input", () => {
      const copy = loadCopy();
      copy[element.dataset.editable] = element.textContent.trim();
      localStorage.setItem(COPY_KEY, JSON.stringify(copy));
    }, { once: false });
  });
}

function openEditor() {
  jsonEditor.value = JSON.stringify(currentData || {}, null, 2);
  editorError.textContent = "";
  editorDialog.showModal();
}
function applyLocalJson() {
  try {
    const parsed = JSON.parse(jsonEditor.value);
    if (!parsed.metrics || !parsed.meta) throw new Error("يجب أن يتضمن JSON حقلي meta و metrics على الأقل.");
    localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(parsed));
    render(parsed);
    editorError.textContent = "تم تطبيق البيانات محلياً.";
    editorError.style.color = "#5f7c59";
  } catch (error) {
    editorError.textContent = `خطأ: ${error.message}`;
    editorError.style.color = "";
  }
}
function resetLocalJson() {
  localStorage.removeItem(LOCAL_DATA_KEY);
  editorDialog.close();
  fetchData();
}

sourceInput.value = activeSource;
refreshSelect.value = localStorage.getItem(REFRESH_KEY) || "0";
sourceInput.addEventListener("change", () => {
  activeSource = sourceInput.value.trim() || DEFAULT_SOURCE;
  localStorage.setItem("sense-visualize-source", activeSource);
  localStorage.removeItem(LOCAL_DATA_KEY);
  fetchData();
});
$("#refreshButton").addEventListener("click", fetchData);
refreshSelect.addEventListener("change", setRefreshTimer);
$("#printButton").addEventListener("click", () => window.print());
$("#exportButton").addEventListener("click", exportJson);
$("#editorButton").addEventListener("click", openEditor);
$("#applyJsonButton").addEventListener("click", applyLocalJson);
$("#resetLocalButton").addEventListener("click", resetLocalJson);

fetchData().finally(setRefreshTimer);
