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
    icon: "assets/lykoon.jpg",   // coin + checkmark mark — matches the app's reward theme
    initials: "LA",               // fallback agar icon load na ho
    status: "live"
  },
  {
    name: "Academy",
    tagline: "An academy of science — learning resources and courses.",
    url: "https://alnaseer.vercel.app/",
    icon: "assets/academy-icon.svg",   // graduation-cap mark — matches the academic theme
    initials: "RU",
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
const EMPTY_SLOTS = 2;

function renderStatusStrip(){
  const el = document.getElementById("statusStrip");
  if (!el) return;
  const liveCount = PROJECTS.filter(p => p.status === "live").length;
  const soonCount = PROJECTS.filter(p => p.status !== "live").length + EMPTY_SLOTS;
  el.innerHTML = `
    <span class="status-chip"><span class="dot"></span>${liveCount} live now</span>
    <span class="status-chip status-chip-muted">${soonCount} in the works</span>
  `;
}

function renderTiles(){
  const wrap = document.getElementById("tiles");
  wrap.innerHTML = "";

  let index = 0;

  PROJECTS.forEach(p => {
    const isLive = p.status === "live";
    const tile = document.createElement(isLive ? "a" : "div");
    tile.className = `tile ${isLive ? "live" : "soon"} reveal-target`;
    tile.dataset.name = p.name.toLowerCase();
    tile.style.transitionDelay = `${index * 70}ms`;
    index++;
    if (isLive) {
      tile.href = p.url;
      tile.target = "_blank";
      tile.rel = "noopener noreferrer";
    }

    const iconInner = p.icon
      ? `<img src="${p.icon}" alt="${p.name} logo" loading="lazy" decoding="async" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${p.initials}'}))">`
      : p.initials;

    const badge = isLive
      ? `<span class="badge"><span class="dot"></span>LIVE</span>`
      : `<span class="badge badge-soon">SOON</span>`;

    tile.innerHTML = `
      <div class="tile-top">
        <div class="tile-icon">${iconInner}</div>
        ${badge}
      </div>
      <div>
        <div class="tile-name">${p.name}</div>
        <p class="tile-tagline">${p.tagline}</p>
      </div>
      ${isLive ? `<span class="tile-open">Open <span class="arrow">→</span></span>` : `<span class="tile-open tile-open-soon">Coming soon</span>`}
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
      <span class="empty-label">RESERVED — NEXT BUILD</span>
    `;
    wrap.appendChild(empty);
  }
}

function setupSearch(){
  const input = document.getElementById("searchInput");
  const noResults = document.getElementById("noResults");

  input.addEventListener("input", () => {
    const term = input.value.trim().toLowerCase();
    const tiles = document.querySelectorAll("#tiles .tile");
    let anyVisible = false;

    tiles.forEach(tile => {
      if (tile.dataset.empty){
        // "reserved" slots ko search ke dauran hide rakho, taake sirf real apps dikhein
        tile.classList.toggle("hidden", term.length > 0);
        return;
      }
      const matches = tile.dataset.name.includes(term);
      tile.classList.toggle("hidden", !matches);
      if (matches) anyVisible = true;
    });

    noResults.hidden = term.length === 0 || anyVisible;
  });
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
setupFeedback();
setupScrollReveal();
setupHeaderScroll();
setupTileSpotlight();
