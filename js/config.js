const CONFIG = {
    API: {
        KEY: __VITE_OPENWEATHER_API_KEY__ || "73539ff657dc00543d6c7d09024d8f65",
        BASE_URL: "https://api.openweathermap.org/data/2.5",
        GEO_URL: "https://api.openweathermap.org/geo/1.0",
        UNITS: "metric",
        LANGUAGE: "en"
    },
    CACHE: {
        DURATION: 10 * 60 * 1000, // 10 minutes
        MAX_SIZE: 50
    },
    UI: {
        DEBOUNCE_DELAY: 300,
        MAX_SUGGESTIONS: 5,
        ANIMATION_DURATION: 300
    }
};