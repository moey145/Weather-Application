class SuggestionsManager {
    constructor(uiManager, weatherAPI) {
        this.uiManager = uiManager;
        this.weatherAPI = weatherAPI;
        this.container = document.querySelector('.suggestions');
        this.isVisible = false;
        
        this.debouncedGetSuggestions = Utils.debounce(
            this.getSuggestions.bind(this), 
            200  // Faster response
        );
    }

    async getSuggestions(query) {
        if (!query || query.length < 1) {  // Show suggestions after 1 character
            this.hide();
            return;
        }

        try {
            const locations = await this.weatherAPI.getLocationSuggestions(query);
            if (locations.length > 0) {
                // Sort by relevance for better matching
                const sortedLocations = this.sortByRelevance(locations, query);
                this.display(sortedLocations.slice(0, 5)); // Limit to 5 suggestions
            } else {
                this.hide();
            }
        } catch (error) {
            console.warn('Error fetching suggestions:', error);
            this.hide();
        }
    }

    // Add this method to sort by relevance
    sortByRelevance(locations, query) {
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
            
            // Contains query (this helps with "sydne" -> "Sydney")
            if (aName.includes(queryLower) && !bName.includes(queryLower)) return -1;
            if (bName.includes(queryLower) && !aName.includes(queryLower)) return 1;
            
            // Similarity score for fuzzy matching
            const aScore = this.getSimilarityScore(aName, queryLower);
            const bScore = this.getSimilarityScore(bName, queryLower);
            
            return bScore - aScore; // Higher score first
        });
    }

    // Add this method for fuzzy matching
    getSimilarityScore(text, query) {
        if (text.includes(query)) return 100;
        
        let score = 0;
        let queryIndex = 0;
        
        for (let i = 0; i < text.length && queryIndex < query.length; i++) {
            if (text[i] === query[queryIndex]) {
                score += 2;
                queryIndex++;
            } else if (Math.abs(text.charCodeAt(i) - query.charCodeAt(queryIndex)) === 1) {
                score += 1; // Similar character
                queryIndex++;
            }
        }
        
        // Bonus for matching most of the query
        if (queryIndex === query.length) {
            score += 50;
        }
        
        return score;
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