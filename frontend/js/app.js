/**
 * NyBasket – Global Application Controller
 * Handles Theme Toggling, Cart Synchronization, Live Search & Auth State
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCartBadge();
    initAuthState();
    initGlobalSearch();
    initMobileNav();
});

/**
 * Dark / Light Theme Manager
 */
function initTheme() {
    const savedTheme = localStorage.getItem('nybasket_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('nybasket_theme', newTheme);
            updateThemeIcon(newTheme);
            showToast(`Switched to ${newTheme} mode`, 'info');
        });
    }
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle-btn i');
    if (icon) {
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

/**
 * Cart Counter & Storage Synchronizer
 */
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('nybasket_cart')) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('nybasket_cart', JSON.stringify(cart));
    initCartBadge();
}

function initCartBadge() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(b => {
        b.textContent = totalCount;
        b.style.display = totalCount > 0 ? 'flex' : 'none';
    });
}

function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            cost: product.cost,
            image_url: product.image_url,
            quantity: quantity
        });
    }

    saveCart(cart);
    showToast(`Added "${product.name}" to basket!`, 'success');
}

/**
 * Authentication & Profile Session
 */
function initAuthState() {
    const userJson = localStorage.getItem('nybasket_user');
    const userBtn = document.getElementById('user-profile-btn');
    const userMenu = document.getElementById('user-dropdown-menu');

    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            const userDropdownHeader = document.getElementById('user-dropdown-header');
            if (userDropdownHeader) {
                userDropdownHeader.innerHTML = `
                    <div class="ny-user-name">${user.name}</div>
                    <div class="ny-user-email">${user.email} (${user.role})</div>
                `;
            }

            const loginNavBtn = document.getElementById('nav-login-btn');
            if (loginNavBtn) {
                loginNavBtn.style.display = 'none';
            }
            if (userBtn) {
                userBtn.style.display = 'flex';
            }
        } catch (e) {
            localStorage.removeItem('nybasket_user');
        }
    }

    if (userBtn && userMenu) {
        userBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenu.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            userMenu.classList.remove('show');
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('nybasket_user');
            showToast('Logged out successfully', 'info');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        });
    }
}

/**
 * Global Real-Time Search Autocomplete
 */
function initGlobalSearch() {
    const searchInputs = document.querySelectorAll('.ny-search-input');
    searchInputs.forEach(input => {
        const resultsBox = input.parentElement.querySelector('.ny-search-results');
        if (!resultsBox) return;

        let debounceTimer;
        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            const query = input.value.trim();

            if (query.length < 2) {
                resultsBox.style.display = 'none';
                return;
            }

            debounceTimer = setTimeout(async () => {
                try {
                    const res = await API.get('/api/products', { search: query, limit: 5 });
                    if (res.products && res.products.length > 0) {
                        resultsBox.innerHTML = res.products.map(p => `
                            <div class="ny-search-item" onclick="window.location.href='product-details.html?id=${p.id}'">
                                <img src="${p.image_url}" alt="${p.name}">
                                <div>
                                    <div style="font-weight:600; font-size:0.9rem;">${p.name}</div>
                                    <div style="font-size:0.8rem; color:var(--text-muted);">${p.category} • ${formatCurrency(p.price)}</div>
                                </div>
                            </div>
                        `).join('');
                        resultsBox.style.display = 'block';
                    } else {
                        resultsBox.innerHTML = `<div style="padding:1rem; text-align:center; color:var(--text-muted); font-size:0.85rem;">No products found for "${query}"</div>`;
                        resultsBox.style.display = 'block';
                    }
                } catch (e) {
                    resultsBox.style.display = 'none';
                }
            }, 300);
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                window.location.href = `products.html?search=${encodeURIComponent(input.value.trim())}`;
            }
        });

        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !resultsBox.contains(e.target)) {
                resultsBox.style.display = 'none';
            }
        });
    });
}

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
    const toggleBtn = document.querySelector('.ny-mobile-toggle');
    const navLinks = document.querySelector('.ny-nav-links');
    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }
}
