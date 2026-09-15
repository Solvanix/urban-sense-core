const DATA_URL = "./data/link-index.json";
const $ = (selector) => document.querySelector(selector);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[char]);
const statusLabel = {published:"منشورة", "verified-public":"عامة ومتحقق منها", public:"عامة", temporary:"مؤقتة", "unavailable-at-audit":"غير متاحة في آخر تحقق", "public-reference":"مرجع عام", "login-required":"تتطلب دخولاً", "login-or-session-dependent":"جلسة أو دخول"};
function badgeClass(status){ if(status.includes("temporary") || status.includes("unavailable")) return "temporary"; if(status.includes("reference")) return "reference"; if(status.includes("login")) return "restricted"; return ""; }
function card(item){ return `<article class="link-card" style="--accent:${item.kind === "canvas" ? "#b78b51" : item.kind === "source" ? "#5d8fa3" : "#d97850"}"><div><div class="card-top"><h3>${esc(item.title)}</h3><span class="badge ${badgeClass(item.status)}">${esc(statusLabel[item.status] || item.status)}</span></div><p>${esc(item.description || "")}</p></div><a class="open-link" href="${esc(item.url)}" target="_blank" rel="noreferrer">فتح الرابط ↗</a></article>`; }
function render(data){
  $("#updated").textContent = `آخر مراجعة ${data.meta.updated}`;
  $("#scope").textContent = data.meta.scope;
  $("#footerDate").textContent = data.meta.updated;
  $("#visualizeGrid").innerHTML = data.visualize.map(card).join("");
  $("#productGrid").innerHTML = data.product.map(card).join("");
  $("#editorialGrid").innerHTML = data.editorial.map(card).join("");
  $("#referenceGrid").innerHTML = data.references.map(card).join("");
  $("#restrictedList").innerHTML = data.restricted.map((item) => `<article class="restricted-item"><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><a href="${esc(item.url)}" target="_blank" rel="noreferrer">${esc(item.url)}</a></article>`).join("");
}
$("#printButton").addEventListener("click", () => window.print());
fetch(DATA_URL,{cache:"no-store"}).then((response) => {if(!response.ok) throw new Error(`HTTP ${response.status}`); return response.json();}).then(render).catch((error) => { $("#updated").textContent = `تعذر تحميل الفهرس: ${error.message}`; });
