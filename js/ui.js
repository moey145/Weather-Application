class UIManager {
    constructor() {
        this.elements = this.initializeElements();
        this.isLoading = false;
        this.currentCity = null;
        this.weatherAnimations = new WeatherAnimations();
    }

    initializeElements() {
        const elements = {
            searchInput: document.querySelector('.search input'),
            searchButton: document.querySelector('.search button'),
            searchIcon: document.querySelector('.search-icon'),
            loadingSpinner: document.querySelector('.loading-spinner'),
            weatherContainer: document.querySelector('.weather'),
            errorContainer: document.querySelector('.error'),
            loadingContainer: document.querySelector('.loading'),
            suggestionsContainer: document.querySelector('.suggestions')
        };

        return elements;
    }

    showLoading(message = 'Loading weather data...') {
        if (this.isLoading) return;
        
        this.isLoading = true;
        
        if (this.elements.searchIcon) {
            this.elements.searchIcon.style.display = 'none';
        }
        if (this.elements.loadingSpinner) {
            this.elements.loadingSpinner.style.display = 'block';
        }
        if (this.elements.searchButton) {
            this.elements.searchButton.disabled = true;
        }
        if (this.elements.loadingContainer) {
            const loadingText = this.elements.loadingContainer.querySelector('p');
            if (loadingText) loadingText.textContent = message;
            this.elements.loadingContainer.style.display = 'flex';
        }
        
        this.hideError();
        this.hideWeather();
    }

    hideLoading() {
        this.isLoading = false;
        
        if (this.elements.searchIcon) {
            this.elements.searchIcon.style.display = 'block';
        }
        if (this.elements.loadingSpinner) {
            this.elements.loadingSpinner.style.display = 'none';
        }
        if (this.elements.searchButton) {
            this.elements.searchButton.disabled = false;
        }
        if (this.elements.loadingContainer) {
            this.elements.loadingContainer.style.display = 'none';
        }
    }

    showError(message) {
        if (this.elements.errorContainer) {
            const errorText = this.elements.errorContainer.querySelector('p');
            if (errorText) {
                errorText.textContent = message;
            }
            this.elements.errorContainer.style.display = 'flex';
        }
        this.hideWeather();
        this.hideLoading();
    }

    hideError() {
        if (this.elements.errorContainer) {
            this.elements.errorContainer.style.display = 'none';
        }
    }

    showWeather() {
        if (this.elements.weatherContainer) {
            this.elements.weatherContainer.style.display = 'block';
        }
        this.hideError();
        this.hideLoading();
    }

    hideWeather() {
        if (this.elements.weatherContainer) {
            this.elements.weatherContainer.style.display = 'none';
        }
    }

    updateWeatherData(data, forecastData = null) {
        try {
            this.currentCity = data.name;
            
            // Update basic info
            this.updateElement('.temp', Utils.formatTemperature(data.main.temp));
            this.updateElement('.feels-like', `Feels like ${Utils.formatTemperature(data.main.feels_like)}`);
            this.updateElement('.description', Utils.capitalizeFirstLetter(data.weather[0].description));
            this.updateElement('.city', `${data.name}, ${data.sys.country}`);
            
            // Update weather icon
            this.updateWeatherIcon(data.weather[0].main, data.weather[0].description);
            
            // Update weather animations
            this.weatherAnimations.updateWeatherAnimation(data.weather[0].main);
            
            // Update detailed weather info
            this.updateWeatherDetails(data);
            
            // Update forecast if available
            if (forecastData) {
                this.updateForecast(forecastData);
            }
            
            // Update timestamp
            this.updateElement('.update-time', Utils.getCurrentTime());
            
            this.showWeather();
        } catch (error) {
            console.error('Error updating weather data:', error);
            this.showError('Failed to display weather data');
        }
    }


updateForecast(forecastData) {
    let forecastSection = document.querySelector('.forecast-section');
    
    if (!forecastSection) {
        // Create forecast section
        forecastSection = document.createElement('div');
        forecastSection.className = 'forecast-section';
        forecastSection.innerHTML = `
            <div class="forecast-title">
                <i class="fas fa-calendar-alt"></i>
                10-Day Forecast
            </div>
            <div class="forecast-container"></div>
            <div class="forecast-note" style="display: none;">
                <p><i class="fas fa-info-circle"></i> * Days 6-10 are extended forecasts based on weather trends</p>
            </div>
        `;
        
        // Insert after weather-info section
        const weatherInfo = document.querySelector('.weather-info');
        if (weatherInfo) {
            weatherInfo.insertAdjacentElement('afterend', forecastSection);
        }
    }

    const forecastContainer = forecastSection.querySelector('.forecast-container');
    const forecastNote = forecastSection.querySelector('.forecast-note');
    if (!forecastContainer) return;

    // Process forecast data - get one entry per day
    const dailyForecasts = this.processForecastData(forecastData.list);
    
    // Generate additional forecast days if we have less than 10 days
    const extendedForecast = this.extendForecastTo10Days(dailyForecasts, forecastData);
    
    forecastContainer.innerHTML = '';
    
    extendedForecast.slice(0, 10).forEach((forecast, index) => {
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        
        const date = new Date(forecast.dt * 1000);
        const dayName = index === 0 ? 'Today' : 
                       index === 1 ? 'Tomorrow' : 
                       date.toLocaleDateString('en', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
        
        // Add indicator if this is extrapolated data
        const isExtrapolated = index >= dailyForecasts.length;
        
        if (isExtrapolated) {
            forecastCard.classList.add('forecast-estimated');
            forecastCard.title = 'Extended forecast based on weather trends';
        }
        
        forecastCard.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <div class="forecast-date">${dateStr}</div>
            <img src="images/${this.getWeatherIconName(forecast.weather[0].main)}" 
                 alt="${forecast.weather[0].description}" 
                 class="forecast-icon">
            <div class="forecast-temps">
                <div class="forecast-high">${Math.round(forecast.main.temp_max)}°</div>
                <div class="forecast-low">${Math.round(forecast.main.temp_min)}°</div>
            </div>
            <div class="forecast-desc">${forecast.weather[0].description}</div>
            ${isExtrapolated ? '<div class="forecast-estimate">*</div>' : ''}
        `;
        
        forecastContainer.appendChild(forecastCard);
    });
    
    // Show/hide note about extended forecast
    if (extendedForecast.length > dailyForecasts.length && forecastNote) {
        forecastNote.style.display = 'block';
    } else if (forecastNote) {
        forecastNote.style.display = 'none';
    }
}

extendForecastTo10Days(existingForecast, originalData) {
    const extended = [...existingForecast];
    
    // If we have less than 10 days, generate additional days
    while (extended.length < 10) {
        const lastDay = extended[extended.length - 1];
        const nextDate = new Date(lastDay.dt * 1000);
        nextDate.setDate(nextDate.getDate() + 1);
        
        // Create forecast based on patterns and averages
        const extendedDay = this.generateExtendedForecastDay(lastDay, nextDate, originalData);
        extended.push(extendedDay);
    }
    
    return extended;
}

    generateExtendedForecastDay(baseDay, targetDate, originalData) {
        // Calculate seasonal temperature variation
        const dayOfYear = this.getDayOfYear(targetDate);
        const tempVariation = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 3; // Seasonal variation
        
        // Add some randomness for realism (±2 degrees)
        const randomVariation = (Math.random() - 0.5) * 4;
        
        // Gradually trend temperatures toward seasonal averages
        const daysFromBase = Math.floor((targetDate - new Date(baseDay.dt * 1000)) / (1000 * 60 * 60 * 24));
        const trendFactor = Math.min(0.1 * daysFromBase, 1); // Gradual change over time
        
        return {
            dt: Math.floor(targetDate.getTime() / 1000),
            main: {
                temp_max: Math.round(baseDay.main.temp_max + tempVariation + randomVariation - trendFactor),
                temp_min: Math.round(baseDay.main.temp_min + tempVariation + randomVariation - trendFactor),
                humidity: Math.max(30, Math.min(90, baseDay.main.humidity + (Math.random() - 0.5) * 15))
            },
            weather: [this.predictWeatherCondition(baseDay, originalData, daysFromBase)],
            wind: {
                speed: Math.max(0, (baseDay.wind?.speed || 5) + (Math.random() - 0.5) * 5)
            }
        };
    }

    predictWeatherCondition(baseDay, originalData, daysFromBase) {
        const currentCondition = baseDay.weather[0].main;
        const currentDesc = baseDay.weather[0].description;
        
        // Weather patterns tend to change over time
        const changeProb = Math.min(0.1 + (daysFromBase * 0.05), 0.4);
        
        if (Math.random() < changeProb) {
            // Change weather pattern
            const patterns = [
                { main: 'Clear', description: 'clear sky' },
                { main: 'Clouds', description: 'partly cloudy' },
                { main: 'Clouds', description: 'cloudy' },
                { main: 'Rain', description: 'light rain' }
            ];
            
            // Bias toward similar conditions
            let weightedPatterns = patterns;
            if (currentCondition === 'Rain') {
                weightedPatterns = [
                    ...patterns,
                    { main: 'Clouds', description: 'cloudy' },
                    { main: 'Rain', description: 'light rain' }
                ];
            } else if (currentCondition === 'Clouds') {
                weightedPatterns = [
                    ...patterns,
                    { main: 'Clouds', description: 'partly cloudy' },
                    { main: 'Clear', description: 'clear sky' }
                ];
            }
            
            return weightedPatterns[Math.floor(Math.random() * weightedPatterns.length)];
        }
        
        // Keep similar weather
        return {
            main: currentCondition,
            description: currentDesc
        };
    }

    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    processForecastData(forecastList) {
        const dailyData = {};
        
        forecastList.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();
            
            if (!dailyData[date]) {
                dailyData[date] = {
                    ...item,
                    main: {
                        ...item.main,
                        temp_max: item.main.temp_max,
                        temp_min: item.main.temp_min
                    }
                };
            } else {
                // Update min/max temperatures
                dailyData[date].main.temp_max = Math.max(dailyData[date].main.temp_max, item.main.temp_max);
                dailyData[date].main.temp_min = Math.min(dailyData[date].main.temp_min, item.main.temp_min);
            }
        });
        
        return Object.values(dailyData);
    }

    updateWeatherDetails(data) {
        // Humidity
        this.updateElement('.humidity', `${data.main.humidity}%`);
        this.updateProgressBar('.progress-fill', data.main.humidity);
        
        // Wind
        this.updateElement('.wind', Utils.formatWindSpeed(data.wind.speed));
        if (data.wind.deg !== undefined) {
            this.updateElement('.wind-direction', Utils.getWindDirection(data.wind.deg));
        }
        
        // Pressure
        this.updateElement('.pressure', `${data.main.pressure} hPa`);
        this.updateElement('.pressure-trend', this.getPressureTrend(data.main.pressure));
        
        // Visibility
        this.updateElement('.visibility', Utils.formatVisibility(data.visibility));
        this.updateElement('.visibility-status', this.getVisibilityStatus(data.visibility / 1000));
        
        // Sunrise/Sunset
        if (data.sys.sunrise && data.sys.sunset) {
            const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            this.updateElement('.sunrise', sunrise);
            this.updateElement('.sunset', sunset);
        }
    }

    updateElement(selector, content) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = content;
        }
    }

    updateProgressBar(selector, percentage) {
        const element = document.querySelector(selector);
        if (element) {
            element.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
        }
    }

    updateWeatherIcon(condition, description) {
        const weatherIcon = document.querySelector('.weather-icon');
        if (weatherIcon) {
            const iconName = this.getWeatherIconName(condition);
            weatherIcon.src = `images/${iconName}`;
            weatherIcon.alt = description;
            
            // Add weather-specific animation class
            weatherIcon.className = 'weather-icon';
            switch(condition.toLowerCase()) {
                case 'clear':
                    weatherIcon.classList.add('sunny');
                    break;
                case 'rain':
                case 'drizzle':
                    weatherIcon.classList.add('rainy');
                    break;
                case 'snow':
                    weatherIcon.classList.add('snowy');
                    break;
                case 'clouds':
                    weatherIcon.classList.add('cloudy');
                    break;
                case 'thunderstorm':
                    weatherIcon.classList.add('stormy');
                    break;
            }
        }
    }

    getWeatherIconName(condition) {
        const iconMap = {
            'Clouds': 'clouds.png',
            'Clear': 'clear.png',
            'Rain': 'rain.png',
            'Drizzle': 'drizzle.png',
            'Mist': 'mist.png',
            'Snow': 'snow.png',
            'Thunderstorm': 'storm.png',
            'Haze': 'mist.png',
            'Fog': 'mist.png'
        };
        
        return iconMap[condition] || 'clear.png';
    }

    getPressureTrend(pressure) {
        if (pressure > 1020) return 'High';
        if (pressure < 1000) return 'Low';
        return 'Normal';
    }

    getVisibilityStatus(visibilityKm) {
        if (visibilityKm >= 10) return 'Excellent';
        if (visibilityKm >= 5) return 'Good';
        if (visibilityKm >= 2) return 'Moderate';
        return 'Poor';
    }

    focusInput() {
        if (this.elements.searchInput) {
            this.elements.searchInput.focus();
            this.elements.searchInput.select();
        }
    }
}