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

document.querySelectorAll("[data-add]").forEach((button) => button.addEventListener("click", () => {
  const item = button.dataset.add;
  if (!plan.includes(item)) plan.push(item);
  localStorage.setItem(planKey, JSON.stringify(plan));
  button.textContent = "أضيفت إلى خطتي ✓";
  button.classList.add("added");
  renderPlan();
  document.querySelector("#plan").scrollIntoView({ behavior: "smooth", block: "center" });
}));

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

renderPlan();

const passportStops = [
  { index: "المحطة 01", title: "شجرة تعرّف بالمكان", text: "لا يبدأ الزائر بشاشة مزدحمة. يبدأ بحكاية الموسم، وطريقة العناية، وما تعنيه الأرض للعائلة.", check: "مضيف موافق · قصة قابلة للنشر · حق تصوير واضح" },
  { index: "المحطة 02", title: "الطريق الذي لا يظهر من بعيد", text: "نمر بين تضاريس وقرى ومشاهد تحتاج مرشدًا يشرح أسماء المواضع ويحدد نقاط التوقف الآمنة ويحمي البيوت والأراضي الخاصة.", check: "مسار آمن · نقطة توقف معتمدة · لا تصوير بلا إذن" },
  { index: "المحطة 03", title: "المغارة التي لا تُفتح قبل أن تُحمى", text: "أكثر المحطات إثارة هي الأكثر احتياجًا للمسؤولية. لا زيارة مفتوحة قبل فحص السلامة والملكية وحق الوصول والبيئة الداخلية.", check: "فحص ميداني · حق وصول · مرشد مؤهل · عدد محدود" },
  { index: "المحطة 04", title: "اقتصاد صغير له وجه", text: "تكتمل الرحلة حين تصل منفعتها إلى مزارع أو صاحب منتج أو حرفي أو مرشد؛ لا نعرض الناس كزينة للقصة.", check: "موافقة واضحة · منفعة محلية · شراء بوعي" },
];
document.querySelectorAll("[data-passport]").forEach((button) => button.addEventListener("click", () => {
  const stop = passportStops[Number(button.dataset.passport)];
  document.querySelectorAll("[data-passport]").forEach((item) => item.classList.toggle("active", item === button));
  document.querySelector("#passport-detail").innerHTML = `<span class="passport-detail-index">${stop.index}</span><h3>${stop.title}</h3><p>${stop.text}</p><div class="passport-check"><b>ما الذي نتحقق منه؟</b><span>${stop.check}</span></div>`;
}));
