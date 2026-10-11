import Storage from './storage.js';
import API from './api.js';
import UI from './ui.js';

class App {
    constructor() {
        this.spotsData = [];
        this.currentView = 'home';
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
        }
        const visitCounter = document.getElementById('visit-counter');
        if (visitCounter) {
            visitCounter.textContent = `You have visited ${visits} times.`;
        }
    }

    renderFilteredSpots(filter = 'all', searchQuery = '') {
        const mainGrid = document.getElementById('spots-grid');
        mainGrid.innerHTML = '';

        let filtered = this.spotsData;

        if (this.currentView === 'favourites') {
            const favs = Storage.getFavorites();
            filtered = filtered.filter(spot => favs.includes(spot.id));
        }

        filtered = filtered.filter(spot => {
            const matchesCategory = filter === 'all' || spot.category === filter;
            const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        const isHomeCategorized = this.currentView === 'home' && filter === 'all' && searchQuery.trim() === '';

        if (!isHomeCategorized) {
            mainGrid.classList.add('grid-container');
            UI.renderSpots(filtered, Storage.getFavorites(), mainGrid);
            this.fetchDynamicCardDetails(filtered);
        } else {
            mainGrid.classList.remove('grid-container');

            const categories = ['landmark', 'nature', 'wildlife', 'hotel', 'recreation', 'service'];
            let displayedSpots = [];

            categories.forEach(cat => {
                const catSpots = filtered.filter(s => s.category === cat).slice(0, 3);

                if (catSpots.length > 0) {
                    displayedSpots = [...displayedSpots, ...catSpots];

                    const section = document.createElement('div');
                    section.className = 'category-section';
                    section.innerHTML = `
                        <div class="category-header">
                            <h3>${cat}s</h3>
                            <button class="btn search-more-btn" data-category="${cat}">
                                See More <span>&rarr;</span>
                            </button>
                        </div>
                        <div class="grid-container" id="grid-${cat}"></div>
                    `;
                    mainGrid.appendChild(section);

                    UI.renderSpots(catSpots, Storage.getFavorites(), document.getElementById(`grid-${cat}`));
                }
            });
            this.fetchDynamicCardDetails(displayedSpots);
        }
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

    updateNavUI(activeId) {
        document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
        document.getElementById(activeId).classList.add('active');

        const isContact = this.currentView === 'contact';
        document.getElementById('welcome-section').style.display = isContact ? 'none' : 'block';
        document.getElementById('country-stats').style.display = isContact ? 'none' : 'block';
        document.getElementById('spots-grid').style.display = isContact ? 'none' : '';
        document.getElementById('contact-section').style.display = isContact ? 'block' : 'none';
    }

    resetFiltersAndRender() {
        document.getElementById('search-input').value = '';
        document.getElementById('category-filter').value = 'all';
        if (this.currentView !== 'contact') {
            this.renderFilteredSpots('all', '');
        }
    }

    setupEventListeners() {
        document.getElementById('nav-home').addEventListener('click', (e) => {
            e.preventDefault();
            this.currentView = 'home';
            this.updateNavUI('nav-home');
            this.resetFiltersAndRender();
        });

        document.getElementById('nav-explore').addEventListener('click', (e) => {
            e.preventDefault();
            this.currentView = 'explore';
            this.updateNavUI('nav-explore');
            this.resetFiltersAndRender();
        });

        document.getElementById('nav-favourites').addEventListener('click', (e) => {
            e.preventDefault();
            this.currentView = 'favourites';
            this.updateNavUI('nav-favourites');
            this.resetFiltersAndRender();
        });

        document.getElementById('nav-contact').addEventListener('click', (e) => {
            e.preventDefault();
            this.currentView = 'contact';
            this.updateNavUI('nav-contact');
        });

        document.getElementById('contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const form = document.getElementById('contact-form');
            const successMsg = document.getElementById('contact-success');

            form.style.display = 'none';
            successMsg.style.display = 'block';

            setTimeout(() => {
                form.reset();
                form.style.display = 'flex';
                successMsg.style.display = 'none';
            }, 3000);
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

            const seeMoreBtn = e.target.closest('.search-more-btn');
            if (seeMoreBtn) {
                const cat = seeMoreBtn.getAttribute('data-category');

                this.currentView = 'explore';
                this.updateNavUI('nav-explore');

                const filterSelect = document.getElementById('category-filter');
                filterSelect.value = cat;
                document.getElementById('search-input').value = '';

                document.querySelector('.controls').scrollIntoView({ behavior: 'smooth' });
                this.renderFilteredSpots(cat, '');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});