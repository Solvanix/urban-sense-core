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
  button.textContent = plan.includes(item) ? "أضيفت إلى خطتي ✓" : "أضف إلى خطتي +";
  button.classList.add("added");
  renderPlan();
  document.querySelector("#plan").scrollIntoView({ behavior: "smooth", block: "center" });
}));

document.querySelectorAll("[data-scroll]").forEach((button) => button.addEventListener("click", () => document.querySelector(button.dataset.scroll).scrollIntoView({ behavior: "smooth" })));
document.querySelector("#print-plan").addEventListener("click", () => window.print());
renderPlan();
