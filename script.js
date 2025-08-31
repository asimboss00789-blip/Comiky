// script.js

const mangaContainer = document.getElementById('manga-container');
const chapterContainer = document.getElementById('chapter-container');
const readerContainer = document.getElementById('reader-container');
const favoritesContainer = document.getElementById('favorites-container');
const searchInput = document.getElementById('search-input');

let currentMangaId = null;
let currentChapterId = null;

// ---------- FETCH MANGA LIST ----------
async function fetchManga(page = 1, perPage = 20) {
    const res = await fetch(`/backend/api_manga.php?page=${page}&per_page=${perPage}`);
    const data = await res.json();
    displayManga(data.data);
}

// ---------- DISPLAY MANGA ----------
function displayManga(mangaList) {
    mangaContainer.innerHTML = '';
    mangaList.forEach(manga => {
        const div = document.createElement('div');
        div.className = 'manga-card';
        div.innerHTML = `
            <img src="${manga.cover}" alt="${manga.title}">
            <h3>${manga.title}</h3>
            <button onclick="viewChapters('${manga.id}')">View Chapters</button>
            <button onclick="toggleFavorite('${manga.id}')">❤</button>
        `;
        mangaContainer.appendChild(div);
    });
}

// ---------- FETCH CHAPTERS ----------
async function viewChapters(mangaId) {
    currentMangaId = mangaId;
    const res = await fetch(`/backend/api_chapters.php?manga_id=${mangaId}`);
    const data = await res.json();
    displayChapters(data.chapters);
}

// ---------- DISPLAY CHAPTERS ----------
function displayChapters(chapters) {
    chapterContainer.innerHTML = '';
    readerContainer.innerHTML = '';
    chapters.forEach(chap => {
        const div = document.createElement('div');
        div.className = 'chapter-card';
        div.innerHTML = `
            <span>${chap.title}</span>
            <button onclick="viewPages('${chap.id}')">Read</button>
        `;
        chapterContainer.appendChild(div);
    });
}

// ---------- FETCH PAGES ----------
async function viewPages(chapterId) {
    currentChapterId = chapterId;
    const res = await fetch(`/backend/api_pages.php?chapter_id=${chapterId}`);
    const data = await res.json();
    displayPages(data.pages);
}

// ---------- DISPLAY PAGES ----------
function displayPages(pages) {
    readerContainer.innerHTML = '';
    pages.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.className = 'page-image';
        readerContainer.appendChild(img);
    });
}

// ---------- FAVORITES ----------
function toggleFavorite(mangaId) {
    let favs = JSON.parse(localStorage.getItem('favorites')) || [];
    if(favs.includes(mangaId)){
        favs = favs.filter(id => id !== mangaId);
    } else {
        favs.push(mangaId);
    }
    localStorage.setItem('favorites', JSON.stringify(favs));
    displayFavorites();
}

function displayFavorites() {
    favoritesContainer.innerHTML = '';
    const favs = JSON.parse(localStorage.getItem('favorites')) || [];
    favs.forEach(id => {
        const div = document.createElement('div');
        div.innerHTML = `<span>Manga ID: ${id}</span>
        <button onclick="viewChapters('${id}')">View Chapters</button>`;
        favoritesContainer.appendChild(div);
    });
}

// ---------- SEARCH ----------
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll('.manga-card');
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = title.includes(query) ? 'block' : 'none';
    });
});

// ---------- INITIALIZE ----------
fetchManga();
displayFavorites();
