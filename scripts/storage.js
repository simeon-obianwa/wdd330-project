export default class Storage {
    static getTheme() {
        return localStorage.getItem('nt_theme') || 'light';
    }

    static setTheme(theme) {
        localStorage.setItem('nt_theme', theme);
    }

    static getUser() {
        return localStorage.getItem('nt_username');
    }

    static setUser(name) {
        localStorage.setItem('nt_username', name);
    }

    static incrementVisits() {
        let visits = parseInt(localStorage.getItem('nt_visits') || '0');
        visits += 1;
        localStorage.setItem('nt_visits', visits);
        return visits;
    }

    static getFavorites() {
        return JSON.parse(localStorage.getItem('nt_favorites') || '[]');
    }

    static toggleFavorite(id) {
        let favs = this.getFavorites();
        if (favs.includes(id)) {
            favs = favs.filter(favId => favId !== id);
        } else {
            favs.push(id);
        }
        localStorage.setItem('nt_favorites', JSON.stringify(favs));
        return favs;
    }
}