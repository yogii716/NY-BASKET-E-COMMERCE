/**
 * NyBasket – Centralized API Gateway & Client Service
 */

const API = {
    BASE_URL: window.location.origin.includes('5000') 
        ? window.location.origin 
        : 'http://127.0.0.1:5000',

    async get(endpoint, params = {}) {
        try {
            const url = new URL(`${this.BASE_URL}${endpoint}`);
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                    url.searchParams.append(key, params[key]);
                }
            });

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || `HTTP error ${response.status}`);
            }
            return data;
        } catch (error) {
            console.error(`API GET Error [${endpoint}]:`, error);
            showToast(error.message || 'Failed to fetch data. Please check connection.', 'error');
            throw error;
        }
    },

    async post(endpoint, body = {}) {
        try {
            const response = await fetch(`${this.BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || `HTTP error ${response.status}`);
            }
            return data;
        } catch (error) {
            console.error(`API POST Error [${endpoint}]:`, error);
            showToast(error.message || 'Operation failed.', 'error');
            throw error;
        }
    }
};

/**
 * Toast Notification Dispatcher
 */
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `ny-toast ${type}`;

    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-triangle';
    if (type === 'warning') icon = 'fa-exclamation-circle';

    toast.innerHTML = `
        <i class="fas ${icon} ny-toast-icon"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

/**
 * Formats numbers into Indian Rupees currency string (₹1,24,500.00)
 */
function formatCurrency(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(amount);
}
