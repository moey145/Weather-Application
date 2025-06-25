// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize the weather app
        const weatherApp = new WeatherApp();
        
        console.log('Weather App initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Weather App:', error);
        
        // Fallback error display
        const errorContainer = document.querySelector('.error');
        if (errorContainer) {
            const errorText = errorContainer.querySelector('p');
            if (errorText) {
                errorText.textContent = 'Failed to initialize the app. Please refresh the page.';
            }
            errorContainer.style.display = 'flex';
        }
    }
});