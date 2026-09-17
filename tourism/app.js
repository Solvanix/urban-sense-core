const planKey = "sense-routes-plan-v1";
const list = document.querySelector("#plan-list");
const empty = document.querySelector("#plan-empty");
let plan = JSON.parse(localStorage.getItem(planKey) || "[]");
let activeDataset = null;
let activeFilters = { duration: "all", difficulty: "all", type: "all" };

const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

function renderPlan() {
  empty.hidden = plan.length > 0;
  list.innerHTML = plan.map((item, index) => `<li><span>${index + 1}</span><div><strong>${escapeHTML(item)}</strong><small>مسار محفوظ في هذه الرحلة · <button data-remove="${escapeHTML(item)}">إزالة</button></small></div></li>`).join("");
  list.hidden = plan.length === 0;
  list.querySelectorAll("[data-remove]").forEach((button) => button.addEventListener("click", () => {
    plan = plan.filter((item) => item !== button.dataset.remove);
    localStorage.setItem(planKey, JSON.stringify(plan));
    renderPlan();
  }));
}

function addToPlan(item, button) {
  if (!plan.includes(item)) plan.push(item);
  localStorage.setItem(planKey, JSON.stringify(plan));
  button.textContent = "أضيفت إلى خطتي ✓";
  button.classList.add("added");
  renderPlan();
  document.querySelector("#plan").scrollIntoView({ behavior: "smooth", block: "center" });
}

function routeImageClass(index) {
  return ["photo-old", "photo-story", "photo-map"][index] || "route-text";
}

function matchesDuration(route, filter) {
  if (filter === "all") return true;
  const minutes = Number(route.duration?.value || 0);
  if (filter === "short") return minutes < 60;
  if (filter === "medium") return minutes >= 60 && minutes <= 120;
  if (filter === "long") return minutes > 120;
  return true;
}

function filteredRoutes() {
  if (!activeDataset?.routes) return [];
  return activeDataset.routes.filter((route) =>
    matchesDuration(route, activeFilters.duration) &&
    (activeFilters.difficulty === "all" || route.difficulty === activeFilters.difficulty) &&
    (activeFilters.type === "all" || route.experienceType === activeFilters.type)
  );
}

function routeCard(route, index) {
  const image = routeImageClass(activeDataset.routes.indexOf(route));
  const source = route.confidence?.basis?.length ? route.confidence.basis.join(" · ") : "مصدر قيد الإضافة";
  const evidence = route.nextEvidence?.slice(0, 2).join(" · ") || "تحتاج مراجعة محلية";
  const tags = [route.difficulty, route.experienceType, route.duration?.label].filter(Boolean).map(escapeHTML).join(" · ");
  return `<article class="route-card ${index === 0 ? "featured" : ""}" data-route-id="${escapeHTML(route.id)}">
    <div class="route-photo ${image}">${image === "route-text" ? `<span class="route-icon">✦</span>` : ""}</div>
    <div class="route-body"><span class="route-tag">${String(index + 1).padStart(2, "0")} · ${escapeHTML(route.kicker)}</span><h3>${escapeHTML(route.title)}</h3><p>${escapeHTML(route.description)}</p>
    <div class="route-meta"><span>◷ ${tags}</span></div>
    <div class="route-trust"><span>${escapeHTML(route.access.label)}</span><small>المصدر: ${escapeHTML(source)}</small><small>التالي: ${escapeHTML(evidence)}</small></div>
    <button class="add-route" data-add="${escapeHTML(route.title)}">أضف إلى خطتي +</button></div></article>`;
}

function renderRoutes() {
  const grid = document.querySelector(".route-grid");
  const routes = filteredRoutes();
  if (!grid) return;
  grid.innerHTML = routes.length ? routes.map(routeCard).join("") : `<div class="no-routes">لا توجد مسارات بهذه الخيارات. جرّب إعادة الضبط أو مستوى مختلفًا.</div>`;
  grid.querySelectorAll("[data-add]").forEach((button) => button.addEventListener("click", () => addToPlan(button.dataset.add, button)));
  const result = document.querySelector("#filter-result");
  if (result) result.textContent = `يعرض ${routes.length} من ${activeDataset.routes.length} مسارات`;
  const count = document.querySelector("#route-count");
  if (count) count.textContent = routes.length;
}

function renderPassport(dataset) {
  const grid = document.querySelector(".passport-grid");
  const detail = document.querySelector("#passport-detail");
  if (!grid || !detail || !dataset.passportStops?.length) return;
  grid.innerHTML = dataset.passportStops.map((stop, index) => `<button class="passport-stop ${index === 0 ? "active" : ""}" data-passport-index="${index}"><span>0${index + 1}</span><strong>${escapeHTML(stop.title)}</strong><small>${escapeHTML(stop.summary)}</small></button>`).join("");
  const show = (index) => {
    const stop = dataset.passportStops[index];
    document.querySelectorAll("[data-passport-index]").forEach((item) => item.classList.toggle("active", Number(item.dataset.passportIndex) === index));
    detail.innerHTML = `<span class="passport-detail-index">المحطة 0${index + 1}</span><h3>${escapeHTML(stop.title)}</h3><p>${escapeHTML(stop.summary)}</p><div class="passport-check"><b>ما الذي نتحقق منه؟</b><span>${escapeHTML(stop.evidenceNeeded.join(" · "))}</span></div>`;
  };
  grid.querySelectorAll("[data-passport-index]").forEach((button) => button.addEventListener("click", () => show(Number(button.dataset.passportIndex))));
}

function attachFilters() {
  const fields = { duration: "#duration-filter", difficulty: "#difficulty-filter", type: "#type-filter" };
  Object.entries(fields).forEach(([key, selector]) => document.querySelector(selector)?.addEventListener("change", (event) => {
    activeFilters[key] = event.target.value;
    renderRoutes();
  }));
  document.querySelector("#filter-reset")?.addEventListener("click", () => {
    activeFilters = { duration: "all", difficulty: "all", type: "all" };
    Object.values(fields).forEach((selector) => { const field = document.querySelector(selector); if (field) field.value = "all"; });
    renderRoutes();
  });
}

function attachStaticInteractions() {
  document.querySelectorAll("[data-scroll]").forEach((button) => button.addEventListener("click", () => document.querySelector(button.dataset.scroll).scrollIntoView({ behavior: "smooth" })));
  document.querySelector("#print-plan").addEventListener("click", () => window.print());
  document.querySelectorAll("[data-booking]").forEach((button) => button.addEventListener("click", () => {
    document.querySelector("#booking-choice").value = button.dataset.booking;
    document.querySelector("#bookings").scrollIntoView({ behavior: "smooth", block: "center" });
    document.querySelector("#booking-date").focus();
  }));
  document.querySelector("#booking-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const choice = document.querySelector("#booking-choice").value;
    const date = document.querySelector("#booking-date").value;
    const people = document.querySelector("#booking-people").value;
    const contact = document.querySelector("#booking-contact").value.trim();
    const result = document.querySelector("#booking-result");
    const formatted = new Date(`${date}T12:00:00`).toLocaleDateString("ar", { dateStyle: "full" });
    result.hidden = false;
    result.innerHTML = `<strong>مسودة جاهزة للمراجعة</strong><br>${escapeHTML(choice)}<br>${escapeHTML(formatted)} · ${escapeHTML(people)} أشخاص<br>التواصل: ${escapeHTML(contact)}<br><small>انسخ هذه المسودة وتحقق من الشريك المحلي قبل الدفع أو الوصول.</small>`;
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

async function loadRoutes() {
  try {
    const response = await fetch("./data/routes.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`routes.json returned ${response.status}`);
    activeDataset = await response.json();
    renderRoutes();
    renderPassport(activeDataset);
    document.body.dataset.routesLoaded = "true";
  } catch (error) {
    console.warn("SENSE Routes data contract unavailable; keeping editorial fallback.", error);
    document.body.dataset.routesLoaded = "fallback";
  }
}

attachStaticInteractions();
attachFilters();
renderPlan();
loadRoutes();
