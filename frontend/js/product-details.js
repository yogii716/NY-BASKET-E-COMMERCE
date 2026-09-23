/**
 * NyBasket – Product Details Controller
 */

let currentProduct = null;
let currentQuantity = 1;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'products.html';
        return;
    }

    loadProductDetails(productId);
});

async function loadProductDetails(id) {
    try {
        const res = await API.get(`/api/products/${id}`);
        if (!res.success || !res.product) {
            showToast('Product not found.', 'error');
            setTimeout(() => window.location.href = 'products.html', 1500);
            return;
        }

        currentProduct = res.product;
        renderProduct(currentProduct);

        if (res.related_products && res.related_products.length > 0) {
            renderRelatedProducts(res.related_products);
        }
    } catch (e) {
        console.error(e);
    }
}

function renderProduct(p) {
    const originalPrice = Math.round(p.price * 1.25);
    const discountAmount = originalPrice - p.price;

    document.title = `${p.name} – NyBasket`;

    // Breadcrumb
    const breadcrumbCategory = document.getElementById('details-breadcrumb-category');
    const breadcrumbTitle = document.getElementById('details-breadcrumb-title');
    if (breadcrumbCategory) {
        breadcrumbCategory.textContent = p.category;
        breadcrumbCategory.href = `products.html?category=${encodeURIComponent(p.category)}`;
    }
    if (breadcrumbTitle) breadcrumbTitle.textContent = p.name;

    // Image
    const mainImg = document.getElementById('details-img');
    if (mainImg) {
        mainImg.src = p.image_url;
        mainImg.alt = p.name;
    }

    // Details Content
    document.getElementById('details-category').textContent = p.category;
    document.getElementById('details-title').textContent = p.name;
    document.getElementById('details-rating').innerHTML = `
        <i class="fas fa-star"></i>
        <strong>${p.rating}</strong>
        <span>(${p.review_count} verified buyer reviews)</span>
    `;
    document.getElementById('details-price').textContent = formatCurrency(p.price);
    document.getElementById('details-original-price').textContent = formatCurrency(originalPrice);
    document.getElementById('details-save-amount').textContent = `Save ${formatCurrency(discountAmount)} (20% OFF)`;
    document.getElementById('details-description').textContent = p.description || 'Premium quality product certified by NyBasket quality assurance.';

    // Stock Badge
    const stockBadge = document.getElementById('details-stock-badge');
    if (stockBadge) {
        stockBadge.className = p.stock > 10 ? 'badge-stock-in' : (p.stock > 0 ? 'badge-stock-low' : 'badge-stock-out');
        stockBadge.textContent = p.stock > 10 ? 'In Stock (Ready to Ship)' : (p.stock > 0 ? `Only ${p.stock} left in stock!` : 'Currently Out of Stock');
    }

    // Action buttons
    const addBtn = document.getElementById('details-add-cart-btn');
    const buyBtn = document.getElementById('details-buy-now-btn');
    if (p.stock === 0) {
        if (addBtn) addBtn.disabled = true;
        if (buyBtn) buyBtn.disabled = true;
    }

    // Quantity Counter
    const qtyVal = document.getElementById('details-qty-val');
    const qtyMinus = document.getElementById('details-qty-minus');
    const qtyPlus = document.getElementById('details-qty-plus');

    if (qtyMinus && qtyPlus && qtyVal) {
        qtyMinus.addEventListener('click', () => {
            if (currentQuantity > 1) {
                currentQuantity--;
                qtyVal.textContent = currentQuantity;
            }
        });
        qtyPlus.addEventListener('click', () => {
            if (currentQuantity < (p.stock || 10)) {
                currentQuantity++;
                qtyVal.textContent = currentQuantity;
            } else {
                showToast(`Max available stock is ${p.stock}`, 'warning');
            }
        });
    }

    // Add to Cart Action
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            addToCart(p, currentQuantity);
        });
    }

    // Buy Now Action
    if (buyBtn) {
        buyBtn.addEventListener('click', () => {
            addToCart(p, currentQuantity);
            setTimeout(() => window.location.href = 'checkout.html', 300);
        });
    }
}

function renderRelatedProducts(products) {
    const grid = document.getElementById('related-products-grid');
    if (!grid) return;

    grid.innerHTML = products.map(p => `
        <div class="ny-product-card">
            <div class="ny-card-image-wrap" style="height: 180px;">
                <img src="${p.image_url}" alt="${p.name}">
            </div>
            <div class="ny-card-body">
                <div class="ny-card-category">${p.category}</div>
                <a href="product-details.html?id=${p.id}" class="ny-card-title" style="font-size: 0.95rem; height: 2.5rem;">${p.name}</a>
                <div class="ny-card-pricing" style="margin-bottom: 0.75rem;">
                    <span class="ny-price-current" style="font-size: 1.15rem;">${formatCurrency(p.price)}</span>
                </div>
                <div class="ny-card-actions">
                    <button class="ny-btn ny-btn-primary ny-btn-sm" onclick='addToCart(${JSON.stringify(p).replace(/'/g, "&#39;")})'>
                        <i class="fas fa-shopping-basket"></i> Add
                    </button>
                    <a href="product-details.html?id=${p.id}" class="ny-btn ny-btn-secondary ny-btn-sm">
                        <i class="fas fa-eye"></i>
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}
