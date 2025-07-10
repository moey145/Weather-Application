const CONFIG = {
    API: {
        KEY: process.env.NEXT_PUBLIC_API_KEY, // Use an environment variable
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