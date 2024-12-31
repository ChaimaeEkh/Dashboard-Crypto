# Cryptocurrency Dashboard

Real-time cryptocurrency tracking dashboard with interactive charts and detailed market analysis.

## Features

- Live crypto price tracking with 60-second auto-refresh
- Interactive price charts showing 7-day history
- Advanced filtering and sorting capabilities
- Responsive card-based UI design
- Detailed modal view for each cryptocurrency
- Market cap and volume tracking
- Percentage change indicators
- Error handling and user feedback

## Technologies

### Frontend
- HTML5/CSS3
- JavaScript (ES6+)
- Chart.js v3.7.0 - Price history visualization
- Font Awesome 6.0.0 - UI icons

### APIs
- CoinGecko API v3
  - `/coins/markets` - Market data
  - `/coins/{id}/market_chart` - Historical data

### Features Implementation
- CSS Grid/Flexbox for responsive layouts
- CSS Custom Properties for theming
- Fetch API for data retrieval
- ES6 Classes for code organization
- Event delegation for performance
- Local currency: EUR
- Mobile-first responsive design

## Setup

1. Clone repository
2. No build process required - static HTML file
3. Serve through web server
4. Access through browser

## API Rate Limits

- CoinGecko free tier: 50 calls/minute
- Dashboard refreshes every 60 seconds
- Implements error handling for API limits

## Browser Support

- Chrome 60+
- Firefox 54+
- Safari 10+
- Edge 79+

## Performance Considerations

- Optimized DOM operations
- Efficient event handling
- Debounced search
- Memory leak prevention
- Proper modal cleanup


## features ::
Comparaison de cryptomonnaies

    Ajoute une section où les utilisateurs peuvent comparer deux ou plusieurs cryptomonnaies côte à côte (prix, variation, volume, etc.).

    --Historique des recherches

    Affiche une liste des cryptomonnaies récemment recherchées, avec des options pour revisiter ou supprimer des éléments de la liste.

    --Graphiques améliorés

    Intègre des fonctionnalités supplémentaires dans les graphiques, comme le zoom ou des annotations interactives avec Chart.js.

    --Conversion des devises

    Permets à l’utilisateur de changer la devise de base (USD, EUR, JPY, etc.) pour voir les prix dans différentes monnaies.
