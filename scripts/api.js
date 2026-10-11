export default class API {
    static async fetchNigeriaStats() {
        try {
            const response = await fetch('https://restcountries.com/v3.1/name/nigeria');
            if (!response.ok) throw new Error('Failed to fetch country stats');
            const [data] = await response.json();

            const currencyKeys = Object.keys(data.currencies || {});
            let currencyDisplay = 'Unknown';

            if (currencyKeys.length > 0) {
                const currencyObj = data.currencies[currencyKeys[0]];
                currencyDisplay = `${currencyObj.name} (${currencyObj.symbol})`;
            }

            return {
                capital: data.capital ? data.capital[0] : 'Abuja',
                population: data.population,
                region: data.region,
                currency: currencyDisplay
            };
        } catch (error) {
            console.error("Error fetching Nigeria stats:", error);
            return {
                capital: 'Abuja',
                population: 206139587,
                region: 'Africa',
                currency: 'Nigerian naira (₦)'
            };
        }
    }

    static async fetchSpotsData() {
        try {
            const response = await fetch('./data/spots.json');
            if (!response.ok) throw new Error('Failed to fetch local spots data');
            return await response.json();
        } catch (error) {
            console.error("Error fetching spots:", error);
            return [];
        }
    }

    static async fetchWikiSummary(wikiTitle) {
        if (!wikiTitle) return 'No information available.';
        try {
            const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exchars=150&explaintext=1&format=json&origin=*&titles=${encodeURIComponent(wikiTitle)}`);
            const data = await response.json();
            const pages = data.query.pages;
            const pageId = Object.keys(pages)[0];

            return pages[pageId].extract ? pages[pageId].extract + '...' : 'No summary available.';
        } catch (error) {
            console.error(`Wikipedia API Error for ${wikiTitle}:`, error);
            return 'Summary currently unavailable.';
        }
    }

    static async fetchWeather(lat, lng) {
        if (!lat || !lng) return null;
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
            if (!response.ok) throw new Error('Weather fetch failed');
            return await response.json();
        } catch (error) {
            console.error(`Weather API Error at coordinates [${lat}, ${lng}]:`, error);
            return null;
        }
    }
}