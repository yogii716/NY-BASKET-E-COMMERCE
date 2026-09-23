/**
 * NyBasket – Products Catalog Controller
 */

let currentFilters = {
    category: 'all',
    search: '',
    min_price: 0,
    max_price: 20000,
    rating: null,
    stock: null,
    sort_by: 'popularity',
    page: 1,
    limit: 24
};

document.addEventListener('DOMContentLoaded', () => {
    // Parse URL params (e.g. ?category=Electronics or ?search=Watch)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('category')) currentFilters.category = urlParams.get('category');
    if (urlParams.has('search')) {
        currentFilters.search = urlParams.get('search');
        const searchInput = document.getElementById('catalog-search-input');
        if (searchInput) searchInput.value = currentFilters.search;
    }

    initFilterControls();
    loadProducts();
});

function initFilterControls() {
    // Category click handler
    const categoryItems = document.querySelectorAll('.ny-filter-item[data-category]');
    categoryItems.forEach(item => {
        if (item.getAttribute('data-category').toLowerCase() === currentFilters.category.toLowerCase()) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }

        item.addEventListener('click', () => {
            categoryItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentFilters.category = item.getAttribute('data-category');
            currentFilters.page = 1;
            loadProducts();
        });
    });

    // Price Range Slider
    const priceSlider = document.getElementById('price-slider');
    const priceLabel = document.getElementById('price-slider-val');
    if (priceSlider && priceLabel) {
        priceSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            priceLabel.textContent = formatCurrency(val);
            currentFilters.max_price = val;
        });

        priceSlider.addEventListener('change', () => {
            currentFilters.page = 1;
            loadProducts();
        });
    }

    // Sort Dropdown
    const sortSelect = document.getElementById('catalog-sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentFilters.sort_by = e.target.value;
            currentFilters.page = 1;
            loadProducts();
        });
    }

    // Rating Radio/Check filters
    const ratingRadios = document.querySelectorAll('input[name="rating_filter"]');
    ratingRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentFilters.rating = e.target.value ? parseFloat(e.target.value) : null;
            currentFilters.page = 1;
            loadProducts();
        });
    });

    // Stock only filter
    const inStockCheckbox = document.getElementById('in-stock-only');
    if (inStockCheckbox) {
        inStockCheckbox.addEventListener('change', (e) => {
            currentFilters.stock = e.target.checked ? 'in_stock' : null;
            currentFilters.page = 1;
            loadProducts();
        });
    }

    // In-page search input
    const catalogSearch = document.getElementById('catalog-search-input');
    if (catalogSearch) {
        let debounce;
        catalogSearch.addEventListener('input', (e) => {
            clearTimeout(debounce);
            debounce = setTimeout(() => {
                currentFilters.search = e.target.value.trim();
                currentFilters.page = 1;
                loadProducts();
            }, 300);
        });
    }
}

async function loadProducts() {
    const grid = document.getElementById('products-catalog-grid');
    const countDisplay = document.getElementById('catalog-product-count');
    if (!grid) return;

    // Show skeleton loading state
    grid.innerHTML = Array(8).fill(0).map(() => `
        <div class="ny-product-card skeleton" style="height: 380px;"></div>
    `).join('');

    try {
        const res = await API.get('/api/products', currentFilters);
        if (countDisplay) {
            countDisplay.textContent = `Showing ${res.products.length} of ${res.total} products`;
        }

        if (!res.products || res.products.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
                    <i class="fas fa-box-open" style="font-size: 3.5rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <h3>No products found</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Try adjusting your filters, price range, or search keyword.</p>
                    <button class="ny-btn ny-btn-primary" onclick="resetFilters()">Reset All Filters</button>
                </div>
            `;
            return;
        }

        grid.innerHTML = res.products.map(p => {
            const originalPrice = Math.round(p.price * 1.25);
            return `
                <div class="ny-product-card">
                    <div class="ny-card-image-wrap">
                        <img src="${p.image_url}" alt="${p.name}" loading="lazy">
                        <span class="ny-card-badge">Save 20%</span>
                    </div>
                    <div class="ny-card-body">
                        <div class="ny-card-category">${p.category}</div>
                        <a href="product-details.html?id=${p.id}" class="ny-card-title" title="${p.name}">${p.name}</a>
                        
                        <div class="ny-card-rating">
                            <i class="fas fa-star"></i>
                            <strong>${p.rating}</strong>
                            <span>(${p.review_count} reviews)</span>
                        </div>
                        
                        <div class="ny-card-pricing">
                            <span class="ny-price-current">${formatCurrency(p.price)}</span>
                            <span class="ny-price-original">${formatCurrency(originalPrice)}</span>
                            <span class="${p.stock > 10 ? 'badge-stock-in' : (p.stock > 0 ? 'badge-stock-low' : 'badge-stock-out')}" style="margin-left:auto;">
                                ${p.stock_status}
                            </span>
                        </div>
                        
                        <div class="ny-card-actions">
                            <button class="ny-btn ny-btn-primary ny-btn-sm" onclick='addToCart(${JSON.stringify(p).replace(/'/g, "&#39;")})' ${p.stock === 0 ? 'disabled' : ''}>
                                <i class="fas fa-shopping-basket"></i> ${p.stock === 0 ? 'Out of Stock' : 'Add to Basket'}
                            </button>
                            <a href="product-details.html?id=${p.id}" class="ny-btn ny-btn-secondary ny-btn-sm" title="View Details">
                                <i class="fas fa-eye"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--danger);">Failed to load products. Make sure the backend server is running.</div>`;
    }
}

function resetFilters() {
    currentFilters = {
        category: 'all',
        search: '',
        min_price: 0,
        max_price: 20000,
        rating: null,
        stock: null,
        sort_by: 'popularity',
        page: 1,
        limit: 24
    };
    const categoryItems = document.querySelectorAll('.ny-filter-item[data-category]');
    categoryItems.forEach(i => i.classList.remove('active'));
    document.querySelector('.ny-filter-item[data-category="all"]')?.classList.add('active');
    
    const catalogSearch = document.getElementById('catalog-search-input');
    if (catalogSearch) catalogSearch.value = '';

    const priceSlider = document.getElementById('price-slider');
    const priceLabel = document.getElementById('price-slider-val');
    if (priceSlider && priceLabel) {
        priceSlider.value = 20000;
        priceLabel.textContent = formatCurrency(20000);
    }

    loadProducts();
}
