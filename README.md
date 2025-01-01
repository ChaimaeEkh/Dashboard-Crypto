# Cryptocurrency Dashboard

Real-time cryptocurrency tracking dashboard with interactive charts and detailed market analysis.

## Features

- **Live Crypto Tracking**: Automatically refreshes data every 60 seconds.
- **Interactive Charts**: Visualize 7-day price history using Chart.js.
- **Advanced Filtering and Sorting**: Sort by market cap, price, or percentage change.
- **Responsive Design**: Built with a card-based UI for mobile and desktop.
- **Detailed Modal Views**: View comprehensive information for each cryptocurrency.
- **Market Metrics**: Tracks market cap, volume, and price change percentages.
- **Error Handling**: Graceful error messages for API or connection issues.
- **Search History**: Quickly revisit recently searched cryptocurrencies.
- **Comparison Tool**: Compare up to three cryptocurrencies side by side.
- **Currency Conversion**: View prices in multiple currencies (USD, EUR, JPY, GBP).
- **Enhanced Charts**: Interactive features like zooming and annotations.

## Technologies

### Frontend
- **HTML5/CSS3**: Semantic markup and modern styles.
- **JavaScript (ES6+)**: Interactive functionality and dynamic updates.
- **Chart.js v3.7.0**: Visualizes price trends with responsive charts.
- **Font Awesome 6.0.0**: Provides elegant UI icons.

### APIs
- **CoinGecko API v3**:
  - `/coins/markets`: Fetches market data for cryptocurrencies.
  - `/coins/{id}/market_chart`: Retrieves historical price data.

### Features Implementation
- **CSS Grid and Flexbox**: Ensure responsive layouts.
- **CSS Custom Properties**: Simplifies theming and style adjustments.
- **Fetch API**: Retrieves and updates real-time data.
- **ES6 Classes**: Organizes application logic.
- **Event Delegation**: Enhances performance with optimized event listeners.
- **Local Currency Support**: Default set to EUR.
- **Mobile-First Design**: Prioritizes usability on smaller screens.

## Setup

1. Clone this repository:
   git clone https://github.com/ChaimaeEkh/Dashboard-Crypto.git