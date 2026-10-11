export default class UI {
    static renderNigeriaStats(data) {
        const container = document.getElementById('stats-container');
        if (!data) return;

        container.innerHTML = `
            <p><strong>Capital:</strong> ${data.capital}</p>
            <p><strong>Population:</strong> ${data.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${data.region}</p>
            <p><strong>Currency:</strong> ${data.currency}</p>
        `;
        container.classList.remove('loader');
    }

    static renderSpots(spots, favorites, container = document.getElementById('spots-grid')) {
        if (!spots.length) {
            container.innerHTML = '<p style="text-align:center; width:100%;">No spots found matching your search.</p>';
            return;
        }

        container.innerHTML = spots.map(spot => `
            <div class="flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <img src="${spot.image}" alt="${spot.name}" loading="lazy">
                        <div class="card-content">
                            <h3>${spot.name}</h3>
                            <p>${spot.state}</p>
                            <p style="color: var(--accent-color); font-weight: bold; margin-top: 5px;">⭐ ${spot.category.toUpperCase()}</p>
                        </div>
                    </div>
                    <div class="flip-card-back">
                        <h3>${spot.name}</h3>
                        <p style="font-size: 0.9rem; margin-top: 10px;">${spot.shortDesc}</p>
                        <div style="font-size: 0.8rem; margin: 15px 0;">
                            <p id="wiki-${spot.id}" class="loader">Loading info...</p>
                            <p id="weather-${spot.id}" class="loader">Loading weather...</p>
                        </div>
                        <button class="favorite-btn btn ${favorites.includes(spot.id) ? 'active' : ''}" data-id="${spot.id}">
                            ${favorites.includes(spot.id) ? '❤ Remove Fav' : '🤍 Add Fav'}
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    static updateSpotDetails(id, wiki, weather) {
        const wikiEl = document.getElementById(`wiki-${id}`);
        const weatherEl = document.getElementById(`weather-${id}`);

        if (wikiEl) {
            wikiEl.textContent = wiki ? wiki : 'Info unavailable.';
            wikiEl.classList.remove('loader');
        }

        if (weatherEl) {
            let weatherText = 'Weather unavailable.';

            if (weather) {
                if (typeof weather === 'string') {
                    weatherText = weather;
                } else if (typeof weather === 'object') {
                    const temp = weather?.current_weather?.temperature || weather?.current?.temperature_2m || 'N/A';
                    weatherText = `🌡️ Current Temp: ${temp}°C`;
                }
            }

            weatherEl.textContent = weatherText;
            weatherEl.classList.remove('loader');
        }
    }
}