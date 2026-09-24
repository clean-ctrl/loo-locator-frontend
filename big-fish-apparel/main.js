(function () {
  "use strict";

  const products = window.BIGFISH_PRODUCTS || [];
  const insta = window.BIGFISH_INSTAGRAM || [];
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const money = (n) => "$" + n.toFixed(0);
  let uid = 0;

  // ---------- Illustrations ----------
  const FISH_PATH =
    "M20 50C50 15 120 12 160 45L190 22 182 50 190 78 160 55C120 88 50 85 20 50Z";

  function fishPattern(id, fish) {
    return (
      `<pattern id="${id}" width="46" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(-10)">` +
      `<path d="${FISH_PATH}" fill="${fish}" transform="translate(4 4) scale(.15)"/>` +
      `<path d="${FISH_PATH}" fill="${fish}" transform="translate(27 18) scale(.15)"/>` +
      `</pattern>`
    );
  }

  function fleeceSVG(base, fish, kind) {
    const id = "fp" + ++uid;
    if (kind === "toque") {
      return (
        `<svg viewBox="0 0 240 240" class="art" aria-hidden="true"><defs>${fishPattern(id, fish)}</defs>` +
        `<circle cx="120" cy="52" r="22" fill="${fish}"/>` +
        `<path d="M50 170C50 90 80 64 120 64s70 26 70 106Z" fill="${base}"/>` +
        `<path d="M50 170C50 90 80 64 120 64s70 26 70 106Z" fill="url(#${id})" opacity=".85"/>` +
        `<rect x="40" y="160" width="160" height="40" rx="12" fill="${base}"/>` +
        `<path d="M50 172h140M50 180h140M50 188h140" stroke="rgba(0,0,0,.12)" stroke-width="3"/>` +
        `</svg>`
      );
    }
    const body =
      "M85 40 105 32Q120 44 135 32L155 40 200 62 222 150 196 158 182 110V206Q120 216 58 206V110L44 158 18 150 40 62Z";
    return (
      `<svg viewBox="0 0 240 240" class="art" aria-hidden="true"><defs>${fishPattern(id, fish)}</defs>` +
      `<path d="${body}" fill="${base}"/>` +
      `<path d="${body}" fill="url(#${id})"/>` +
      `<path d="M58 196Q120 206 182 196V206Q120 216 58 206Z" fill="rgba(0,0,0,.14)"/>` +
      `<path d="M103 33 106 20Q120 25 134 20L137 33Q120 45 103 33Z" fill="${base}" stroke="rgba(0,0,0,.18)" stroke-width="2"/>` +
      `<path d="M120 30V92" stroke="rgba(0,0,0,.35)" stroke-width="3" stroke-linecap="round"/>` +
      `<circle cx="120" cy="92" r="3.5" fill="#d9d2c3"/>` +
      `<rect x="140" y="98" width="30" height="22" rx="3" fill="${base}" stroke="rgba(0,0,0,.18)" stroke-width="2"/>` +
      `</svg>`
    );
  }

  $$("[data-fleece]").forEach((el) => {
    const [base, fish] = el.dataset.fleece.split(",");
    el.innerHTML = fleeceSVG(base, fish);
  });

  // ---------- Photos with illustrated fallbacks ----------
  function wirePhoto(fig) {
    const img = $("img", fig);
    if (!img) return;
    const ok = () => fig.classList.add("has-photo");
    const bad = () => {
      fig.classList.add("no-photo");
      img.remove();
    };
    if (img.complete) (img.naturalWidth ? ok : bad)();
    else {
      img.addEventListener("load", ok, { once: true });
      img.addEventListener("error", bad, { once: true });
    }
  }

  function photoBlock(src, alt, fallbackHTML, extraClass = "") {
    const fig = document.createElement("div");
    fig.className = "photo " + extraClass;
    fig.innerHTML =
      `<img src="${src}" alt="${alt}" loading="lazy" width="600" height="600" />` +
      `<div class="photo__fallback" aria-hidden="true">${fallbackHTML}</div>`;
    wirePhoto(fig);
    return fig;
  }

  $$("[data-photo]").forEach(wirePhoto);

  // ---------- Products ----------
  const grid = $("[data-products]");
  function renderProducts(filter = "all") {
    grid.innerHTML = "";
    products
      .filter((p) => filter === "all" || p.category === filter)
      .forEach((p) => {
        const li = document.createElement("li");
        li.className = "product";
        li.style.setProperty("--tint", p.colors.base);
        const media = photoBlock(
          p.image,
          `${p.name} — ${p.tagline}`,
          fleeceSVG(p.colors.base, p.colors.fish, p.kind),
          "product__media"
        );
        if (p.badge) {
          const b = document.createElement("span");
          b.className = "product__badge";
          b.textContent = p.badge;
          media.appendChild(b);
        }
        li.appendChild(media);
        const body = document.createElement("div");
        body.className = "product__body";
        const sizeId = `size-${p.id}`;
        body.innerHTML =
          `<div class="product__top"><h3>${p.name}</h3><span class="product__price">${money(p.price)}</span></div>` +
          `<p class="product__tag">${p.tagline}</p>` +
          `<div class="product__buy">` +
          `<label class="sr-only" for="${sizeId}">Size for ${p.name}</label>` +
          `<select id="${sizeId}" class="select">${p.sizes.map((s) => `<option>${s}</option>`).join("")}</select>` +
          `<button class="btn btn--primary btn--sm" data-add="${p.id}">Add to cart</button>` +
          `</div>`;
        if (p.sizes.length === 1) $("select", body).value = p.sizes[0];
        if (p.sizes.includes("M")) $("select", body).value = "M";
        li.appendChild(body);
        grid.appendChild(li);
      });
  }

  const filterWrap = $("[data-filters]");
  function setFilter(f) {
    $$(".chip", filterWrap).forEach((c) => {
      const on = c.dataset.filter === f;
      c.classList.toggle("is-active", on);
      c.setAttribute("aria-pressed", String(on));
    });
    renderProducts(f);
  }
  filterWrap.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-filter]");
    if (chip) setFilter(chip.dataset.filter);
  });
  $$("[data-jump-filter]").forEach((a) =>
    a.addEventListener("click", () => setFilter(a.dataset.jumpFilter))
  );
  renderProducts();

  // ---------- Cart ----------
  const CART_KEY = "bigfish-cart";
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (_) {
    cart = [];
  }
  cart = cart.filter((l) => products.some((p) => p.id === l.id));
  const save = () => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (_) {}
  };

  const drawer = $("[data-cart]");
  const backdrop = $("[data-cart-backdrop]");
  let lastFocus = null;

  function renderCart() {
    const list = $("[data-cart-items]");
    const count = cart.reduce((n, l) => n + l.qty, 0);
    const total = cart.reduce((n, l) => n + l.qty * products.find((p) => p.id === l.id).price, 0);
    $("[data-cart-count]").textContent = count;
    $("[data-cart-count]").classList.toggle("is-empty", count === 0);
    $("[data-cart-total]").textContent = money(total);
    $("[data-cart-give]").textContent = total
      ? `5% of our profit on this order goes back to local streams. 🐟`
      : "";
    if (!cart.length) {
      list.innerHTML = `<li class="drawer__empty">Your net's empty. <a href="#shop" data-cart-close>Go catch something →</a></li>`;
      return;
    }
    list.innerHTML = "";
    cart.forEach((l, i) => {
      const p = products.find((x) => x.id === l.id);
      const li = document.createElement("li");
      li.className = "line";
      li.innerHTML =
        `<div class="line__art">${fleeceSVG(p.colors.base, p.colors.fish, p.kind)}</div>` +
        `<div class="line__info"><strong>${p.name}</strong><span>Size ${l.size}</span>` +
        `<div class="qty" role="group" aria-label="Quantity for ${p.name}">` +
        `<button data-qty="${i}" data-d="-1" aria-label="One less">−</button><span>${l.qty}</span>` +
        `<button data-qty="${i}" data-d="1" aria-label="One more">+</button></div></div>` +
        `<div class="line__price">${money(p.price * l.qty)}<button class="line__remove" data-remove="${i}">Remove</button></div>`;
      list.appendChild(li);
    });
  }

  function openCart() {
    lastFocus = document.activeElement;
    drawer.hidden = backdrop.hidden = false;
    requestAnimationFrame(() => document.body.classList.add("cart-open"));
    $("[data-cart-close]", drawer).focus();
  }
  function closeCart() {
    document.body.classList.remove("cart-open");
    setTimeout(() => (drawer.hidden = backdrop.hidden = true), 250);
    if (lastFocus) lastFocus.focus();
  }

  let toastTimer;
  function toast(msg) {
    const t = $("[data-toast]");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-on"), 2400);
  }

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    const id = btn.dataset.add;
    const size = $("select", btn.closest(".product")).value;
    const line = cart.find((l) => l.id === id && l.size === size);
    if (line) line.qty++;
    else cart.push({ id, size, qty: 1 });
    save();
    renderCart();
    const p = products.find((x) => x.id === id);
    toast(`${p.name} (${size}) is in your net!`);
    const cb = $(".cart-btn");
    cb.classList.remove("bump");
    void cb.offsetWidth;
    cb.classList.add("bump");
  });

  drawer.addEventListener("click", (e) => {
    const q = e.target.closest("[data-qty]");
    const r = e.target.closest("[data-remove]");
    if (e.target.closest("[data-cart-close]")) return closeCart();
    if (q) {
      const l = cart[+q.dataset.qty];
      l.qty += +q.dataset.d;
      if (l.qty < 1) cart.splice(+q.dataset.qty, 1);
    } else if (r) cart.splice(+r.dataset.remove, 1);
    else return;
    save();
    renderCart();
  });
  $("[data-cart-open]").addEventListener("click", openCart);
  backdrop.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => {
    if (drawer.hidden) return;
    if (e.key === "Escape") closeCart();
    if (e.key === "Tab") {
      const f = $$("a[href], button, select, input", drawer).filter((x) => !x.disabled);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  renderCart();

  // ---------- Instagram grid ----------
  const instaList = $("[data-insta]");
  insta.forEach((post) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = post.url || window.BIGFISH_INSTAGRAM_URL;
    a.target = "_blank";
    a.rel = "noopener";
    a.className = "insta__tile";
    a.setAttribute("aria-label", `${post.alt} — view on Instagram`);
    a.style.setProperty("--tile", post.colors[0]);
    a.appendChild(photoBlock(post.image, post.alt, fleeceSVG(post.colors[0], post.colors[1]), "insta__photo"));
    li.appendChild(a);
    instaList.appendChild(li);
  });

  // ---------- Nav ----------
  const toggle = $("[data-nav-toggle]");
  const navList = $("[data-nav-list]");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    navList.classList.toggle("is-open", open);
  });
  navList.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      toggle.setAttribute("aria-expanded", "false");
      navList.classList.remove("is-open");
    }
  });

  const header = $("[data-header]");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Newsletter ----------
  const form = $("[data-newsletter]");
  const msg = $("[data-newsletter-msg]");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.textContent = "Hmm, that email looks a little fishy. Mind checking it?";
      msg.classList.add("is-error");
      form.email.focus();
      return;
    }
    msg.classList.remove("is-error");
    msg.textContent = "You're in the school! Watch your inbox for new prints. 🐟";
    form.reset();
  });

  // ---------- Reveal on scroll ----------
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.12 }
    );
    $$(".section__head, .fish-card, .streams__copy, .story__copy, .product, .insta li").forEach((el) => {
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  $("[data-year]").textContent = new Date().getFullYear();
})();
