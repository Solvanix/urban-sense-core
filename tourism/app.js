const planKey = "sense-routes-plan-v1";
const list = document.querySelector("#plan-list");
const empty = document.querySelector("#plan-empty");
let plan = JSON.parse(localStorage.getItem(planKey) || "[]");

function renderPlan() {
  empty.hidden = plan.length > 0;
  list.innerHTML = plan.map((item, index) => `<li><span>${index + 1}</span><div><strong>${item}</strong><small>مسار محفوظ في هذه الرحلة · <button data-remove="${item}">إزالة</button></small></div></li>`).join("");
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

function routeCard(route, index) {
  const image = routeImageClass(index);
  const source = route.confidence?.basis?.length ? route.confidence.basis.join(" · ") : "مصدر قيد الإضافة";
  const evidence = route.nextEvidence?.slice(0, 2).join(" · ") || "تحتاج مراجعة محلية";
  return `<article class="route-card ${index === 0 ? "featured" : ""}" data-route-id="${route.id}">
    <div class="route-photo ${image}">${image === "route-text" ? `<span class="route-icon">✦</span>` : ""}</div>
    <div class="route-body"><span class="route-tag">${String(index + 1).padStart(2, "0")} · ${route.kicker}</span><h3>${route.title}</h3><p>${route.description}</p>
    <div class="route-meta"><span>◷ ${route.duration.label}</span><span>◎ ${route.category}</span></div>
    <div class="route-trust"><span>${route.access.label}</span><small>المصدر: ${source}</small><small>التالي: ${evidence}</small></div>
    <button class="add-route" data-add="${route.title}">أضف إلى خطتي +</button></div></article>`;
}

function renderRoutes(dataset) {
  const grid = document.querySelector(".route-grid");
  if (!grid || !dataset.routes?.length) return;
  grid.innerHTML = dataset.routes.map(routeCard).join("");
  grid.querySelectorAll("[data-add]").forEach((button) => button.addEventListener("click", () => addToPlan(button.dataset.add, button)));
  const count = document.querySelector("#route-count");
  if (count) count.textContent = dataset.routes.length;
}

function renderPassport(dataset) {
  const grid = document.querySelector(".passport-grid");
  const detail = document.querySelector("#passport-detail");
  if (!grid || !detail || !dataset.passportStops?.length) return;
  grid.innerHTML = dataset.passportStops.map((stop, index) => `<button class="passport-stop ${index === 0 ? "active" : ""}" data-passport-index="${index}"><span>0${index + 1}</span><strong>${stop.title}</strong><small>${stop.summary}</small></button>`).join("");
  const show = (index) => {
    const stop = dataset.passportStops[index];
    document.querySelectorAll("[data-passport-index]").forEach((item) => item.classList.toggle("active", Number(item.dataset.passportIndex) === index));
    detail.innerHTML = `<span class="passport-detail-index">المحطة 0${index + 1}</span><h3>${stop.title}</h3><p>${stop.summary}</p><div class="passport-check"><b>ما الذي نتحقق منه؟</b><span>${stop.evidenceNeeded.join(" · ")}</span></div>`;
  };
  grid.querySelectorAll("[data-passport-index]").forEach((button) => button.addEventListener("click", () => show(Number(button.dataset.passportIndex))));
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
    result.innerHTML = `<strong>مسودة جاهزة للمراجعة</strong><br>${choice}<br>${formatted} · ${people} أشخاص<br>التواصل: ${contact}<br><small>انسخ هذه المسودة وتحقق من الشريك المحلي قبل الدفع أو الوصول.</small>`;
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

async function loadRoutes() {
  try {
    const response = await fetch("./data/routes.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`routes.json returned ${response.status}`);
    const dataset = await response.json();
    renderRoutes(dataset);
    renderPassport(dataset);
    document.body.dataset.routesLoaded = "true";
  } catch (error) {
    console.warn("SENSE Routes data contract unavailable; keeping editorial fallback.", error);
    document.body.dataset.routesLoaded = "fallback";
  }
}

attachStaticInteractions();
renderPlan();
loadRoutes();
