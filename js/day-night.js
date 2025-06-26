class DayNightManager {
    constructor() {
        this.currentTheme = null;
        this.sunriseTime = null;
        this.sunsetTime = null;
        this.timezone = null;
    }

    /**
     * Determine if it's currently day or night based on sunrise/sunset times
     * @param {number} sunrise - Unix timestamp for sunrise
     * @param {number} sunset - Unix timestamp for sunset
     * @param {number} timezone - Timezone offset in seconds
     * @returns {string} 'day' or 'night'
     */
    getDayNightStatus(sunrise, sunset, timezone = 0) {
        this.sunriseTime = sunrise;
        this.sunsetTime = sunset;
        this.timezone = timezone;

        const now = Math.floor(Date.now() / 1000);
        const localNow = now + timezone;
        const localSunrise = sunrise + timezone;
        const localSunset = sunset + timezone;

        // Consider twilight periods (30 minutes before sunrise and after sunset)
        const twilightDuration = 30 * 60; // 30 minutes in seconds
        const dawn = localSunrise - twilightDuration;
        const dusk = localSunset + twilightDuration;

        if (localNow >= dawn && localNow <= dusk) {
            return localNow <= localSunset ? 'day' : 'twilight';
        } else {
            return 'night';
        }
    }

    /**
     * Get the current phase of the day with time display for afternoon/evening
     * @returns {string} Phase description or current time
     */
    getCurrentPhase() {
        if (!this.sunriseTime || !this.sunsetTime) return '';

        const now = Math.floor(Date.now() / 1000);
        const localNow = now + (this.timezone || 0);
        const localSunrise = this.sunriseTime + (this.timezone || 0);
        const localSunset = this.sunsetTime + (this.timezone || 0);

        const twilightDuration = 30 * 60; // 30 minutes
        const dawn = localSunrise - twilightDuration;
        const dusk = localSunset + twilightDuration;

        if (localNow < dawn) {
            return 'Night';
        } else if (localNow < localSunrise) {
            return 'Dawn';
        } else if (localNow < localSunrise + (2 * 60 * 60)) { // 2 hours after sunrise
            return 'Morning';
        } else if (localNow < localSunset - (2 * 60 * 60)) { // 2 hours before sunset
            // Display current time for afternoon
            return this.formatCurrentTime();
        } else if (localNow < localSunset) {
            // Display current time for evening
            return this.formatCurrentTime();
        } else if (localNow < dusk) {
            return 'Dusk';
        } else {
            return 'Night';
        }
    }

    /**
     * Format current time in AM/PM format
     * @returns {string} Current time in AM/PM format
     */
    formatCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    }

    /**
     * Apply day/night theme to the body element
     * @param {string} status - 'day', 'night', or 'twilight'
     * @param {string} weatherCondition - Current weather condition
     */
    applyTheme(status, weatherCondition = '') {
        const body = document.body;
        
        // Remove existing theme classes
        body.classList.remove('day-theme', 'night-theme', 'twilight-theme');
        
        // Apply new theme
        if (status === 'day') {
            body.classList.add('day-theme');
            this.currentTheme = 'day';
        } else if (status === 'twilight') {
            body.classList.add('night-theme'); // Use night theme for twilight
            this.currentTheme = 'twilight';
        } else {
            body.classList.add('night-theme');
            this.currentTheme = 'night';
        }

        // Apply weather-specific classes
        body.classList.remove('sunny', 'cloudy', 'rainy', 'snowy', 'clear');
        if (weatherCondition) {
            const weatherClass = this.getWeatherClass(weatherCondition);
            if (weatherClass) {
                body.classList.add(weatherClass);
            }
        }

        this.updateDayNightIndicator(status);
    }

    /**
     * Get CSS class for weather condition
     * @param {string} condition - Weather condition
     * @returns {string} CSS class name
     */
    getWeatherClass(condition) {
        const weatherMap = {
            'Clear': 'clear',
            'Clouds': 'cloudy',
            'Rain': 'rainy',
            'Drizzle': 'rainy',
            'Snow': 'snowy',
            'Thunderstorm': 'rainy',
            'Mist': 'cloudy',
            'Haze': 'cloudy',
            'Fog': 'cloudy'
        };
        return weatherMap[condition] || 'clear';
    }

    /**
     * Create or update the day/night indicator
     * @param {string} status - Current day/night status
     */
    updateDayNightIndicator(status) {
        let indicator = document.querySelector('.day-night-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'day-night-indicator';
            
            // Insert into the card header
            const header = document.querySelector('.app-header');
            if (header) {
                header.appendChild(indicator);
            } else {
                // Fallback: insert into card
                const card = document.querySelector('.card');
                if (card) {
                    card.appendChild(indicator);
                }
            }
        }

        // Update content based on status
        const phase = this.getCurrentPhase();
        let icon, text, className;

        if (status === 'day') {
            icon = 'fas fa-sun';
            text = phase || 'Day';
            className = 'day';
        } else if (status === 'twilight') {
            icon = 'fas fa-cloud-sun';
            text = phase || 'Twilight';
            className = 'twilight';
        } else {
            icon = 'fas fa-moon';
            text = phase || 'Night';
            className = 'night';
        }

        indicator.className = `day-night-indicator ${className}`;
        indicator.innerHTML = `
            <i class="${icon}"></i>
            <span>${text}</span>
            <div class="sun-moon-animation ${status === 'day' ? 'sun' : 'moon'}"></div>
        `;
    }

    /**
     * Get time until next day/night transition
     * @returns {Object} Time information
     */
    getTimeToNextTransition() {
        if (!this.sunriseTime || !this.sunsetTime) return null;

        const now = Math.floor(Date.now() / 1000);
        const localNow = now + (this.timezone || 0);
        const localSunrise = this.sunriseTime + (this.timezone || 0);
        const localSunset = this.sunsetTime + (this.timezone || 0);

        let nextTransition, nextType;

        if (localNow < localSunrise) {
            nextTransition = localSunrise;
            nextType = 'sunrise';
        } else if (localNow < localSunset) {
            nextTransition = localSunset;
            nextType = 'sunset';
        } else {
            // Next transition is tomorrow's sunrise
            nextTransition = localSunrise + (24 * 60 * 60);
            nextType = 'sunrise';
        }

        const timeRemaining = nextTransition - localNow;
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);

        return {
            type: nextType,
            hours,
            minutes,
            timestamp: nextTransition
        };
    }

    /**
     * Format time for display
     * @param {number} timestamp - Unix timestamp
     * @returns {string} Formatted time
     */
    formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

// Global instance
const dayNightManager = new DayNightManager();