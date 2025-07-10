const CONFIG = {
    API: {
        BASE_URL: "/api/weather",  // All calls now go through your Vercel Function
        UNITS: "metric",
        LANGUAGE: "en"
    },
    CACHE: {
        DURATION: 10 * 60 * 1000,  // 10 minutes
        MAX_SIZE: 50
    },
    UI: {
        DEBOUNCE_DELAY: 300,
        MAX_SUGGESTIONS: 5,
        ANIMATION_DURATION: 300
    }
};