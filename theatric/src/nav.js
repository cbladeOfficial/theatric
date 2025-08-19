let lastFocusedSidebarId = "homebtn"; // Default sidebar button
let lastFocusedContentIds = {}; // { homepage: "btnid", moviespage: "btnid", ... }
let lastFocusedId = null;

// Utility to get content page id from sidebar button id
function getCurrentPageId(btnId) {
  if (!btnId) return "homepage";
  if (btnId.endsWith("btn")) return btnId.replace("btn", "page");
  return "homepage";
}

// Navigation handler
document.addEventListener("keydown", (e) => {
  const current = document.activeElement;
  if (!current.matches("[data-nav]")) return;

  const navItems = Array.from(document.querySelectorAll("[data-nav]"));
  const currentRect = current.getBoundingClientRect();
  const currentPage = current.closest(".page")?.id;

  let bestMatch = null;
  let bestScore = Infinity;

  // Prevent jumping to sidebar if on top of content
  if (e.key === "ArrowUp" && !current.closest("#sidebar")) {
    const contentButtons = Array.from(
      current.closest(".page").querySelectorAll("[data-nav]")
    );
    const topMost = contentButtons.reduce((topBtn, btn) => {
      const btnRect = btn.getBoundingClientRect();
      if (!topBtn) return btn;
      return btnRect.top < topBtn.getBoundingClientRect().top ? btn : topBtn;
    }, null);

    if (topMost && current === topMost) {
      e.preventDefault();
      return;
    }
  }

  for (const item of navItems) {
    if (item === current) continue;
    const rect = item.getBoundingClientRect();

    let isCandidate = false;
    const dx = rect.left - currentRect.left;
    const dy = rect.top - currentRect.top;

    switch (e.key) {
      case "ArrowLeft":
        if (!current.closest("#sidebar")) {
          const sidebarBtn = document.getElementById(lastFocusedSidebarId);
          if (sidebarBtn) {
            sidebarBtn.focus();
            e.preventDefault();
          }
          return;
        }
        break;
      case "ArrowRight":
        if (current.closest("#sidebar")) {
          const currentPageId = getCurrentPageId(current.id);
          const lastBtnId = lastFocusedContentIds[currentPageId];
          const fallbackBtn = document.querySelector(
            `#${currentPageId} [data-nav]`
          );
          const targetBtn = document.getElementById(lastBtnId) || fallbackBtn;
          if (targetBtn) {
            targetBtn.focus();
            e.preventDefault();
          }
          return;
        }
        break;
      case "ArrowUp":
        isCandidate = rect.bottom <= currentRect.top;
        break;
      case "ArrowDown":
        isCandidate = rect.top >= currentRect.bottom;
        break;
    }

    if (isCandidate) {
      const dist = dx * dx + dy * dy;
      if (dist < bestScore) {
        bestScore = dist;
        bestMatch = item;
      }
    }
  }

  if (bestMatch) {
    bestMatch.focus();
    bestMatch.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
    e.preventDefault();
  }

  if (e.key === "Enter") {
    new Audio("/assets/sounds/click.mp3").play();
  }
});

// Focus tracker
document.addEventListener("focusin", (e) => {
  const el = e.target;
  if (!el.matches("[data-nav]")) return;
  if (el.id === lastFocusedId) return;

  lastFocusedId = el.id;
  el.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "nearest",
  });

  const pageEl = el.closest(".page");
  if (pageEl) {
    lastFocusedContentIds[pageEl.id] = el.id;
  }

  if (el.closest("#sidebar")) {
    lastFocusedSidebarId = el.id;
  }

  // Page switching logic (can be extended)
  switch (el.id) {
    case "homebtn":
      showPage("homepage");
      break;
    case "moviesbtn":
      showPage("moviespage");
      break;
    case "videosbtn":
      showPage("videospage");
      break;
    case "musicbtn":
      showPage("musicpage");
      break;
    case "imagesbtn":
      showPage("imagespage");
      break;
    case "weatherbtn":
      showPage("weatherpage");
      break;
    case "rssbtn":
      showPage("rsspage");
      break;
    case "appsbtn":
      showPage("appspage");
      break;
    case "pluginsbtn":
      showPage("pluginspage");
      break;
    case "settingsbtn":
      showPage("settingspage");
      break;
    default:
      showPage("homepage");
  }
});

// Utility to show page and hide others
function showPage(id) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((p) => (p.style.display = "none"));

  const target = document.getElementById(id);
  if (target) target.style.display = "block";
}

// --- Map sidebar button ID to page ID ---
function getCurrentPageId(btnId) {
  const map = {
    homebtn: "homepage",
    moviesbtn: "moviespage",
    videosbtn: "videospage",
    musicbtn: "musicpage",
    imagesbtn: "imagespage",
    weatherbtn: "weatherpage",
    rssbtn: "rsspage",
    appsbtn: "appspage",
    pluginsbtn: "pluginspage",
    settingsbtn: "settingspage",
  };
  return map[btnId] || "homepage";
}
