class CryptoDashboard {
    constructor() {
        this.API_URL = 'https://api.coingecko.com/api/v3';
        this.cryptoGrid = document.getElementById('cryptoGrid');
        this.searchInput = document.getElementById('searchInput');
        this.sortSelect = document.getElementById('sortSelect');
        this.modal = document.getElementById('cryptoDetails');
        this.detailsContainer = document.getElementById('detailsContainer');
        this.closeButton = document.querySelector('.close');
        this.chart = null;
        
        this.initEventListeners();
        this.fetchAndUpdateData();
        setInterval(() => this.fetchAndUpdateData(), 60000);
    }

    initEventListeners() {
        this.searchInput.addEventListener('input', () => this.filterCryptos());
        this.sortSelect.addEventListener('change', () => this.sortCryptos());
        this.closeButton.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
    }

    async fetchAndUpdateData() {
        try {
            const response = await fetch(`${this.API_URL}/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&sparkline=true`);
            const data = await response.json();
            this.renderCryptoGrid(data);
        } catch (error) {
            console.error('Erreur:', error);
            this.showError('Impossible de charger les données');
        }
    }

    renderCryptoGrid(cryptos) {
        this.cryptoGrid.innerHTML = '';
        cryptos.forEach(crypto => {
            const card = this.createCryptoCard(crypto);
            this.cryptoGrid.appendChild(card);
        });
    }

    createCryptoCard(crypto) {
        const card = document.createElement('div');
        card.className = 'crypto-card';
        card.innerHTML = `
            <div class="crypto-header">
                <img class="crypto-icon" src="${crypto.image}" alt="${crypto.name}">
                <div class="crypto-name">${crypto.name} (${crypto.symbol.toUpperCase()})</div>
            </div>
            <div class="crypto-price">€${crypto.current_price.toLocaleString()}</div>
            <div class="crypto-change ${crypto.price_change_percentage_24h > 0 ? 'positive' : 'negative'}">
                ${crypto.price_change_percentage_24h > 0 ? '↑' : '↓'} 
                ${Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
            </div>
        `;
        card.addEventListener('click', () => this.showCryptoDetails(crypto));
        return card;
    }

    filterCryptos() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const cards = this.cryptoGrid.getElementsByClassName('crypto-card');
        Array.from(cards).forEach(card => {
            const name = card.querySelector('.crypto-name').textContent.toLowerCase();
            card.style.display = name.includes(searchTerm) ? '' : 'none';
        });
    }

    sortCryptos() {
        const cards = Array.from(this.cryptoGrid.getElementsByClassName('crypto-card'));
        const sortBy = this.sortSelect.value;
        
        cards.sort((a, b) => {
            const valueA = this.getCardValue(a, sortBy);
            const valueB = this.getCardValue(b, sortBy);
            return valueB - valueA;
        });

        cards.forEach(card => this.cryptoGrid.appendChild(card));
    }

    getCardValue(card, sortBy) {
        const price = parseFloat(card.querySelector('.crypto-price').textContent.replace(/[^0-9.-]+/g, ''));
        const change = parseFloat(card.querySelector('.crypto-change').textContent.replace(/[^0-9.-]+/g, ''));
        
        switch(sortBy) {
            case 'price': return price;
            case 'percentChange': return change;
            default: return price * 1000; // Approximation for market cap
        }
    }

    async showCryptoDetails(crypto) {
        try {
            const response = await fetch(`${this.API_URL}/coins/${crypto.id}/market_chart?vs_currency=eur&days=7`);
            const data = await response.json();
            
            this.detailsContainer.innerHTML = `
                <h2>${crypto.name} (${crypto.symbol.toUpperCase()})</h2>
                <p>Prix actuel: €${crypto.current_price.toLocaleString()}</p>
                <p>Variation 24h: ${crypto.price_change_percentage_24h.toFixed(2)}%</p>
                <p>Volume 24h: €${crypto.total_volume.toLocaleString()}</p>
                <p>Capitalisation: €${crypto.market_cap.toLocaleString()}</p>
            `;

            this.updateChart(data.prices);
            this.modal.style.display = 'block';
        } catch (error) {
            console.error('Erreur:', error);
            this.showError('Impossible de charger les détails');
        }
    }

    updateChart(priceData) {
        const ctx = document.getElementById('chart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: priceData.map(price => new Date(price[0]).toLocaleDateString()),
                datasets: [{
                    label: 'Prix (EUR)',
                    data: priceData.map(price => price[1]),
                    borderColor: '#3d5afe',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    closeModal() {
        this.modal.style.display = 'none';
        if (this.chart) {
            this.chart.destroy();
        }
    }

    showError(message) {
        const error = document.createElement('div');
        error.style.cssText = 'background: #f44336; color: white; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;';
        error.textContent = message;
        this.cryptoGrid.prepend(error);
        setTimeout(() => error.remove(), 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => new CryptoDashboard());