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

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **APIs**: OpenWeatherMap API
- **Fonts**: Google Fonts (Poppins)
- **Icons**: Font Awesome 6.5.1
- **Architecture**: Modular JavaScript classes

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/moey145/Weather-Application.git
   cd Weather-Application
   ```

2. **Get OpenWeatherMap API Key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up and get your free API key

3. **Environment Setup**
   - Create a `.env` file in the root directory
   - Add your API key:
   ```env
   VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

4. **Configuration**
   - The `js/config.js` file is already configured to use environment variables
   - No additional setup needed - it will automatically read from `.env`

5. **Run the Application**
   - For development with environment variables:
   ```bash
   # Using Vite (recommended)
   npm install -g vite
   vite
   
   # Or using a local server
   python -m http.server 8000
   npx live-server
   ```

## 🔐 Security & Environment Variables

### For Local Development
- Create a `.env` file in the project root
- Add your API key: `VITE_OPENWEATHER_API_KEY=your_key_here`
- The `.env` file is automatically gitignored for security

### For Vercel Deployment
1. **In Vercel Dashboard**:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add: `VITE_OPENWEATHER_API_KEY` = `your_api_key_here`

2. **For Other Hosting Platforms**:
   - Add the environment variable in your hosting platform's settings
   - Ensure the variable name is `VITE_OPENWEATHER_API_KEY`

### ⚠️ Important Security Notes
- **Never commit your API key** to version control
- **Always use environment variables** for API keys
- **The `.env` file is gitignored** for your protection
- **For production**, use your hosting platform's environment variable system

## 🏗️ Project Structure

```
Weather-Application/
├── index.html              # Main HTML file
├── .env                    # Environment variables (not in git)
├── .gitignore              # Git ignore file
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
│   └── sun.svg             # Custom sun favicon
└── README.md
```

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect your GitHub repository** to Vercel
2. **Add environment variable** in Vercel dashboard:
   - Key: `VITE_OPENWEATHER_API_KEY`
   - Value: Your OpenWeatherMap API key
3. **Deploy** - Vercel will automatically handle the build

### Other Platforms
- **Netlify**: Add environment variables in site settings
- **GitHub Pages**: Use GitHub Secrets for environment variables
- **Heroku**: Use `heroku config:set VITE_OPENWEATHER_API_KEY=your_key`

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

## 🐛 Troubleshooting

### Common Issues
- **API Key Error**: Ensure your `.env` file exists and contains the correct API key
- **CORS Errors**: Use a local server instead of opening the HTML file directly
- **Environment Variables**: Make sure your hosting platform supports environment variables

### Development Tips
- **Test locally**: Always test with your `.env` file before deploying
- **Check console**: Use browser developer tools to debug API issues
- **API Limits**: Free OpenWeatherMap accounts have rate limits

## 👤 Author

**Mohamad Eldhaibi**
- GitHub: [@moey145](https://github.com/moey145)
- LinkedIn: [Mohamad Eldhaibi](https://www.linkedin.com/in/mohamad-eldhaibi-8ba8a42b7)
- Website: [mohamadeldhaibi.com](https://www.mohamadeldhaibi.com)
- Email: [mohamad.eldhaibi@gmail.com](mailto:mohamad.eldhaibi@gmail.com)

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for the weather API
- [Font Awesome](https://fontawesome.com/) for the icons
- [Google Fonts](https://fonts.google.com/) for the Poppins font

---

*Last updated: July 2025*