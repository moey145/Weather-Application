class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static formatTemperature(temp) {
        return `${Math.round(temp)}°C`;
    }

    static formatWindSpeed(speed) {
        return `${Math.round(speed * 3.6)} km/h`; // Convert m/s to km/h
    }

    static formatVisibility(visibility) {
        return `${Math.round(visibility / 1000)} km`;
    }

    static capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    static getWindDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        return directions[Math.round(degrees / 22.5) % 16];
    }

    static getCurrentTime() {
        return new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    static validateCityName(city) {
        if (!city || typeof city !== 'string') {
            return { valid: false, error: 'City name is required' };
        }
        
        const trimmed = city.trim();
        if (trimmed.length < 2) {
            return { valid: false, error: 'City name must be at least 2 characters' };
        }
        
        if (trimmed.length > 50) {
            return { valid: false, error: 'City name is too long' };
        }
        
        return { valid: true, city: trimmed };
    }
}

// Simple cache implementation
class WeatherCache {
    constructor() {
        this.cache = new Map();
        this.maxSize = 50;
        this.duration = 10 * 60 * 1000; // 10 minutes
    }

    get(key) {
        const item = this.cache.get(key.toLowerCase());
        if (!item) return null;
        
        if (Date.now() - item.timestamp > this.duration) {
            this.cache.delete(key.toLowerCase());
            return null;
        }
        
        return item.data;
    }

    set(key, data) {
        // Clean old entries if cache is full
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        
        this.cache.set(key.toLowerCase(), {
            data,
            timestamp: Date.now()
        });
    }

    clear() {
        this.cache.clear();
    }
}

// Global instances
const weatherCache = new WeatherCache();