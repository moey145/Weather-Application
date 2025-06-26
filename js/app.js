// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize the weather app
        const weatherApp = new WeatherApp();
        
        // Enhanced scrollbar behavior
        initializeScrollbarBehavior();
        
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

// Enhanced scrollbar behavior
function initializeScrollbarBehavior() {
    const card = document.querySelector('.card');
    if (!card) return;

    let scrollTimeout;
    let isScrolling = false;

    // Show scrollbar while scrolling
    card.addEventListener('scroll', () => {
        if (!isScrolling) {
            card.classList.add('scrolling');
            isScrolling = true;
        }

        // Clear the timeout
        clearTimeout(scrollTimeout);

        // Hide scrollbar after scrolling stops
        scrollTimeout = setTimeout(() => {
            card.classList.remove('scrolling');
            isScrolling = false;
        }, 1000); // Hide after 1 second of no scrolling
    });

    // Show scrollbar on hover
    card.addEventListener('mouseenter', () => {
        card.classList.add('scrolling');
    });

    // Hide scrollbar when not hovering (unless actively scrolling)
    card.addEventListener('mouseleave', () => {
        if (!isScrolling) {
            card.classList.remove('scrolling');
        }
    });

    // Touch support for mobile
    card.addEventListener('touchstart', () => {
        card.classList.add('scrolling');
    });

    card.addEventListener('touchend', () => {
        setTimeout(() => {
            if (!isScrolling) {
                card.classList.remove('scrolling');
            }
        }, 1000);
    });
}