# Weather Application 🌦️

A modern, responsive weather application that provides real-time weather information, 24-hour forecasts, and extended 10-day forecasts with beautiful day/night themes and smooth animations.

## 🌟 Features

### Core Weather Features
- **Real-time Weather Data**: Current weather conditions for any city worldwide
- **24-Hour Forecast**: Hourly weather predictions with interpolated data
- **10-Day Extended Forecast**: Daily weather forecasts with intelligent trend prediction
- **Location Services**: Get weather for your current location using GPS
- **City Search**: Smart search with location suggestions and autocomplete

### User Interface
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Day/Night Themes**: Automatic theme switching based on local sunrise/sunset times
- **Weather Animations**: Dynamic animations that match current weather conditions
- **Custom Scrollbar**: Smooth, user-friendly scrolling experience
- **Interactive Elements**: Hover effects and smooth transitions

### Advanced Features
- **Smart Caching**: Reduces API calls with intelligent data caching
- **Data Interpolation**: Smooth hourly forecasts between API data points
- **Weather Trend Analysis**: Extended forecasts based on seasonal patterns
- **Accessibility**: ARIA labels and keyboard navigation support
- **Error Handling**: Graceful error management with user-friendly messages

## 🚀 Demo

![Weather App Screenshot](https://via.placeholder.com/800x600?text=Weather+App+Screenshot)

*Note: Add actual screenshots of your application*

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **APIs**: OpenWeatherMap API
- **Fonts**: Google Fonts (Poppins)
- **Icons**: Font Awesome 6.5.1
- **Architecture**: Modular JavaScript classes

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Weather-Application.git
   cd Weather-Application
   ```

2. **Get OpenWeatherMap API Key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up and get your free API key

3. **Configure API Key**
   - Open `js/config.js`
   - Replace the API key with your own:
   ```javascript
   const CONFIG = {
       API: {
           KEY: "your_api_key_here",
           // ... other config
       }
   };
   ```

4. **Run the Application**
   - Open `index.html` in your web browser
   - Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (with live-server)
   npx live-server
   ```

## 🏗️ Project Structure

```
Weather-Application/
├── index.html              # Main HTML file
├── css/
│   ├── main.css            # CSS imports
│   ├── base.css            # Base styles and variables
│   ├── components.css      # UI components
│   ├── weather.css         # Weather-specific styles
│   ├── forecast.css        # Forecast sections
│   ├── themes.css          # Day/night themes
│   ├── animations.css      # Weather animations
│   ├── suggestions.css     # Search suggestions
│   └── responsive.css      # Mobile responsiveness
├── js/
│   ├── app.js              # Application initialization
│   ├── config.js           # Configuration settings
│   ├── weather.js          # Main weather app class
│   ├── api.js              # API communication
│   ├── ui.js               # UI management
│   ├── utils.js            # Utility functions
│   ├── day-night.js        # Day/night theme manager
│   ├── weather-animations.js # Weather animations
│   └── suggestions.js      # Search suggestions
├── images/                 # Weather icons and assets
└── README.md
```

## 🔧 Configuration

### API Configuration (`js/config.js`)
```javascript
const CONFIG = {
    API: {
        KEY: "your_api_key",
        BASE_URL: "https://api.openweathermap.org/data/2.5",
        GEO_URL: "https://api.openweathermap.org/geo/1.0",
        UNITS: "metric",
        LANGUAGE: "en"
    },
    CACHE: {
        DURATION: 10 * 60 * 1000, // 10 minutes
        MAX_SIZE: 50
    },
    UI: {
        DEBOUNCE_DELAY: 300,
        MAX_SUGGESTIONS: 5,
        ANIMATION_DURATION: 300
    }
};
```

## 🎨 Themes

The application automatically switches between day and night themes based on:
- Local sunrise and sunset times
- Current time of day
- Weather conditions

### Theme Features
- **Day Theme**: Light, bright colors with sky blue gradients
- **Night Theme**: Dark colors with deep blue gradients
- **Weather-specific**: Additional styling based on weather conditions
- **Smooth Transitions**: Animated theme changes

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- **Desktop**: > 768px
- **Tablet**: 768px - 480px
- **Mobile**: < 480px
- **Small Mobile**: < 380px
- **Height-constrained**: Custom styles for shorter screens

## 🔍 Features Deep Dive

### Weather Data
- **Current Weather**: Temperature, feels-like, humidity, pressure, wind, visibility
- **Sunrise/Sunset**: Accurate times with phase tracking
- **Weather Icons**: Dynamic icons that change with day/night and conditions

### Forecasts
- **24-Hour**: Interpolated hourly data from 3-hour API intervals
- **10-Day**: 5-day API data extended with intelligent trend analysis
- **Data Quality**: Clear indicators for estimated vs. actual data

### Search & Suggestions
- **Autocomplete**: Real-time city suggestions while typing
- **Geolocation**: One-click access to local weather
- **Error Handling**: Clear messages for invalid locations

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for the weather API
- [Font Awesome](https://fontawesome.com/) for the icons
- [Google Fonts](https://fonts.google.com/) for the Poppins font

*Last updated: June 2025*