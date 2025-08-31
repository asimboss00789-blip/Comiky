// ========================
// Variables
// ========================
let mangaList = [];
let currentManga = null;
let currentChapter = null;
let favorites = [];
let page = 1;
const perPage = 20;
const mangaContainer = document.getElementById('manga-container');
const searchInput = document.getElementById('search-input');

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
            <button onclick="toggleFavorite('${manga.id}')">
                ${favorites.includes(manga.id) ? '★' : '☆'}
            </button>
        `;
        div.onclick = () => loadChapters(manga.id);
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
            const chapterList = document.getElementById('chapter-list');
            chapterList.innerHTML = '';
            chapters.forEach(ch => {
                const li = document.createElement('li');
                li.innerText = ch.title;
                li.onclick = () => loadPages(ch.id);
                chapterList.appendChild(li);
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
            const reader = document.getElementById('reader');
            reader.innerHTML = '';
            pages.forEach(pg => {
                const img = document.createElement('img');
                img.src = pg.url;
                reader.appendChild(img);
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

    // Re-render manga list to update star
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
