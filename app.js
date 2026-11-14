/* ============================================================
   LYKOON HUB — project list
   ------------------------------------------------------------
   Naya app ya website add karni ho to bas neeche PROJECTS
   array mein ek naya object add kar dein. Baaki sab (tile,
   card, "Open" button) khud ban jayega.

   status: "live"  -> teal glowing badge, clickable "Open" tile
           "soon"   -> dashed empty tile, koi link nahi
   ============================================================ */

const PROJECTS = [
  {
    name: "Lykoon Adds",
    tagline: "Complete simple tasks and get paid out — real rewards for real effort.",
    url: "https://lykoonadds.up.railway.app/",
    icon: "assets/lykoon.png",   // coin + checkmark mark — matches the app's reward theme
    initials: "LA",               // fallback agar icon load na ho
    kind: "Web app",
    status: "live"
  },
  {
    name: "Academy",
    tagline: "An academy of science — learning resources and courses.",
    url: "https://alnaseer.vercel.app/",
    icon: "assets/academy-icon.svg",   // graduation-cap mark — matches the academic theme
    initials: "AC",
    kind: "Web app",
    status: "live"
  },
  {
    name: "Unfollow by Lykoon",
    tagline: "Free desktop dashboard to unfollow in bulk on Instagram and TikTok.",
    url: "#download",
    cta: "Download",
    icon: "assets/unfollow-icon.svg",
    initials: "UL",
    kind: "Desktop app",
    status: "live"
  }
  // Yahan neeche naya project add karein, jaise:
  // {
  //   name: "App Ka Naam",
  //   tagline: "Ek line mein app kya karti hai.",
  //   url: "https://your-app-link.com/",
  //   icon: "assets/appname-icon.png", // agar app ka apna logo hai to yahan daalein
  //   initials: "XX",                  // agar logo nahi hai to sirf ye 2 letters dikhenge
  //   status: "live"
  // },
];

/* Kitne khaali "coming soon" slots dikhane hain jab tak
   naye projects add nahi hote */
const EMPTY_SLOTS = 1;

function renderStatusStrip(){
  const el = document.getElementById("statusStrip");
  if (!el) return;
  const live = PROJECTS.filter(p => p.status === "live");
  const web = live.filter(p => p.kind === "Web app").length;
  const desk = live.filter(p => p.kind === "Desktop app").length;
  const soon = PROJECTS.filter(p => p.status !== "live").length + EMPTY_SLOTS;
  const card = (n, label, cls) => `<div class="stat ${cls || ""}"><b>${n}</b><span>${label}</span></div>`;
  el.innerHTML = card(live.length, "Live now", "s-live") + card(web, "Websites", "s-web") + card(desk, "Desktop apps", "s-desk") + card(soon, "In the works", "");
}

function renderTiles(){
  const wrap = document.getElementById("tiles");
  wrap.innerHTML = "";

  let index = 0;

  PROJECTS.forEach(p => {
    const isLive = p.status === "live";
    const tile = document.createElement(isLive ? "a" : "div");
    tile.className = `tile ${isLive ? "live" : "soon"} ${p.kind === "Desktop app" ? "k-desk" : "k-web"} reveal-target`;
    tile.dataset.name = p.name.toLowerCase();
    tile.dataset.kind = p.kind || "";
    tile.style.transitionDelay = `${index * 70}ms`;
    index++;
    if (isLive) {
      tile.href = p.url;
      if (!p.url.startsWith("#")) {      // "#..." = scroll inside this page, everything else opens a new tab
        tile.target = "_blank";
        tile.rel = "noopener noreferrer";
      }
    }

    const iconInner = p.icon
      ? `<img src="${p.icon}" alt="${p.name} logo" loading="lazy" decoding="async" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${p.initials}'}))">`
      : p.initials;

    const badge = isLive
      ? `<span class="badge"><span class="dot"></span>Live</span>`
      : `<span class="badge badge-soon">Soon</span>`;

    const isDesk = p.kind === "Desktop app";
    let host = "";
    try { host = new URL(p.url).hostname; } catch (e) {}
    const bar = isDesk
      ? `<span class="tile-url">Windows · Mac · Linux</span>`
      : `<span class="tile-url"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" stroke="currentColor" stroke-width="1.5"/></svg>${host}</span>`;
    const kindLabel = isDesk ? "Desktop app" : "Website";

    tile.innerHTML = `
      <div class="tile-bar"><i></i><i></i><i></i>${bar}</div>
      <div class="tile-top">
        <div class="tile-icon">${iconInner}</div>
        ${badge}
      </div>
      <div class="tile-body">
        <div class="tile-name">${p.name}</div>
        <p class="tile-tagline">${p.tagline}</p>
      </div>
      <div class="tile-foot"><span class="tile-kind">${kindLabel}</span>${isLive ? `<span class="tile-open">${p.cta || "Open"} <span class="arrow">→</span></span>` : `<span class="tile-open tile-open-soon">Coming soon</span>`}</div>
    `;
    wrap.appendChild(tile);
  });

  for (let i = 0; i < EMPTY_SLOTS; i++){
    const empty = document.createElement("div");
    empty.className = "tile empty reveal-target";
    empty.dataset.empty = "true";
    empty.style.transitionDelay = `${index * 70}ms`;
    index++;
    empty.innerHTML = `
      <div class="tile-icon">?</div>
      <span class="empty-label">Next build goes here</span>
    `;
    wrap.appendChild(empty);
  }
}

function setupSearch(){
  const input = document.getElementById("searchInput");
  const noResults = document.getElementById("noResults");
  const seg = document.getElementById("seg");
  const countEl = document.getElementById("countLabel");
  let kind = "all";

  function apply(){
    const term = input.value.trim().toLowerCase();
    let shown = 0;
    document.querySelectorAll("#tiles .tile").forEach(tile => {
      if (tile.dataset.empty){
        tile.classList.toggle("hidden", term.length > 0 || kind !== "all");
        return;
      }
      const ok = tile.dataset.name.includes(term) && (kind === "all" || tile.dataset.kind === kind);
      tile.classList.toggle("hidden", !ok);
      if (ok) shown++;
    });
    noResults.hidden = shown > 0;
    countEl.textContent = shown + (shown === 1 ? " app" : " apps");
  }

  input.addEventListener("input", apply);
  seg.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    kind = b.dataset.kind;
    seg.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b));
    apply();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)){
      e.preventDefault();
      input.focus();
    }
  });
  apply();
}

/* Download window: stays closed until a tile / button / link to #download is clicked */
function setupDownloadDialog(){
  const dlg = document.getElementById("dlDialog");
  if (!dlg || typeof dlg.showModal !== "function") return;
  let opener = null;

  function open(from){
    if (dlg.open) return;
    opener = from || null;
    dlg.showModal();
    document.body.classList.add("dl-open");
    history.replaceState(null, "", "#download");
  }
  function close(){ if (dlg.open) dlg.close(); }

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href="#download"]');
    if (!a) return;
    e.preventDefault();
    open(a);
  });
  dlg.querySelector("[data-close]").addEventListener("click", close);
  dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });   // click on the dark area
  dlg.addEventListener("close", () => {
    document.body.classList.remove("dl-open");
    if (location.hash === "#download") history.replaceState(null, "", location.pathname + location.search);
    if (opener && opener.focus) opener.focus({ preventScroll: true });
  });
  window.addEventListener("hashchange", () => { if (location.hash === "#download") open(null); });
  if (location.hash === "#download") open(null);   // direct link still works
}

function renderHeroGrid(){
  const grid = document.getElementById("heroGrid");
  const total = 36;
  const filledIndex = 14; // roughly center — echoes the logo mark
  for (let i = 0; i < total; i++){
    const cell = document.createElement("div");
    cell.className = "cell" + (i === filledIndex ? " filled" : "");
    grid.appendChild(cell);
  }
}

function setupFeedback(){
  const form = document.getElementById("feedbackForm");
  const note = document.getElementById("feedbackNote");
  const FEEDBACK_EMAIL = "lykoonofficial@gmail.com";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("fbName").value.trim();
    const message = document.getElementById("fbMessage").value.trim();
    if (!message) return;

    const subject = `Lykoon Hub feedback${name ? " from " + name : ""}`;
    const body = message + (name ? `\n\n— ${name}` : "");
    const mailLink = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailLink;
    note.hidden = false;
    form.reset();
  });
}

function setupDownloadHint(){
  // Show the start instruction that matches the visitor's computer
  const el = document.getElementById("osHint");
  if (!el) return;
  const ua = (navigator.userAgent || "") + " " + (navigator.platform || "");
  let html = "";
  if (/android|iphone|ipad|ipod/i.test(ua)) html = "This tool runs on a <b>computer</b> (Windows, Mac or Linux). Open this page on your computer to download it.";
  else if (/win/i.test(ua)) html = "You are on Windows: double-click <code>Start-Windows.bat</code>.";
  else if (/mac/i.test(ua)) html = "You are on a Mac: double-click <code>Start-Mac.command</code> (first time: right-click, then Open).";
  else if (/linux|x11|cros/i.test(ua)) html = "You are on Linux: run <code>./Start-Linux.sh</code> in the folder (or <code>python3 unfollow_app.py</code>).";
  if (html) el.innerHTML = html;
}

function setupScrollReveal(){
  const targets = document.querySelectorAll(".reveal-target");
  if (!("IntersectionObserver" in window)){
    return; // purane browsers me sab kuch bas normally visible rahega
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => {
    el.classList.add("reveal");
    observer.observe(el);
  });
}

function setupHeaderScroll(){
  const header = document.querySelector(".topbar");
  if (!header) return;

  let progressEl = header.querySelector(".scroll-progress");
  if (!progressEl){
    progressEl = document.createElement("span");
    progressEl.className = "scroll-progress";
    progressEl.setAttribute("aria-hidden", "true");
    header.appendChild(progressEl);
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progressEl.style.setProperty("--progress", `${pct}%`);
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function setupTileSpotlight(){
  // Sirf fine-pointer (mouse/trackpad) devices par — touch par iska koi fayda nahi
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  document.addEventListener("pointermove", (e) => {
    const tile = e.target.closest(".tile.live");
    if (!tile) return;
    const rect = tile.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    tile.style.setProperty("--mx", `${x}px`);
    tile.style.setProperty("--my", `${y}px`);

    const rx = ((y / rect.height) - 0.5) * -6;
    const ry = ((x / rect.width) - 0.5) * 6;
    tile.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
    tile.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
  }, { passive: true });

  document.addEventListener("pointerleave", (e) => {
    const tile = e.target.closest && e.target.closest(".tile.live");
    if (!tile) return;
    tile.style.setProperty("--rx", `0deg`);
    tile.style.setProperty("--ry", `0deg`);
  }, { passive: true, capture: true });
}

document.getElementById("year").textContent = new Date().getFullYear();

renderTiles();
renderStatusStrip();
renderHeroGrid();
setupSearch();
setupDownloadDialog();
setupFeedback();
setupDownloadHint();
setupScrollReveal();
setupHeaderScroll();
setupTileSpotlight();
