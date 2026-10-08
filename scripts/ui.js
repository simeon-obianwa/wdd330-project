import Storage from './storage.js';

export default class UI {
    static renderNigeriaStats(data) {
        const container = document.getElementById('stats-container');
        if (!data) {
            container.innerHTML = "<p>Data unavailable.</p>";
            return;
        }
        container.innerHTML = `
            <p><strong>Capital:</strong> ${data.capital[0]}</p>
            <p><strong>Population:</strong> ${data.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${data.region}</p>
            <p><strong>Currency:</strong> ${Object.values(data.currencies)[0].name}</p>
        `;
    }

    static renderSpots(spots, favorites) {
        const grid = document.getElementById('spots-grid');
        grid.innerHTML = '';

        spots.forEach(spot => {
            const isFav = favorites.includes(spot.id);
            const card = document.createElement('div');
            card.classList.add('flip-card', 'fade-in');

            card.innerHTML = `
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <img src="${spot.image}" alt="${spot.name}">
                        <div class="card-content">
                            <h3>${spot.name}</h3>
                            <p>${spot.state}</p>
                            <span style="color:var(--accent-color)">⭐ ${spot.category.toUpperCase()}</span>
                        </div>
                    </div>
                    <div class="flip-card-back">
                        <h3>${spot.name}</h3>
                        <p class="wiki-desc" id="wiki-${spot.id}">Loading detail...</p>
                        <p class="weather-info" id="weather-${spot.id}">Loading weather...</p>
                        <button class="btn favorite-btn ${isFav ? 'active' : ''}" data-id="${spot.id}">
                            ${isFav ? '❤️ Remove Fav' : '🤍 Add Fav'}
                        </button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    static updateSpotDetails(id, wikiDesc, weather) {
        const wikiEl = document.getElementById(`wiki-${id}`);
        const weatherEl = document.getElementById(`weather-${id}`);

        if (wikiEl) wikiEl.textContent = wikiDesc.substring(0, 100) + '...';
        if (weatherEl) {
            weatherEl.innerHTML = weather
                ? `Current Temp: ${weather.temperature}°C`
                : "Weather unavailable";
        }
    }
}