// ========================
// Variables
// ========================
let mangaList = [];
let currentManga = null;
let currentChapter = null;
let favorites = [];
let page = 1;
const perPage = 20;

// Detect containers from your existing HTML
const mangaContainer = document.querySelector('.manga-grid') || document.createElement('div');
const chapterContainer = document.querySelector('.chapter-list') || document.createElement('ul');
const readerContainer = document.querySelector('.reader') || document.createElement('div');
const searchInput = document.querySelector('input[type="search"]') || document.createElement('input');

// Append containers if not present
if (!document.body.contains(mangaContainer)) document.body.appendChild(mangaContainer);
if (!document.body.contains(chapterContainer)) document.body.appendChild(chapterContainer);
if (!document.body.contains(readerContainer)) document.body.appendChild(readerContainer);
if (!document.body.contains(searchInput)) document.body.insertBefore(searchInput, document.body.firstChild);

// ========================
// Fetch Manga List
// ========================
function fetchManga(reset = false) {
    if (reset) {
        mangaContainer.innerHTML = '';
        page = 1;
    }

    fetch(`/backend/api_manga.php?page=${page}&per_page=${perPage}`)
        .then(res => res.json())
        .then(data => {
            mangaList = mangaList.concat(data);
            renderManga(data);
            page++;
        })
        .catch(err => console.error(err));
}

// ========================
// Render Manga
// ========================
function renderManga(list) {
    list.forEach(manga => {
        const div = document.createElement('div');
        div.className = 'manga-card';
        div.innerHTML = `
            <img src="${manga.cover}" alt="${manga.title}">
            <h3>${manga.title}</h3>
            <button class="fav-btn">${favorites.includes(manga.id) ? '★' : '☆'}</button>
        `;
        div.querySelector('.fav-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(manga.id);
        });
        div.addEventListener('click', () => loadChapters(manga.id));
        mangaContainer.appendChild(div);
    });
}

// ========================
// Load Chapters
// ========================
function loadChapters(mangaId) {
    currentManga = mangaId;
    fetch(`/backend/api_chapters.php?manga_id=${mangaId}`)
        .then(res => res.json())
        .then(chapters => {
            chapterContainer.innerHTML = '';
            chapters.forEach(ch => {
                const li = document.createElement('li');
                li.innerText = ch.title;
                li.addEventListener('click', () => loadPages(ch.id));
                chapterContainer.appendChild(li);
            });
        });
}

// ========================
// Load Pages
// ========================
function loadPages(chapterId) {
    currentChapter = chapterId;
    fetch(`/backend/api_pages.php?chapter_id=${chapterId}`)
        .then(res => res.json())
        .then(pages => {
            readerContainer.innerHTML = '';
            pages.forEach(pg => {
                const img = document.createElement('img');
                img.src = pg.url;
                readerContainer.appendChild(img);
            });
        });
}

// ========================
// Toggle Favorite
// ========================
function toggleFavorite(mangaId) {
    const index = favorites.indexOf(mangaId);
    if (index > -1) favorites.splice(index, 1);
    else favorites.push(mangaId);

    fetch(`/backend/api_favorites.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorites })
    });

    // Refresh manga cards
    mangaContainer.innerHTML = '';
    renderManga(mangaList);
}

// ========================
// Search
// ========================
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = mangaList.filter(m => m.title.toLowerCase().includes(query));
    mangaContainer.innerHTML = '';
    renderManga(filtered);
});

// ========================
// Infinite Scroll
// ========================
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
        fetchManga();
    }
});

// ========================
// Initial Load
// ========================
document.addEventListener('DOMContentLoaded', () => {
    fetchManga();
});
