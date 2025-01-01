class CryptoDashboard {
    constructor() {
        this.API_URL = 'https://api.coingecko.com/api/v3';
        this.cryptoGrid = document.getElementById('cryptoGrid');
        this.searchInput = document.getElementById('searchInput');
        this.sortSelect = document.getElementById('sortSelect');
        this.currencySelect = document.getElementById('currencySelect');
        this.modal = document.getElementById('cryptoDetails');
        this.detailsContainer = document.getElementById('detailsContainer');
        this.closeButton = document.querySelector('.close');
        this.compareButton = document.getElementById('compareButton');
        this.comparisonContainer = document.getElementById('comparisonContainer');
        this.comparisonGrid = document.getElementById('comparisonGrid');
        this.searchHistoryList = document.getElementById('searchHistoryList');
        this.chart = null;
        this.currentCurrency = 'eur';
        this.searchHistory = this.loadSearchHistory();
        this.selectedForComparison = new Set();
        
        this.initEventListeners();
        this.fetchAndUpdateData();
        this.updateSearchHistory();
        setInterval(() => this.fetchAndUpdateData(), 60000);
    }

    initEventListeners() {
        this.searchInput.addEventListener('input', () => this.filterCryptos());
        this.sortSelect.addEventListener('change', () => this.sortCryptos());
        this.currencySelect.addEventListener('change', () => this.handleCurrencyChange());
        this.closeButton.addEventListener('click', () => this.closeModal());
        this.compareButton.addEventListener('click', () => this.toggleComparison());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
    }

    loadSearchHistory() {
        return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    }

    saveSearchHistory() {
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }

    updateSearchHistory() {
        this.searchHistoryList.innerHTML = '';
        this.searchHistory.forEach((term, index) => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `
                <span>${term}</span>
                <div>
                    <button onclick="dashboard.searchHistoryTerm('${term}')">
                        <i class="fas fa-search"></i>
                    </button>
                    <button onclick="dashboard.removeFromHistory(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            this.searchHistoryList.appendChild(item);
        });
    }

    searchHistoryTerm(term) {
        this.searchInput.value = term;
        this.filterCryptos();
    }

    removeFromHistory(index) {
        this.searchHistory.splice(index, 1);
        this.saveSearchHistory();
        this.updateSearchHistory();
    }

    addToSearchHistory(term) {
        if (term && !this.searchHistory.includes(term)) {
            this.searchHistory.unshift(term);
            if (this.searchHistory.length > 10) {
                this.searchHistory.pop();
            }
            this.saveSearchHistory();
            this.updateSearchHistory();
        }
    }

    async handleCurrencyChange() {
        this.currentCurrency = this.currencySelect.value;
        await this.fetchAndUpdateData();
    }

    toggleComparison() {
        const isVisible = this.comparisonContainer.style.display === 'block';
        this.comparisonContainer.style.display = isVisible ? 'none' : 'block';
        this.compareButton.textContent = isVisible ? 'Compare' : 'Hide the comparison';
    }

    async fetchAndUpdateData() {
        try {
            const response = await fetch(`${this.API_URL}/coins/markets?vs_currency=${this.currentCurrency}&order=market_cap_desc&per_page=100&sparkline=true`);
            const data = await response.json();
            this.renderCryptoGrid(data);
        } catch (error) {
            console.error('Erreur:', error);
            this.showError('Unable to load data.');
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
            <div class="crypto-price">${this.formatCurrency(crypto.current_price)}</div>
            <div class="crypto-change ${crypto.price_change_percentage_24h > 0 ? 'positive' : 'negative'}">
                ${crypto.price_change_percentage_24h > 0 ? '↑' : '↓'} 
                ${Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
            </div>
            <button onclick="event.stopPropagation(); dashboard.toggleCompare('${crypto.id}')" class="btn-compare">
                ${this.selectedForComparison.has(crypto.id) ? 'Retirer' : 'Compare'}
            </button>
        `;
        card.addEventListener('click', () => this.showCryptoDetails(crypto));
        return card;
    }

    formatCurrency(value) {
        const symbols = {eur: '€',
        usd: '$',
        jpy: '¥',
        gbp: '£'
    };
    return `${symbols[this.currentCurrency]}${value.toLocaleString()}`;
}

toggleCompare(cryptoId) {
    if (this.selectedForComparison.has(cryptoId)) {
        this.selectedForComparison.delete(cryptoId);
    } else if (this.selectedForComparison.size < 3) {
        this.selectedForComparison.add(cryptoId);
    } else {
        this.showError('Maximum 3 cryptocurrencies in comparison');
        return;
    }
    this.updateComparison();
}

async updateComparison() {
    if (this.selectedForComparison.size === 0) {
        this.comparisonContainer.style.display = 'none';
        return;
    }

    this.comparisonContainer.style.display = 'block';
    this.comparisonGrid.innerHTML = '';

    for (const cryptoId of this.selectedForComparison) {
        try {
            const response = await fetch(`${this.API_URL}/coins/${cryptoId}`);
            const data = await response.json();
            
            const comparisonCard = document.createElement('div');
            comparisonCard.className = 'comparison-item';
            comparisonCard.innerHTML = `
                <div class="crypto-header">
                    <img class="crypto-icon" src="${data.image.small}" alt="${data.name}">
                    <div class="crypto-name">${data.name}</div>
                </div>
                <div class="crypto-details">
                    <p>Price: ${this.formatCurrency(data.market_data.current_price[this.currentCurrency])}</p>
                    <p>Volume 24h: ${this.formatCurrency(data.market_data.total_volume[this.currentCurrency])}</p>
                    <p>Market Cap.: ${this.formatCurrency(data.market_data.market_cap[this.currentCurrency])}</p>
                    <p>Variation 24h: ${data.market_data.price_change_percentage_24h.toFixed(2)}%</p>
                    <p>ATH: ${this.formatCurrency(data.market_data.ath[this.currentCurrency])}</p>
                </div>
                <button onclick="dashboard.toggleCompare('${data.id}')" class="btn-remove">
                    Remove from comparison
                </button>
            `;
            this.comparisonGrid.appendChild(comparisonCard);
        } catch (error) {
            console.error('Erreur:', error);
            this.showError(`Error while retrieving data for ${cryptoId}`);
        }
    }
}

filterCryptos() {
    const searchTerm = this.searchInput.value.toLowerCase();
    if (searchTerm) {
        this.addToSearchHistory(searchTerm);
    }
    
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
        default: return price * 1000;
    }
}

async showCryptoDetails(crypto) {
    try {
        const response = await fetch(`${this.API_URL}/coins/${crypto.id}/market_chart?vs_currency=${this.currentCurrency}&days=7`);
        const data = await response.json();
        
        this.detailsContainer.innerHTML = `
            <h2>${crypto.name} (${crypto.symbol.toUpperCase()})</h2>
            <p>Prix actuel: ${this.formatCurrency(crypto.current_price)}</p>
            <p>Variation 24h: ${crypto.price_change_percentage_24h.toFixed(2)}%</p>
            <p>Volume 24h: ${this.formatCurrency(crypto.total_volume)}</p>
            <p>Capitalisation: ${this.formatCurrency(crypto.market_cap)}</p>
        `;

        this.updateChart(data.prices);
        this.modal.style.display = 'block';
    } catch (error) {
        console.error('Erreur:', error);
        this.showError('Unable to load the details');
    }
}

updateChart(priceData) {
    const ctx = document.getElementById('chart').getContext('2d');
    
    if (this.chart) {
        this.chart.destroy();
    }

    // Définir une hauteur fixe pour le canvas
    ctx.canvas.style.height = '400px';
    ctx.canvas.style.width = '100%';

    this.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: priceData.map(price => {
                const date = new Date(price[0]);
                return date.toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }),
            datasets: [{
                label: `Prix (${this.currentCurrency.toUpperCase()})`,
                data: priceData.map(price => price[1]),
                borderColor: '#3d5afe',
                borderWidth: 2,
                tension: 0.1,
                fill: true,
                backgroundColor: 'rgba(61, 90, 254, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'xy'
                    },
                    zoom: {
                        wheel: {
                            enabled: true
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy'
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('fr-FR', {
                                    style: 'currency',
                                    currency: this.currentCurrency
                                }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Prix'
                    },
                    beginAtZero: false
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

const dashboard = new CryptoDashboard();