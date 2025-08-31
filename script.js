// ========================
// Detect current page
// ========================
const path = window.location.pathname;
const isIndex = path.includes("index.html") || path === "/" || path === "";
const isMangaPage = path.includes("manga.html");

// ========================
// Common variables
// ========================
let mangaList = [];
let currentManga = null;
let currentChapter = null;
let favorites = [];
let page = 1;
const perPage = 20;

// ========================
// Element selectors
// ========================
const searchInput = document.querySelector(".input");

// index.html elements
const mangaContainer = document.querySelector("#mangaList") || document.querySelector(".manga-list");
const popularSlider = document.querySelector(".popular-slider");

// manga.html elements
const mangaTitleEl = document.querySelector("#manga-title");
const chapterListEl = document.querySelector("#chapter-list");
const readerContainer = document.querySelector("#reader-container");

// ========================
// Helper functions
// ========================

// Fetch manga list
async function fetchManga(reset = false) {
  if (!isIndex) return;
  if (reset) {
    mangaContainer.innerHTML = "";
    page = 1;
  }
  try {
    const res = await fetch(`/backend/api_manga.php?page=${page}&per_page=${perPage}`);
    const data = await res.json();
    mangaList = mangaList.concat(data);
    renderManga(data);
    page++;
  } catch (err) {
    console.error(err);
  }
}

// Render manga cards on index
function renderManga(list) {
  if (!mangaContainer) return;
  list.forEach((manga) => {
    const div = document.createElement("div");
    div.className = "manga-item";
    div.dataset.title = manga.title;
    div.dataset.genre = manga.genre || "";
    div.innerHTML = `
      <img src="${manga.cover}" alt="${manga.title}">
      <div class="manga-info">
        <div class="manga-title">${manga.title}</div>
        <div class="chapter-list"></div>
        <button class="fav-btn">${favorites.includes(manga.id) ? "★" : "☆"}</button>
      </div>
    `;
    div.querySelector(".fav-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(manga.id);
    });
    div.addEventListener("click", () => {
      // Go to manga page
      window.location.href = `manga.html?manga_id=${manga.id}`;
    });
    mangaContainer.appendChild(div);
  });
}

// Toggle favorite
function toggleFavorite(mangaId) {
  const index = favorites.indexOf(mangaId);
  if (index > -1) favorites.splice(index, 1);
  else favorites.push(mangaId);

  fetch("/backend/api_favorites.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ favorites }),
  });

  if (isIndex) {
    mangaContainer.innerHTML = "";
    renderManga(mangaList);
  }
}

// Search filter
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = mangaList.filter((m) => m.title.toLowerCase().includes(query));
    if (isIndex) {
      mangaContainer.innerHTML = "";
      renderManga(filtered);
    }
  });
}

// Infinite scroll for index.html
if (isIndex) {
  window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
      fetchManga();
    }
  });
}

// ========================
// Manga page functions
// ========================

// Get query parameter
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Load manga details on manga.html
async function loadMangaPage() {
  if (!isMangaPage) return;
  const mangaId = getQueryParam("manga_id");
  if (!mangaId) return;
  currentManga = mangaId;

  try {
    // Load manga info (optional: if api_manga.php returns details)
    const mangaRes = await fetch(`/backend/api_manga.php?id=${mangaId}`);
    const mangaData = await mangaRes.json();
    if (mangaTitleEl) mangaTitleEl.textContent = mangaData.title;

    // Load chapters
    const chaptersRes = await fetch(`/backend/api_chapters.php?manga_id=${mangaId}`);
    const chapters = await chaptersRes.json();
    if (chapterListEl) {
      chapterListEl.innerHTML = "";
      chapters.forEach((ch) => {
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = ch.title;
        a.addEventListener("click", (e) => {
          e.preventDefault();
          loadPages(ch.id);
        });
        chapterListEl.appendChild(a);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

// Load pages into reader
async function loadPages(chapterId) {
  currentChapter = chapterId;
  try {
    const res = await fetch(`/backend/api_pages.php?chapter_id=${chapterId}`);
    const pages = await res.json();
    if (readerContainer) {
      readerContainer.innerHTML = "";
      pages.forEach((pg) => {
        const img = document.createElement("img");
        img.src = pg.url;
        img.alt = "Page";
        readerContainer.appendChild(img);
      });
      // Scroll to top
      window.scrollTo(0, readerContainer.offsetTop);
    }
  } catch (err) {
    console.error(err);
  }
}

// ========================
// Initialize
// ========================
document.addEventListener("DOMContentLoaded", () => {
  if (isIndex) fetchManga();
  if (isMangaPage) loadMangaPage();
});
