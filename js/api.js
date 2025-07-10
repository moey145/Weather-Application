class WeatherAPI {
    constructor() {
        this.pendingRequests = new Map();
    }

    async getWeatherByCity(city) {
        const validation = Utils.validateCityName(city);
        if (!validation.valid) {
            throw new Error(validation.error);
        }
        const cityName = validation.city;
        const cacheKey = `weather_${cityName.toLowerCase()}`;

        // Check cache first
        const cached = weatherCache.get(cacheKey);
        if (cached) return cached;

        // Prevent duplicate requests
        if (this.pendingRequests.has(cacheKey)) {
            return this.pendingRequests.get(cacheKey);
        }

        const url = `${CONFIG.API.BASE_URL}?type=weather&q=${encodeURIComponent(cityName)}`;
        const promise = this.fetchWithTimeout(url, 10000)
            .then(response => {
                if (response.status === 404) {
                    throw new Error('City not found. Please check the spelling and try again.');
                }
                if (response.status === 401) {
                    throw new Error('API key is invalid. Please contact support.');
                }
                if (response.status === 429) {
                    throw new Error('Too many requests. Please wait a moment and try again.');
                }
                if (!response.ok) {
                    throw new Error(`Weather service error (${response.status}). Please try again later.`);
                }
                return response.json();
            })
            .then(data => {
                weatherCache.set(cacheKey, data);
                return data;
            })
            .finally(() => {
                this.pendingRequests.delete(cacheKey);
            });

        this.pendingRequests.set(cacheKey, promise);
        return promise;
    }

    async getForecast(city) {
        const validation = Utils.validateCityName(city);
        if (!validation.valid) {
            throw new Error(validation.error);
        }
        const cityName = validation.city;
        const cacheKey = `forecast_${cityName.toLowerCase()}`;

        // Check cache first
        const cached = weatherCache.get(cacheKey);
        if (cached) return cached;

        const url = `${CONFIG.API.BASE_URL}?type=forecast&q=${encodeURIComponent(cityName)}`;
        try {
            const response = await this.fetchWithTimeout(url, 10000);
            if (!response.ok) {
                throw new Error(`Forecast service error (${response.status})`);
            }
            const data = await response.json();
            weatherCache.set(cacheKey, data);
            return data;
        } catch (error) {
            console.warn('Failed to fetch forecast:', error.message);
            throw error;
        }
    }

    async getForecastByCoords(lat, lon) {
        const url = `${CONFIG.API.BASE_URL}?type=forecast&lat=${lat}&lon=${lon}`;
        const response = await this.fetchWithTimeout(url, 10000);
        if (!response.ok) {
            throw new Error(`Failed to get forecast for your location (${response.status})`);
        }
        return response.json();
    }

    async getLocationSuggestions(query) {
        if (!query || query.length < 2) {
            return [];
        }
        const url = `${CONFIG.API.BASE_URL}?type=geo&q=${encodeURIComponent(query.trim())}`;
        try {
            const response = await this.fetchWithTimeout(url, 5000);
            if (!response.ok) {
                console.warn('Suggestions API error:', response.status);
                return [];
            }
            return await response.json();
        } catch (error) {
            console.warn('Failed to fetch suggestions:', error.message);
            return [];
        }
    }

    async getWeatherByCoords(lat, lon) {
        const url = `${CONFIG.API.BASE_URL}?type=weather&lat=${lat}&lon=${lon}`;
        const response = await this.fetchWithTimeout(url, 10000);
        if (!response.ok) {
            throw new Error(`Failed to get weather for your location (${response.status})`);
        }
        return response.json();
    }

    fetchWithTimeout(url, timeout = 10000) {
        return Promise.race([
            fetch(url),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout. Please check your internet connection.')), timeout)
            )
        ]);
    }

    async getHourlyForecast(city) {
        try {
            const validation = Utils.validateCityName(city);
            if (!validation.valid) {
                throw new Error(validation.error);
            }
            const cityName = validation.city;
            const cacheKey = `hourly_${cityName.toLowerCase()}`;

            const cached = weatherCache.get(cacheKey);
            if (cached) return cached;

            const url = `${CONFIG.API.BASE_URL}?type=forecast&q=${encodeURIComponent(cityName)}`;
            const response = await this.fetchWithTimeout(url, 10000);
            if (!response.ok) {
                throw new Error(this.getErrorMessage(response.status));
            }
            const data = await response.json();
            weatherCache.set(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Hourly forecast API error:', error);
            throw error;
        }
    }

    async getHourlyForecastByCoords(lat, lon) {
        try {
            const cacheKey = `hourly_coords_${lat}_${lon}`;
            const cached = weatherCache.get(cacheKey);
            if (cached) return cached;

            const url = `${CONFIG.API.BASE_URL}?type=forecast&lat=${lat}&lon=${lon}`;
            const response = await this.fetchWithTimeout(url, 10000);
            if (!response.ok) {
                throw new Error(this.getErrorMessage(response.status));
            }
            const data = await response.json();
            weatherCache.set(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Hourly forecast API error:', error);
            throw error;
        }
    }

getErrorMessage(status) {
    switch (status) {
        case 404: return 'City not found. Please check the spelling and try again.';
        case 401: return 'API key is invalid. Please contact support.';
        case 429: return 'Too many requests. Please wait a moment and try again.';
        default: return `Weather service error (${status}). Please try again later.`;
    }
}
}

