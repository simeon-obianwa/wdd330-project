import Storage from './storage.js';
import API from './api.js';
import UI from './ui.js';

class App {
    constructor() {
        this.spotsData = [];
        this.init();
    }

    async init() {
        this.handleUserGreeting();
        this.setLastModified();

        const countryData = await API.fetchNigeriaStats();
        UI.renderNigeriaStats(countryData);

        this.spotsData = await API.fetchSpotsData();
        this.renderFilteredSpots();
        this.setupEventListeners();
    }

    setLastModified() {
        const lastModElement = document.getElementById('last-modified');
        if (lastModElement) {
            lastModElement.textContent = `Last Modified: ${document.lastModified}`;
        }
    }

    handleUserGreeting() {
        const userName = Storage.getUser();
        const visits = Storage.incrementVisits();

        if (userName) {
            document.getElementById('greeting-text').textContent = `Welcome back, ${userName}!`;
            document.getElementById('user-form').style.display = 'none';
        }
        document.getElementById('visit-counter').textContent = `You have visited ${visits} times.`;
    }

    renderFilteredSpots(filter = 'all', searchQuery = '') {
        const filtered = this.spotsData.filter(spot => {
            const matchesCategory = filter === 'all' || spot.category === filter;
            const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        UI.renderSpots(filtered, Storage.getFavorites());
        this.fetchDynamicCardDetails(filtered);
    }

    async fetchDynamicCardDetails(spots) {
        for (const spot of spots) {
            const [wiki, weather] = await Promise.all([
                API.fetchWikiSummary(spot.wikiTitle),
                API.fetchWeather(spot.coordinates.lat, spot.coordinates.lng)
            ]);
            UI.updateSpotDetails(spot.id, wiki, weather);
        }
    }

    setupEventListeners() {
        document.getElementById('user-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('username').value;
            Storage.setUser(name);
            this.handleUserGreeting();
        });

        document.getElementById('category-filter').addEventListener('change', (e) => {
            const searchVal = document.getElementById('search-input').value;
            this.renderFilteredSpots(e.target.value, searchVal);
        });

        document.getElementById('search-input').addEventListener('input', (e) => {
            const categoryVal = document.getElementById('category-filter').value;
            this.renderFilteredSpots(categoryVal, e.target.value);
        });

        document.getElementById('spots-grid').addEventListener('click', (e) => {
            if (e.target.classList.contains('favorite-btn')) {
                const id = e.target.getAttribute('data-id');
                const favorites = Storage.toggleFavorite(id);

                const isFav = favorites.includes(id);
                e.target.textContent = isFav ? '❤ Remove Fav' : '🤍 Add Fav';
                e.target.classList.toggle('active', isFav);
            }
        });

        document.getElementById('spots-grid').addEventListener('mouseenter', (e) => {
            if (e.target.classList.contains('flip-card')) {
                console.log(`User is looking at a card.`);
            }
        }, true);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});