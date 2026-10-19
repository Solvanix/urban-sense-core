const state = { catalog: null, cart: [], activeCategory: "الكل" };
const $ = (selector) => document.querySelector(selector);
const money = (value) => (value == null ? "يحتاج تأكيد" : `${value} ₪`);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
}[char]));

async function init() {
  try {
    const response = await fetch("./catalog.json");
    if (!response.ok) throw new Error("catalog unavailable");
    state.catalog = await response.json();
    renderFilters();
    renderMenu();
    renderCart();
  } catch {
    $("#menuGrid").innerHTML = '<p class="empty">تعذر تحميل القائمة. راجع ملف الكتالوج أو شغّل الموقع عبر خادم محلي.</p>';
  }
}

function renderFilters() {
  const categories = ["الكل", ...new Set(state.catalog.products.map((product) => product.category))];
  $("#categoryFilters").innerHTML = categories.map((category) => `
    <button class="filter-button${category === state.activeCategory ? " active" : ""}" type="button" data-category="${escapeHtml(category)}" aria-pressed="${category === state.activeCategory}">
      ${escapeHtml(category)}
    </button>
  `).join("");
  $("#categoryFilters").querySelectorAll("[data-category]").forEach((button) => {
    button.onclick = () => {
      state.activeCategory = button.dataset.category;
      renderFilters();
      renderMenu();
    };
  });
}

function renderMenu() {
  const products = state.catalog.products.filter((product) => state.activeCategory === "الكل" || product.category === state.activeCategory);
  const grid = $("#menuGrid");
  grid.innerHTML = products.length ? products.map((product) => `
    <article class="product">
      <span class="product-cat">${escapeHtml(product.category)}</span>
      <h3>${escapeHtml(product.name)}</h3>
      <p>${escapeHtml(product.nameEn)}</p>
      <strong>${money(product.price)}</strong>
      <button class="button small-button" type="button" data-add="${escapeHtml(product.id)}" ${product.price == null ? "disabled" : ""}>
        ${product.price == null ? "السعر قيد التحقق" : "أضف للسلة"}
      </button>
    </article>
  `).join("") : '<p class="empty">لا توجد أصناف في هذا التصنيف.</p>';
  grid.querySelectorAll("[data-add]").forEach((button) => {
    button.onclick = () => add(button.dataset.add);
  });
}

function add(id) {
  const product = state.catalog.products.find((item) => item.id === id);
  if (!product || product.price == null) return;
  const item = state.cart.find((entry) => entry.id === id);
  item ? item.qty++ : state.cart.push({ id, qty: 1 });
  renderCart();
  toast(`أضيف ${product.name} إلى السلة`);
}

function renderCart() {
  const items = $("#cartItems");
  $("#cartCount").textContent = state.cart.reduce((total, item) => total + item.qty, 0);
  items.innerHTML = state.cart.length ? state.cart.map((item) => {
    const product = state.catalog.products.find((candidate) => candidate.id === item.id);
    return `<div class="cart-item"><div><b>${escapeHtml(product.name)}</b><small>${money(product.price)}</small></div><div class="qty"><button type="button" aria-label="إنقاص ${escapeHtml(product.name)}" data-dec="${escapeHtml(product.id)}">−</button><span>${item.qty}</span><button type="button" aria-label="زيادة ${escapeHtml(product.name)}" data-inc="${escapeHtml(product.id)}">+</button></div></div>`;
  }).join("") : '<p class="empty">السلة فارغة.</p>';
  items.querySelectorAll("[data-inc]").forEach((button) => button.onclick = () => {
    state.cart.find((item) => item.id === button.dataset.inc).qty++;
    renderCart();
  });
  items.querySelectorAll("[data-dec]").forEach((button) => button.onclick = () => {
    const index = state.cart.findIndex((item) => item.id === button.dataset.dec);
    state.cart[index].qty--;
    if (state.cart[index].qty < 1) state.cart.splice(index, 1);
    renderCart();
  });
  const total = state.cart.reduce((sum, item) => {
    const product = state.catalog.products.find((candidate) => candidate.id === item.id);
    return sum + (product.price || 0) * item.qty;
  }, 0);
  $("#cartTotal").textContent = `${total} ₪`;
}

function answer(question) {
  const normalized = question.toLowerCase();
  const product = state.catalog.products.find((item) => normalized.includes(item.name.toLowerCase()) || normalized.includes(item.nameEn.toLowerCase()));
  if (/سعر|بكم|كم/.test(normalized) && product) return product.price ? `سعر ${product.name} هو ${product.price} شيكل.` : `سعر ${product.name} غير موثق بعد.`;
  if (/قائمة|منتج|بيتزا/.test(normalized)) return `لدينا ${state.catalog.products.filter((item) => item.price != null).map((item) => `${item.name} (${item.price}₪)`).join("، ")}. المنتجات الأخرى تحتاج تأكيد السعر.`;
  if (/توصيل|يوصل|متى|ساعات|مفتوح|عنوان|هاتف/.test(normalized)) return "هذه المعلومة غير موثقة بعد. سأرفعها للمراجعة البشرية ولا أستطيع اختلاقها.";
  return "لم أجد إجابة موثقة. يمكن للمسؤول مراجعة هذا السؤال قبل الرد.";
}

$("#chatForm").onsubmit = (event) => {
  event.preventDefault();
  const input = $("#chatInput");
  const question = input.value.trim();
  if (!question) return;
  $("#chatLog").insertAdjacentHTML("beforeend", `<div class="bubble user">${escapeHtml(question)}</div><div class="bubble agent">${escapeHtml(answer(question))}</div>`);
  input.value = "";
};

$("#cartButton").onclick = () => {
  $("#cartDrawer").setAttribute("aria-hidden", "false");
  $("#cartDrawer").classList.add("open");
};
$("#closeCart").onclick = () => {
  $("#cartDrawer").setAttribute("aria-hidden", "true");
  $("#cartDrawer").classList.remove("open");
};
$("#orderForm").onsubmit = (event) => {
  event.preventDefault();
  if (!state.cart.length) return toast("أضف منتجاً مسعراً أولاً");
  toast("تم تجهيز الطلب للمراجعة البشرية فقط");
  event.target.reset();
};
function toast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.add("show");
  setTimeout(() => element.classList.remove("show"), 2600);
}

init();
