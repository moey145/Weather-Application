const CONFIG = {
    API: {
        KEY: import.meta.env.VITE_OPENWEATHER_API_KEY,
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