class WeatherAnimations {
    constructor() {
        this.particlesContainer = null;
        this.particles = [];
        this.animationId = null;
        this.currentWeather = null;
        this.initializeParticlesContainer();
    }

    initializeParticlesContainer() {
        // Create particles container if it doesn't exist
        this.particlesContainer = document.querySelector('.weather-particles');
        if (!this.particlesContainer) {
            this.particlesContainer = document.createElement('div');
            this.particlesContainer.className = 'weather-particles';
            document.body.appendChild(this.particlesContainer);
        }
    }

    updateWeatherAnimation(weatherCondition) {
        if (this.currentWeather === weatherCondition) return;
        
        this.currentWeather = weatherCondition;
        this.clearParticles();
        this.updateBackground(weatherCondition);
        this.updateCardTheme(weatherCondition);
        this.updateIconAnimation(weatherCondition);
        
        // Start appropriate particle animation
        switch (weatherCondition.toLowerCase()) {
            case 'rain':
            case 'drizzle':
                this.createRainAnimation();
                break;
            case 'snow':
                this.createSnowAnimation();
                break;
            case 'clouds':
                this.createCloudAnimation();
                break;
            case 'clear':
                this.createSunnyAnimation();
                break;
            case 'thunderstorm':
                this.createStormAnimation();
                break;
            case 'mist':
            case 'fog':
            case 'haze':
                this.createMistAnimation();
                break;
        }
    }

    updateBackground(condition) {
        const body = document.body;
        const card = document.querySelector('.card');
        
        // Remove existing weather classes
        body.className = body.className.replace(/\b(sunny|cloudy|rainy|snowy|stormy|misty)\b/g, '');
        
        switch (condition.toLowerCase()) {
            case 'clear':
                body.classList.add('sunny');
                break;
            case 'clouds':
                body.classList.add('cloudy');
                break;
            case 'rain':
            case 'drizzle':
                body.classList.add('rainy');
                break;
            case 'snow':
                body.classList.add('snowy');
                break;
            case 'thunderstorm':
                body.classList.add('stormy');
                break;
            case 'mist':
            case 'fog':
            case 'haze':
                body.classList.add('misty');
                break;
        }
    }

    updateCardTheme(condition) {
        const card = document.querySelector('.card');
        if (!card) return;
        
        // Remove existing theme classes
        card.className = card.className.replace(/\b\w+-theme\b/g, '');
        
        switch (condition.toLowerCase()) {
            case 'clear':
                card.classList.add('sunny-theme');
                break;
            case 'clouds':
                card.classList.add('cloudy-theme');
                break;
            case 'rain':
            case 'drizzle':
                card.classList.add('rainy-theme');
                break;
            case 'snow':
                card.classList.add('snowy-theme');
                break;
            case 'thunderstorm':
                card.classList.add('stormy-theme');
                break;
            case 'mist':
            case 'fog':
            case 'haze':
                card.classList.add('misty-theme');
                break;
        }
    }

    updateIconAnimation(condition) {
        const weatherIcon = document.querySelector('.weather-icon');
        if (!weatherIcon) return;
        
        // Remove existing animation classes
        weatherIcon.className = weatherIcon.className.replace(/\b(sunny|rainy|snowy|cloudy)\b/g, '');
        
        switch (condition.toLowerCase()) {
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
        }
    }

    createRainAnimation() {
        const createRainDrop = () => {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
            drop.style.opacity = Math.random() * 0.8 + 0.2;
            this.particlesContainer.appendChild(drop);
            
            setTimeout(() => {
                if (drop.parentNode) {
                    drop.parentNode.removeChild(drop);
                }
            }, 1000);
        };

        // Create rain drops continuously
        this.animationId = setInterval(createRainDrop, 50);
    }

    createSnowAnimation() {
        const createSnowFlake = () => {
            const flake = document.createElement('div');
            flake.className = 'snow-flake';
            flake.style.left = Math.random() * 100 + '%';
            flake.style.width = flake.style.height = (Math.random() * 6 + 4) + 'px';
            flake.style.animationDuration = (Math.random() * 3 + 2) + 's';
            flake.style.opacity = Math.random() * 0.8 + 0.2;
            this.particlesContainer.appendChild(flake);
            
            setTimeout(() => {
                if (flake.parentNode) {
                    flake.parentNode.removeChild(flake);
                }
            }, 5000);
        };

        this.animationId = setInterval(createSnowFlake, 200);
    }

    createCloudAnimation() {
        const createCloud = () => {
            const cloud = document.createElement('div');
            cloud.className = 'cloud-particle';
            cloud.style.top = Math.random() * 30 + '%';
            cloud.style.width = (Math.random() * 100 + 50) + 'px';
            cloud.style.height = (Math.random() * 40 + 20) + 'px';
            cloud.style.animationDuration = (Math.random() * 20 + 10) + 's';
            this.particlesContainer.appendChild(cloud);
            
            setTimeout(() => {
                if (cloud.parentNode) {
                    cloud.parentNode.removeChild(cloud);
                }
            }, 30000);
        };

        createCloud();
        this.animationId = setInterval(createCloud, 10000);
    }

    createSunnyAnimation() {
        // For sunny weather, we rely mainly on CSS animations for the icon
        // Could add light rays or sparkles here if desired
    }

    createStormAnimation() {
        // Combine rain with occasional lightning flash
        this.createRainAnimation();
        
        const createLightning = () => {
            document.body.style.boxShadow = 'inset 0 0 100px rgba(255, 255, 255, 0.8)';
            setTimeout(() => {
                document.body.style.boxShadow = '';
            }, 100);
        };

        setInterval(createLightning, Math.random() * 5000 + 3000);
    }

    createMistAnimation() {
        const createMist = () => {
            const mist = document.createElement('div');
            mist.style.position = 'absolute';
            mist.style.background = 'rgba(255, 255, 255, 0.1)';
            mist.style.borderRadius = '50px';
            mist.style.width = (Math.random() * 200 + 100) + 'px';
            mist.style.height = (Math.random() * 50 + 30) + 'px';
            mist.style.top = Math.random() * 100 + '%';
            mist.style.left = '-200px';
            mist.style.animation = 'cloud-drift 15s linear infinite';
            mist.style.opacity = '0.3';
            this.particlesContainer.appendChild(mist);
            
            setTimeout(() => {
                if (mist.parentNode) {
                    mist.parentNode.removeChild(mist);
                }
            }, 15000);
        };

        this.animationId = setInterval(createMist, 3000);
    }

    clearParticles() {
        if (this.animationId) {
            clearInterval(this.animationId);
            this.animationId = null;
        }
        
        if (this.particlesContainer) {
            this.particlesContainer.innerHTML = '';
        }
    }

    destroy() {
        this.clearParticles();
        if (this.particlesContainer && this.particlesContainer.parentNode) {
            this.particlesContainer.parentNode.removeChild(this.particlesContainer);
        }
    }
}