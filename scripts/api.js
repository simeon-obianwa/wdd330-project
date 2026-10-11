export default class API {
    static async fetchNigeriaStats() {
        try {
            const res = await fetch('https://restcountries.com/v3.1/name/nigeria');
            if (!res.ok) throw new Error("Failed to fetch country data");
            const data = await res.json();
            return data[0];
        } catch (error) {
            console.warn("API fetch blocked. Loading fallback data to maintain UI.");
            return {
                capital: ["Abuja"],
                population: 206139587,
                region: "Africa",
                currencies: { NGN: { name: "Nigerian naira" } }
            };
        }
    }

    static async fetchWikiSummary(title) {
        try {
            const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`);
            if (!res.ok) throw new Error("Wiki fetch failed");
            const data = await res.json();
            return data.extract;
        } catch (error) {
            return "Description unavailable at this time.";
        }
    }

    static async fetchWeather(lat, lng) {
        try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
            if (!res.ok) throw new Error("Weather fetch failed");
            const data = await res.json();
            return data.current_weather;
        } catch (error) {
            return null;
        }
    }

    static async fetchSpotsData() {
        try {
            const res = await fetch('./data/spots.json');
            if (!res.ok) throw new Error("Failed to fetch local JSON");
            return await res.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}