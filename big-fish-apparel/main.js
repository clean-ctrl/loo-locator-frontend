(function () {
  "use strict";

  const products = window.BIGFISH_PRODUCTS || [];
  const insta = window.BIGFISH_INSTAGRAM || [];
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const money = (n) => "$" + n.toFixed(0);
  const moneyCAD = (n) => `${money(n)}<small>CAD</small>`;
  let uid = 0;

  // ---------- Illustrations ----------
  // One silhouette per species, matching the <symbol>s in index.html.
  const FISH_SHAPES = {
    coho: "M20 50C50 15 120 12 160 45L190 22 182 50 190 78 160 55C120 88 50 85 20 50Z",
    chinook: "M14 52C44 10 124 8 162 44L192 18 184 52 192 84 162 60C124 94 44 92 14 52Z",
    rockfish:
      "M58 34 64 10 74 28 84 8 94 27 104 10 112 29 122 16 128 38ZM22 55C40 25 110 22 150 48L186 28 178 56 186 82 150 64C110 90 40 86 22 55Z",
    herring: "M16 50C50 34 120 32 162 46L192 30 184 50 192 70 162 54C120 68 50 66 16 50Z",
  };

  function fishPattern(id, fish, shape) {
    const d = FISH_SHAPES[shape] || FISH_SHAPES.coho;
    return (
      `<pattern id="${id}" width="46" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(-10)">` +
      `<path d="${d}" fill="${fish}" transform="translate(4 4) scale(.15)"/>` +
      `<path d="${d}" fill="${fish}" transform="translate(27 18) scale(.15)"/>` +
      `</pattern>`
    );
  }

  function fleeceSVG(base, fish, kind, shape) {
    const id = "fp" + ++uid;
    if (kind === "toque") {
      return (
        `<svg viewBox="0 0 240 240" class="art" aria-hidden="true"><defs>${fishPattern(id, fish, shape)}</defs>` +
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
      `<svg viewBox="0 0 240 240" class="art" aria-hidden="true"><defs>${fishPattern(id, fish, shape)}</defs>` +
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
    const [base, fish, shape] = el.dataset.fleece.split(",");
    el.innerHTML = fleeceSVG(base, fish, null, shape);
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
  const shopStatus = $("[data-shop-status]");
  function renderProducts(filter = "all", announce = false) {
    grid.innerHTML = "";
    const shown = products.filter((p) => filter === "all" || p.category === filter);
    if (announce) shopStatus.textContent = `${shown.length} ${shown.length === 1 ? "item" : "items"} shown`;
    shown.forEach((p) => {
        const li = document.createElement("li");
        li.className = "product";
        li.style.setProperty("--tint", p.colors.base);
        const media = photoBlock(
          p.image,
          `${p.name} — ${p.tagline}`,
          fleeceSVG(p.colors.base, p.colors.fish, p.kind, p.fish),
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
          `<div class="product__top"><h3>${p.name}</h3><span class="product__price">${moneyCAD(p.price)}</span></div>` +
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
    renderProducts(f, true);
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
    $("[data-cart-total]").innerHTML = moneyCAD(total);
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
        `<div class="line__art">${fleeceSVG(p.colors.base, p.colors.fish, p.kind, p.fish)}</div>` +
        `<div class="line__info"><strong>${p.name}</strong><span>Size ${l.size}</span>` +
        `<div class="qty" role="group" aria-label="Quantity for ${p.name}">` +
        `<button data-qty="${i}" data-d="-1" aria-label="One less ${p.name}, size ${l.size}">−</button><span aria-label="Quantity ${l.qty}">${l.qty}</span>` +
        `<button data-qty="${i}" data-d="1" aria-label="One more ${p.name}, size ${l.size}">+</button></div></div>` +
        `<div class="line__price">${money(p.price * l.qty)}<button class="line__remove" data-remove="${i}" aria-label="Remove ${p.name}, size ${l.size}">Remove</button></div>`;
      list.appendChild(li);
    });
  }

  let closeTimer;
  function openCart() {
    clearTimeout(closeTimer);
    hideToast();
    lastFocus = document.activeElement;
    drawer.hidden = backdrop.hidden = false;
    requestAnimationFrame(() => document.body.classList.add("cart-open"));
    $("[data-cart-close]", drawer).focus();
  }
  function closeCart() {
    document.body.classList.remove("cart-open");
    closeTimer = setTimeout(() => (drawer.hidden = backdrop.hidden = true), 250);
    if (lastFocus) lastFocus.focus();
  }

  let toastTimer;
  function toast(msg) {
    const t = $("[data-toast]");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 2400);
  }
  function hideToast() {
    clearTimeout(toastTimer);
    $("[data-toast]").classList.remove("is-on");
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
    let refocus;
    if (q) {
      const i = +q.dataset.qty;
      const l = cart[i];
      l.qty += +q.dataset.d;
      if (l.qty < 1) cart.splice(i, 1);
      else refocus = `[data-qty="${i}"][data-d="${q.dataset.d}"]`;
    } else if (r) cart.splice(+r.dataset.remove, 1);
    else return;
    save();
    renderCart();
    // Keep keyboard users where they were instead of dropping focus to <body>.
    const target = (refocus && $(refocus, drawer)) || $("[data-remove]", drawer) || $("[data-cart-close]", drawer);
    target.focus();
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
    a.appendChild(photoBlock(post.image, post.alt, fleeceSVG(post.colors[0], post.colors[1], null, post.fish), "insta__photo"));
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
  function closeNav(refocus) {
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    toggle.setAttribute("aria-expanded", "false");
    navList.classList.remove("is-open");
    if (refocus) toggle.focus();
  }
  navList.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeNav();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav(true);
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav")) closeNav();
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
      form.email.setAttribute("aria-invalid", "true");
      form.email.focus();
      return;
    }
    msg.classList.remove("is-error");
    form.email.removeAttribute("aria-invalid");
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
