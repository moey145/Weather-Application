const CONFIG = {
    API: {
        BASE_URL: "/api/weather", // Now points to your serverless function
        GEO_URL: "/api/geo",      // If you create a geo proxy, otherwise remove
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