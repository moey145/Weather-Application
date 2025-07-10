class SuggestionsManager {
    constructor(uiManager, weatherAPI) {
        this.uiManager = uiManager;
        this.weatherAPI = weatherAPI;
        this.container = document.querySelector('.suggestions');
        this.isVisible = false;
        this.currentIndex = -1;
        this.searchHistory = this.getSearchHistory();
        this.popularCities = this.getPopularCities();
        this.abortController = null;
        
        this.debouncedGetSuggestions = Utils.debounce(
            this.getSuggestions.bind(this), 
            200 // Reduced debounce for faster response
        );
    }

    async getSuggestions(query) {
        // Cancel previous request if still pending
        if (this.abortController) {
            this.abortController.abort();
        }

        if (!query || query.length < 1) {
            this.hide();
            return;
        }

        if (query.length < 2) {
            this.showFilteredSuggestions(query);
            return;
        }

        try {
            // Create new abort controller for this request
            this.abortController = new AbortController();
            
            // Show loading state for longer queries
            if (query.length > 3) {
                this.showLoadingState();
            }

            const locations = await this.weatherAPI.getLocationSuggestions(query, {
                signal: this.abortController.signal
            });

            if (locations && locations.length > 0) {
                // Sort by relevance and add local suggestions
                const sortedLocations = this.sortLocationsByRelevance(locations, query);
                this.display(sortedLocations, query);
            } else {
                this.showNoResults(query);
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.warn('Error fetching suggestions:', error);
                this.showErrorState();
            }
        }
    }

    showFilteredSuggestions(query) {
        const filtered = [];
        
        // Filter recent searches
        const recentMatches = this.searchHistory.filter(city => 
            city.toLowerCase().startsWith(query.toLowerCase())
        );
        
        // Filter popular cities
        const popularMatches = this.popularCities.filter(city => 
            city.name.toLowerCase().startsWith(query.toLowerCase())
        );

        if (recentMatches.length > 0) {
            filtered.push({ type: 'header', text: 'Recent Searches' });
            recentMatches.slice(0, 3).forEach(city => {
                filtered.push({
                    type: 'recent',
                    name: city,
                    country: '',
                    displayName: city,
                    icon: 'fas fa-history'
                });
            });
        }

        if (popularMatches.length > 0) {
            filtered.push({ type: 'header', text: 'Popular Cities' });
            popularMatches.slice(0, 3).forEach(city => {
                filtered.push({
                    type: 'popular',
                    name: city.name,
                    country: city.country,
                    displayName: `${city.name}, ${city.country}`,
                    icon: 'fas fa-star'
                });
            });
        }

        if (filtered.length > 0) {
            this.displayMixed(filtered);
        } else {
            this.hide();
        }
    }

    sortLocationsByRelevance(locations, query) {
        const queryLower = query.toLowerCase();
        
        return locations.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            
            // Exact match first
            if (aName === queryLower) return -1;
            if (bName === queryLower) return 1;
            
            // Starts with query
            if (aName.startsWith(queryLower) && !bName.startsWith(queryLower)) return -1;
            if (bName.startsWith(queryLower) && !aName.startsWith(queryLower)) return 1;
            
            // Recent searches priority
            if (this.searchHistory.includes(a.name) && !this.searchHistory.includes(b.name)) return -1;
            if (this.searchHistory.includes(b.name) && !this.searchHistory.includes(a.name)) return 1;
            
            // Popular cities priority
            const aPopular = this.popularCities.some(city => city.name === a.name);
            const bPopular = this.popularCities.some(city => city.name === b.name);
            if (aPopular && !bPopular) return -1;
            if (bPopular && !aPopular) return 1;
            
            // Alphabetical order
            return aName.localeCompare(bName);
        });
    }

    display(locations, query = '') {
        if (!this.container) return;

        let suggestionsList = this.container.querySelector('.suggestions-list');
        if (!suggestionsList) {
            suggestionsList = document.createElement('div');
            suggestionsList.classList.add('suggestions-list');
            this.container.appendChild(suggestionsList);
        }

        suggestionsList.innerHTML = '';

        locations.forEach((location, index) => {
            const suggestionItem = this.createSuggestionItem(location, query, index);
            suggestionsList.appendChild(suggestionItem);
        });

        this.container.style.display = 'block';
        this.isVisible = true;
        this.currentIndex = -1;
    }

    displayMixed(items) {
        if (!this.container) return;

        let suggestionsList = this.container.querySelector('.suggestions-list');
        if (!suggestionsList) {
            suggestionsList = document.createElement('div');
            suggestionsList.classList.add('suggestions-list');
            this.container.appendChild(suggestionsList);
        }

        suggestionsList.innerHTML = '';

        items.forEach((item, index) => {
            if (item.type === 'header') {
                const header = document.createElement('div');
                header.classList.add('suggestions-header');
                header.textContent = item.text;
                suggestionsList.appendChild(header);
            } else {
                const suggestionItem = this.createMixedSuggestionItem(item, index);
                suggestionsList.appendChild(suggestionItem);
            }
        });

        this.container.style.display = 'block';
        this.isVisible = true;
        this.currentIndex = -1;
    }

    createSuggestionItem(location, query = '', index = 0) {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.setAttribute('role', 'option');
        suggestionItem.setAttribute('tabindex', '0');
        suggestionItem.setAttribute('data-index', index);
        
        const locationName = this.formatLocationName(location);
        
        // Create suggestion content with highlighting
        const content = document.createElement('div');
        content.classList.add('suggestion-content');
        
        const nameElement = document.createElement('span');
        nameElement.classList.add('suggestion-name');
        nameElement.innerHTML = this.highlightMatch(locationName, query);
        
        const detailsElement = document.createElement('span');
        detailsElement.classList.add('suggestion-details');
        detailsElement.textContent = `${location.country}`;
        
        content.appendChild(nameElement);
        content.appendChild(detailsElement);
        suggestionItem.appendChild(content);

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

    createMixedSuggestionItem(item, index) {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item', `suggestion-${item.type}`);
        suggestionItem.setAttribute('role', 'option');
        suggestionItem.setAttribute('tabindex', '0');
        suggestionItem.setAttribute('data-index', index);
        
        const content = document.createElement('div');
        content.classList.add('suggestion-content');
        
        const icon = document.createElement('i');
        icon.className = item.icon;
        
        const nameElement = document.createElement('span');
        nameElement.classList.add('suggestion-name');
        nameElement.textContent = item.displayName;
        
        content.appendChild(icon);
        content.appendChild(nameElement);
        suggestionItem.appendChild(content);

        // Add click handler
        suggestionItem.addEventListener('click', () => {
            this.selectSuggestion(item.name);
        });

        // Add keyboard navigation
        suggestionItem.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.selectSuggestion(item.name);
            }
        });

        return suggestionItem;
    }

    highlightMatch(text, query) {
        if (!query || query.length < 2) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    showLoadingState() {
        if (!this.container) return;

        let suggestionsList = this.container.querySelector('.suggestions-list');
        if (!suggestionsList) {
            suggestionsList = document.createElement('div');
            suggestionsList.classList.add('suggestions-list');
            this.container.appendChild(suggestionsList);
        }

        suggestionsList.innerHTML = `
            <div class="suggestions-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Searching...</span>
            </div>
        `;

        this.container.style.display = 'block';
        this.isVisible = true;
    }

    showNoResults(query) {
        if (!this.container) return;

        let suggestionsList = this.container.querySelector('.suggestions-list');
        if (!suggestionsList) {
            suggestionsList = document.createElement('div');
            suggestionsList.classList.add('suggestions-list');
            this.container.appendChild(suggestionsList);
        }

        suggestionsList.innerHTML = `
            <div class="suggestions-no-results">
                <i class="fas fa-search"></i>
                <span>No results found for "${query}"</span>
            </div>
        `;

        this.container.style.display = 'block';
        this.isVisible = true;
    }

    showErrorState() {
        if (!this.container) return;

        let suggestionsList = this.container.querySelector('.suggestions-list');
        if (!suggestionsList) {
            suggestionsList = document.createElement('div');
            suggestionsList.classList.add('suggestions-list');
            this.container.appendChild(suggestionsList);
        }

        suggestionsList.innerHTML = `
            <div class="suggestions-error">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Error loading suggestions</span>
            </div>
        `;

        this.container.style.display = 'block';
        this.isVisible = true;
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
        // Add to search history
        this.addToSearchHistory(cityName);
        
        if (this.uiManager.elements.searchInput) {
            this.uiManager.elements.searchInput.value = cityName;
        }
        this.hide();
        
        // Trigger weather search
        if (window.weatherApp) {
            window.weatherApp.searchWeather(cityName);
        }
    }

    addToSearchHistory(cityName) {
        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(city => city !== cityName);
        
        // Add to beginning
        this.searchHistory.unshift(cityName);
        
        // Keep only last 10 searches
        this.searchHistory = this.searchHistory.slice(0, 10);
        
        // Save to localStorage
        localStorage.setItem('weatherSearchHistory', JSON.stringify(this.searchHistory));
    }

    getSearchHistory() {
        try {
            const history = localStorage.getItem('weatherSearchHistory');
            return history ? JSON.parse(history) : [];
        } catch (error) {
            return [];
        }
    }

    getPopularCities() {
        return [
            { name: 'London', country: 'UK' },
            { name: 'New York', country: 'USA' },
            { name: 'Tokyo', country: 'Japan' },
            { name: 'Paris', country: 'France' },
            { name: 'Sydney', country: 'Australia' },
            { name: 'Dubai', country: 'UAE' },
            { name: 'Singapore', country: 'Singapore' },
            { name: 'Los Angeles', country: 'USA' },
            { name: 'Toronto', country: 'Canada' },
            { name: 'Berlin', country: 'Germany' }
        ];
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
        this.currentIndex = -1;
        
        // Cancel any pending requests
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }

    handleInput(query) {
        this.debouncedGetSuggestions(query.trim());
    }

    handleKeyNavigation(e) {
        if (!this.isVisible) return;

        const suggestions = this.container.querySelectorAll('.suggestion-item:not(.suggestions-header)');
        if (suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.currentIndex = (this.currentIndex + 1) % suggestions.length;
                this.highlightSuggestion(suggestions);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.currentIndex = this.currentIndex <= 0 ? suggestions.length - 1 : this.currentIndex - 1;
                this.highlightSuggestion(suggestions);
                break;
            case 'Enter':
                e.preventDefault();
                if (this.currentIndex >= 0 && suggestions[this.currentIndex]) {
                    suggestions[this.currentIndex].click();
                }
                break;
            case 'Escape':
                this.hide();
                this.uiManager.focusInput();
                break;
        }
    }

    highlightSuggestion(suggestions) {
        // Remove previous highlights
        suggestions.forEach(item => item.classList.remove('highlighted'));
        
        // Add highlight to current item
        if (this.currentIndex >= 0 && suggestions[this.currentIndex]) {
            suggestions[this.currentIndex].classList.add('highlighted');
            suggestions[this.currentIndex].scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }
    }

    clearSearchHistory() {
        this.searchHistory = [];
        localStorage.removeItem('weatherSearchHistory');
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

function clearSearchHistory() {
    if (window.weatherApp && window.weatherApp.suggestionsManager) {
        window.weatherApp.suggestionsManager.clearSearchHistory();
    }
}