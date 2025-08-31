// ====================== FULL script.js ======================

const mangaContainer = document.getElementById('manga-container');
const chapterContainer = document.getElementById('chapter-container');
const readerContainer = document.getElementById('reader-container');
const favoritesContainer = document.getElementById('favorites-container');
const searchInput = document.getElementById('search-input');
const backButton = document.getElementById('back-to-chapters');
const toggleFavBtn = document.getElementById('toggle-favorites');

let currentMangaId = null;
let currentChapterId = null;
let currentPage = 1;
const perPage = 20;
let loadingManga = false;

// ---------- FETCH MANGA ----------
async function fetchManga(page = 1){
    if(loadingManga) return;
    loadingManga = true;

    try {
        const res = await fetch(`/backend/api_manga.php?page=${page}&per_page=${perPage}`);
        if(!res.ok) throw new Error('Failed to fetch manga');
        const data = await res.json();
        if(data.data && data.data.length > 0){
            displayManga(data.data, page > 1);
        }
    } catch(err){
        alert(err.message);
    }

    loadingManga = false;
}

// ---------- DISPLAY MANGA ----------
function displayManga(mangaList, append = false){
    if(!append) mangaContainer.innerHTML = '';
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
async function viewChapters(mangaId){
    currentMangaId = mangaId;
    chapterContainer.style.display = 'grid';
    readerContainer.innerHTML = '';
    backButton.style.display = 'none';

    try {
        const res = await fetch(`/backend/api_chapters.php?manga_id=${mangaId}`);
        if(!res.ok) throw new Error('Failed to fetch chapters');
        const data = await res.json();
        displayChapters(data.chapters);
    } catch(err){
        alert(err.message);
    }
}

// ---------- DISPLAY CHAPTERS ----------
function displayChapters(chapters){
    chapterContainer.innerHTML = '';
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
async function viewPages(chapterId){
    currentChapterId = chapterId;
    backButton.style.display = 'block';
    chapterContainer.style.display = 'none';
    readerContainer.innerHTML = '';

    try {
        const res = await fetch(`/backend/api_pages.php?chapter_id=${chapterId}`);
        if(!res.ok) throw new Error('Failed to fetch pages');
        const data = await res.json();
        displayPages(data.pages);
    } catch(err){
        alert(err.message);
    }
}

// ---------- DISPLAY PAGES ----------
function displayPages(pages){
    readerContainer.innerHTML = '';
    pages.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.className = 'page-image';
        readerContainer.appendChild(img);
    });
}

// ---------- BACK BUTTON ----------
backButton.addEventListener('click', () => {
    readerContainer.innerHTML = '';
    backButton.style.display = 'none';
    chapterContainer.style.display = 'grid';
});

// ---------- FAVORITES ----------
function toggleFavorite(mangaId){
    let favs = JSON.parse(localStorage.getItem('favorites')) || [];
    let message = '';

    if(favs.includes(mangaId)){
        favs = favs.filter(id => id !== mangaId);
        message = 'Removed from favorites';
    } else {
        favs.push(mangaId);
        message = 'Added to favorites';
    }

    localStorage.setItem('favorites', JSON.stringify(favs));
    displayFavorites();
    alert(message);
}

function displayFavorites(){
    favoritesContainer.innerHTML = '';
    const favs = JSON.parse(localStorage.getItem('favorites')) || [];
    favs.forEach(id => {
        const div = document.createElement('div');
        div.className = 'chapter-card';
        div.innerHTML = `<span>Manga ID: ${id}</span>
            <button onclick="viewChapters('${id}')">View Chapters</button>`;
        favoritesContainer.appendChild(div);
    });
}

// ---------- FAVORITES PANEL TOGGLE ----------
toggleFavBtn.addEventListener('click', () => {
    if(favoritesContainer.style.display === 'grid'){
        favoritesContainer.style.display = 'none';
    } else {
        favoritesContainer.style.display = 'grid';
        displayFavorites();
    }
});

// ---------- SEARCH ----------
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll('.manga-card');
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = title.includes(query) ? 'block' : 'none';
    });
});

// ---------- INFINITE SCROLL ----------
window.addEventListener('scroll', () => {
    if((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50){
        currentPage++;
        fetchManga(currentPage);
    }
});

// ---------- INITIALIZE ----------
fetchManga();
displayFavorites();

// ====================== END OF SCRIPT ======================
