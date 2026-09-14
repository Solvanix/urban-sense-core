const DATA_URL = "./data/experience.json";
const $ = (selector) => document.querySelector(selector);
const audienceTabs = $("#audienceTabs");
const moduleGrid = $("#moduleGrid");
const moduleFilter = $("#moduleFilter");
const journeySteps = $("#journeySteps");
const validationLoop = $("#validationLoop");
const governanceList = $("#governanceList");
let experienceData = null;
let selectedAudience = "visitor";

const audienceOrder = ["visitor", "municipality", "investor", "provider"];
const audienceClass = { visitor: "visitor", municipality: "municipality", investor: "investor", provider: "provider" };
const colorMap = { coral: "#d97850", water: "#5d8fa3", sage: "#8aa37b", sand: "#b78b51", teal: "#477a78", rose: "#ba5d67", ink: "#171918", violet: "#776c9e" };

const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);

function renderTabs() {
  audienceTabs.innerHTML = audienceOrder.map((key) => {
    const item = experienceData.audiences[key];
    return `<button class="audience-tab ${key === selectedAudience ? "active" : ""}" data-audience="${key}" role="tab" aria-selected="${key === selectedAudience}"><strong>${esc(item.label)}</strong><small>${esc(item.action)}</small></button>`;
  }).join("");
  audienceTabs.querySelectorAll("[data-audience]").forEach((button) => button.addEventListener("click", () => {
    selectedAudience = button.dataset.audience;
    renderTabs();
    renderJourney();
    filterModules(selectedAudience);
  }));
}

function renderJourney() {
  const item = experienceData.audiences[selectedAudience];
  $("#audienceLabel").textContent = item.label;
  $("#audiencePromise").textContent = item.promise;
  journeySteps.innerHTML = item.steps.map((step, index) => `<div class="journey-step"><span>0${index + 1}</span>${esc(step)}</div>`).join("");
}

function moduleCard(item) {
  const color = colorMap[item.color] || colorMap.coral;
  return `<article class="module-card" data-type="${esc(item.type)}" style="--accent-color:${color}"><span class="module-number">${esc(item.number)} / ${esc(item.type)}</span><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><span class="module-output">${esc(item.output)}</span></article>`;
}
function renderModules() {
  moduleGrid.innerHTML = experienceData.modules.map(moduleCard).join("");
}
function filterModules(filter) {
  moduleGrid.querySelectorAll(".module-card").forEach((card) => {
    card.classList.toggle("is-hidden", filter !== "all" && card.dataset.type !== filter);
  });
  moduleFilter.querySelectorAll(".filter-button").forEach((button) => button.classList.toggle("active", button.dataset.filter === filter));
}

function renderValidation() {
  validationLoop.innerHTML = experienceData.validation.map((item) => `<article class="validation-card"><span>${esc(item.step)}</span><strong>${esc(item.title)}</strong><p>${esc(item.text)}</p></article>`).join("");
}
function renderGovernance() {
  governanceList.innerHTML = experienceData.governance.map((item) => `<div class="governance-item">${esc(item)}</div>`).join("");
}
function renderMeta() {
  $("#statusLabel").textContent = experienceData.meta.status_label;
  $("#statusVersion").textContent = experienceData.meta.version;
  $("#footerDate").textContent = new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(new Date(experienceData.meta.last_updated));
}
function showError(error) {
  $("#statusLabel").textContent = "تعذر تحميل عقد التجربة";
  document.querySelector(".live-pill span:first-child").style.background = "#ba5d67";
  document.querySelector(".hero-copy h1").textContent = `تعذر تحميل Experience Visualizer: ${error.message}`;
}

moduleFilter.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (button) filterModules(button.dataset.filter);
});
$("#printButton").addEventListener("click", () => window.print());

fetch(DATA_URL, { cache: "no-store" })
  .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
  .then((data) => {
    experienceData = data;
    renderMeta();
    renderTabs();
    renderJourney();
    renderModules();
    renderValidation();
    renderGovernance();
    filterModules("all");
  })
  .catch(showError);
