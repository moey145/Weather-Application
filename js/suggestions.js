class SuggestionsManager {
    constructor(uiManager, weatherAPI) {
        this.uiManager = uiManager;
        this.weatherAPI = weatherAPI;
        this.container = document.querySelector('.suggestions');
        this.isVisible = false;
        
        this.debouncedGetSuggestions = Utils.debounce(
            this.getSuggestions.bind(this), 
            300
        );
    }

    async getSuggestions(query) {
        if (!query || query.length < 2) {
            this.hide();
            return;
        }

        try {
            const locations = await this.weatherAPI.getLocationSuggestions(query);
            if (locations.length > 0) {
                this.display(locations);
            } else {
                this.hide();
            }
        } catch (error) {
            console.warn('Error fetching suggestions:', error);
            this.hide();
        }
    }

    display(locations) {
        if (!this.container) return;

        // Create or get suggestions list
        let suggestionsList = this.container.querySelector('.suggestions-list');
        if (!suggestionsList) {
            suggestionsList = document.createElement('div');
            suggestionsList.classList.add('suggestions-list');
            this.container.appendChild(suggestionsList);
        }

        suggestionsList.innerHTML = '';

        locations.forEach((location) => {
            const suggestionItem = this.createSuggestionItem(location);
            suggestionsList.appendChild(suggestionItem);
        });

        this.container.style.display = 'block';
        this.isVisible = true;
    }

    createSuggestionItem(location) {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.setAttribute('role', 'option');
        suggestionItem.setAttribute('tabindex', '0');
        
        const locationName = this.formatLocationName(location);
        suggestionItem.textContent = locationName;
        suggestionItem.title = locationName;

        // Add click handler
        suggestionItem.addEventListener('click', () => {
            this.selectSuggestion(location.name);
        });

        // Add keyboard navigation
        suggestionItem.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.selectSuggestion(location.name);
            }
        });

        return suggestionItem;
    }

    formatLocationName(location) {
        let name = location.name;
        if (location.state) {
            name += `, ${location.state}`;
        }
        name += `, ${location.country}`;
        return name;
    }

    selectSuggestion(cityName) {
        if (this.uiManager.elements.searchInput) {
            this.uiManager.elements.searchInput.value = cityName;
        }
        this.hide();
        
        // Trigger weather search
        if (window.weatherApp) {
            window.weatherApp.searchWeather(cityName);
        }
    }

    hide() {
        if (this.container) {
            this.container.style.display = 'none';
            const suggestionsList = this.container.querySelector('.suggestions-list');
            if (suggestionsList) {
                suggestionsList.innerHTML = '';
            }
        }
        this.isVisible = false;
    }

    handleInput(query) {
        this.debouncedGetSuggestions(query.trim());
    }

    handleKeyNavigation(e) {
        if (!this.isVisible) return;

        const suggestions = this.container.querySelectorAll('.suggestion-item');
        if (suggestions.length === 0) return;

        let currentIndex = Array.from(suggestions).findIndex(item => 
            item === document.activeElement
        );

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentIndex = (currentIndex + 1) % suggestions.length;
                suggestions[currentIndex].focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                currentIndex = currentIndex <= 0 ? suggestions.length - 1 : currentIndex - 1;
                suggestions[currentIndex].focus();
                break;
            case 'Escape':
                this.hide();
                this.uiManager.focusInput();
                break;
        }
    }
}

// Legacy functions for backward compatibility
async function getLocationSuggestions(query) {
    if (window.weatherApp && window.weatherApp.suggestionsManager) {
        await window.weatherApp.suggestionsManager.getSuggestions(query);
    }
}

function hideSuggestions() {
    if (window.weatherApp && window.weatherApp.suggestionsManager) {
        window.weatherApp.suggestionsManager.hide();
    }
}