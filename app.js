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
    icon: "assets/lk-icon.png",   // is app ka apna logo — isliye initials ki zaroorat nahi
    initials: "LA",               // fallback agar icon load na ho
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
const EMPTY_SLOTS = 3;

function renderTiles(){
  const wrap = document.getElementById("tiles");
  wrap.innerHTML = "";

  PROJECTS.forEach(p => {
    const tile = document.createElement(p.status === "live" ? "a" : "div");
    tile.className = "tile live";
    if (p.status === "live") {
      tile.href = p.url;
      tile.target = "_blank";
      tile.rel = "noopener noreferrer";
    }

    const iconInner = p.icon
      ? `<img src="${p.icon}" alt="${p.name} logo">`
      : p.initials;

    tile.innerHTML = `
      <div class="tile-top">
        <div class="tile-icon">${iconInner}</div>
        <span class="badge"><span class="dot"></span>LIVE</span>
      </div>
      <div>
        <div class="tile-name">${p.name}</div>
        <p class="tile-tagline">${p.tagline}</p>
      </div>
      <span class="tile-open">Open <span class="arrow">→</span></span>
    `;
    wrap.appendChild(tile);
  });

  for (let i = 0; i < EMPTY_SLOTS; i++){
    const empty = document.createElement("div");
    empty.className = "tile empty";
    empty.innerHTML = `
      <div class="tile-icon">?</div>
      <span class="empty-label">RESERVED — NEXT BUILD</span>
    `;
    wrap.appendChild(empty);
  }
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

document.getElementById("year").textContent = new Date().getFullYear();

renderTiles();
renderHeroGrid();
