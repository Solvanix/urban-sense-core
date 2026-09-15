const DATA_URL = "./data/problem-statement.json";
const STORAGE_KEY = "sense-problem-statement-canvas";
const $ = (selector) => document.querySelector(selector);
let original = null;
let current = null;
let editing = false;
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[char]);
const blocks = ["problem","context","alternatives","users","emotional","quantifiable","shortcomings"];
function setText(selector, text) { const node = $(selector); if (node) node.textContent = text ?? ""; }
function render(data) {
  current = structuredClone(data);
  setText("#statusPill", data.meta.status);
  setText("#updatedDate", data.meta.updated);
  setText("#footerNote", data.meta.note);
  blocks.forEach((key) => {
    const card = document.querySelector(`[data-key="${key}"]`);
    if (!card) return;
    ["prompt","body","evidence"].forEach((field) => {
      const node = card.querySelector(`[data-field="${field}"]`);
      if (node) node.textContent = data[key][field] ?? "";
    });
  });
  setText("#statementText", data.problem_statement);
  setEditable(editing);
}
function setEditable(enabled) {
  editing = enabled;
  document.querySelectorAll("[data-field=body], [data-field=evidence], #statementText").forEach((node) => { node.contentEditable = enabled ? "true" : "false"; });
  $("#editButton").textContent = enabled ? "إيقاف التحرير" : "تفعيل التحرير";
  $("#editButton").style.background = enabled ? "#fff0df" : "#fff";
}
function syncFromDom() {
  if (!current) return;
  blocks.forEach((key) => {
    const card = document.querySelector(`[data-key="${key}"]`);
    ["body","evidence"].forEach((field) => { const node = card?.querySelector(`[data-field="${field}"]`); if (node) current[key][field] = node.innerText.trim(); });
  });
  current.problem_statement = $("#statementText").innerText.trim();
}
function download(filename, text, type) {
  const blob = new Blob([text], {type}); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
}
$("#editButton").addEventListener("click", () => { if (editing) syncFromDom(); setEditable(!editing); });
$("#saveButton").addEventListener("click", () => { syncFromDom(); localStorage.setItem(STORAGE_KEY, JSON.stringify(current)); setText("#statusPill", "تم الحفظ محلياً في هذا المتصفح"); });
$("#resetButton").addEventListener("click", () => { localStorage.removeItem(STORAGE_KEY); render(original); setText("#statusPill", "تمت إعادة النسخة الأصلية"); });
$("#jsonButton").addEventListener("click", () => { syncFromDom(); download("sense-problem-statement-canvas.json", JSON.stringify(current, null, 2), "application/json;charset=utf-8"); });
$("#printButton").addEventListener("click", () => { syncFromDom(); window.print(); });
fetch(DATA_URL, {cache:"no-store"}).then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); }).then((data) => { original = structuredClone(data); const saved = localStorage.getItem(STORAGE_KEY); render(saved ? JSON.parse(saved) : data); }).catch((error) => { setText("#statusPill", `تعذر تحميل Canvas: ${error.message}`); });
