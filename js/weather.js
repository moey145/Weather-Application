class WeatherApp {
    constructor() {
        this.uiManager = new UIManager();
        this.weatherAPI = new WeatherAPI();
        this.suggestionsManager = new SuggestionsManager(this.uiManager, this.weatherAPI);
        this.currentLocation = null;
        
        this.initializeEventListeners();
        
        // Make available globally for suggestions
        window.weatherApp = this;
    }

    initializeEventListeners() {
        const { searchInput, searchButton } = this.uiManager.elements;
        
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                if (searchInput) {
                    this.searchWeather(searchInput.value);
                }
            });
        }

        if (searchInput) {
            // Enter key support
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchWeather(searchInput.value);
                }
            });

            // Input suggestions
            searchInput.addEventListener('input', (e) => {
                this.suggestionsManager.handleInput(e.target.value);
            });

            // Keyboard navigation for suggestions
            searchInput.addEventListener('keydown', (e) => {
                this.suggestionsManager.handleKeyNavigation(e);
            });

            // Focus events
            searchInput.addEventListener('focus', () => {
                searchInput.select();
            });
        }

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search')) {
                this.suggestionsManager.hide();
            }
        });
    }


async searchWeather(city) {
    if (!city || !city.trim()) {
        this.uiManager.showError('Please enter a city name');
        return;
    }

    this.suggestionsManager.hide();
    this.uiManager.showLoading('Fetching weather data...');

    try {
        // Get current weather, daily forecast, and hourly forecast
        const [weatherData, forecastData, hourlyData] = await Promise.all([
            this.weatherAPI.getWeatherByCity(city),
            this.weatherAPI.getForecast(city).catch(err => {
                console.warn('Daily forecast fetch failed:', err);
                return null;
            }),
            this.weatherAPI.getHourlyForecast(city).catch(err => {
                console.warn('Hourly forecast fetch failed:', err);
                return null;
            })
        ]);
        
        this.currentLocation = { type: 'city', value: city };
        this.uiManager.updateWeatherData(weatherData, forecastData, hourlyData);
    } catch (error) {
        console.error('Weather search error:', error);
        this.uiManager.showError(error.message);
    }
}

  // Replace the existing refreshWeather method with this:

async refreshWeather() {
    if (!this.currentLocation) {
        this.uiManager.showError('No location to refresh');
        return;
    }

    this.uiManager.showLoading('Refreshing weather data...');

    try {
        let weatherData, forecastData, hourlyData;
        
        if (this.currentLocation.type === 'city') {
            // Clear cache for this city to force fresh data
            weatherCache.clear();
            [weatherData, forecastData, hourlyData] = await Promise.all([
                this.weatherAPI.getWeatherByCity(this.currentLocation.value),
                this.weatherAPI.getForecast(this.currentLocation.value).catch(() => null),
                this.weatherAPI.getHourlyForecast(this.currentLocation.value).catch(() => null)
            ]);
        } else if (this.currentLocation.type === 'coords') {
            [weatherData, forecastData, hourlyData] = await Promise.all([
                this.weatherAPI.getWeatherByCoords(
                    this.currentLocation.value.lat, 
                    this.currentLocation.value.lon
                ),
                this.weatherAPI.getForecastByCoords(
                    this.currentLocation.value.lat, 
                    this.currentLocation.value.lon
                ).catch(() => null),
                this.weatherAPI.getHourlyForecastByCoords(
                    this.currentLocation.value.lat, 
                    this.currentLocation.value.lon
                ).catch(() => null)
            ]);
        }
        
        this.uiManager.updateWeatherData(weatherData, forecastData, hourlyData);
    } catch (error) {
        console.error('Weather refresh error:', error);
        this.uiManager.showError(error.message);
    }
}

async getUserLocation() {
    if (!navigator.geolocation) {
        this.uiManager.showError('Geolocation is not supported by your browser');
        return;
    }

    this.uiManager.showLoading('Getting your location...');

    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
    };

    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });

        const { latitude, longitude } = position.coords;
        this.currentLocation = { type: 'coords', value: { lat: latitude, lon: longitude } };
        
        // Get current weather, daily forecast, and hourly forecast
        const [weatherData, forecastData, hourlyData] = await Promise.all([
            this.weatherAPI.getWeatherByCoords(latitude, longitude),
            this.weatherAPI.getForecastByCoords(latitude, longitude).catch(() => null),
            this.weatherAPI.getHourlyForecastByCoords(latitude, longitude).catch(() => null)
        ]);
        
        this.uiManager.updateWeatherData(weatherData, forecastData, hourlyData);
        
        // Update search input with city name
        if (this.uiManager.elements.searchInput && weatherData.name) {
            this.uiManager.elements.searchInput.value = weatherData.name;
        }
    } catch (error) {
        console.error('Geolocation error:', error);
        let errorMessage = 'Failed to get your location';
        
        if (error.code === 1) {
            errorMessage = 'Location access denied. Please enable location services.';
        } else if (error.code === 2) {
            errorMessage = 'Location unavailable. Please try again.';
        } else if (error.code === 3) {
            errorMessage = 'Location request timed out. Please try again.';
        }
        
        this.uiManager.showError(errorMessage);
    }
}

}

// Global functions for backward compatibility and HTML onclick handlers
function refreshWeather() {
    if (window.weatherApp) {
        window.weatherApp.refreshWeather();
    }
}

function getUserLocation() {
    if (window.weatherApp) {
        window.weatherApp.getUserLocation();
    }
}

// Legacy function for backward compatibility (if needed)
async function checkWeather(city) {
    if (window.weatherApp) {
        await window.weatherApp.searchWeather(city);
    }
}

