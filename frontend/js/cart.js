/**
 * NyBasket – Shopping Cart Controller
 */

let appliedDiscountPct = 0;

document.addEventListener('DOMContentLoaded', () => {
    renderCartPage();
    initCouponHandler();
});

function renderCartPage() {
    const cart = getCart();
    const itemsContainer = document.getElementById('cart-items-list');
    const emptyState = document.getElementById('cart-empty-state');
    const cartContent = document.getElementById('cart-content-wrapper');

    if (!itemsContainer) return;

    if (!cart || cart.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (cartContent) cartContent.style.display = 'grid';

    // Render items
    itemsContainer.innerHTML = cart.map(item => `
        <div class="ny-cart-item-row" id="cart-item-${item.id}">
            <img src="${item.image_url}" alt="${item.name}" class="ny-cart-thumb">
            <div>
                <a href="product-details.html?id=${item.id}" style="font-weight:700; font-size:1.05rem; color:var(--text-primary); display:block; margin-bottom:4px;">
                    ${item.name}
                </a>
                <span style="font-size:0.8rem; color:var(--primary); font-weight:600; text-transform:uppercase;">${item.category}</span>
                <div style="font-weight:600; color:var(--text-muted); font-size:0.9rem; margin-top:4px;">${formatCurrency(item.price)} each</div>
            </div>
            
            <div class="ny-qty-counter">
                <button class="ny-qty-btn" onclick="updateItemQuantity(${item.id}, -1)">-</button>
                <span class="ny-qty-val">${item.quantity}</span>
                <button class="ny-qty-btn" onclick="updateItemQuantity(${item.id}, 1)">+</button>
            </div>
            
            <div style="font-family:var(--font-heading); font-size:1.15rem; font-weight:800; min-width:100px; text-align:right;">
                ${formatCurrency(item.price * item.quantity)}
            </div>
            
            <button class="ny-btn ny-btn-secondary ny-btn-sm" onclick="removeItemFromCart(${item.id})" title="Remove item">
                <i class="fas fa-trash-alt" style="color:var(--danger);"></i>
            </button>
        </div>
    `).join('');

    calculateCartTotals(cart);
}

function updateItemQuantity(productId, delta) {
    const cart = getCart();
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
            showToast('Item removed from basket', 'info');
        }
        saveCart(cart);
        renderCartPage();
    }
}

function removeItemFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    showToast('Item removed from basket', 'info');
    renderCartPage();
}

function clearCart() {
    if (confirm('Are you sure you want to clear your entire basket?')) {
        saveCart([]);
        renderCartPage();
        showToast('Basket cleared', 'info');
    }
}

function calculateCartTotals(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * appliedDiscountPct) / 100;
    const discountedSubtotal = subtotal - discountAmount;
    
    // 18% GST Tax
    const taxAmount = discountedSubtotal * 0.18;
    
    // Free Shipping above ₹999, else ₹99
    const shipping = subtotal > 999 ? 0 : 99;
    const grandTotal = discountedSubtotal + taxAmount + shipping;

    document.getElementById('cart-subtotal').textContent = formatCurrency(subtotal);
    
    const discountRow = document.getElementById('cart-discount-row');
    if (discountRow) {
        if (appliedDiscountPct > 0) {
            discountRow.style.display = 'flex';
            document.getElementById('cart-discount-val').textContent = `-${formatCurrency(discountAmount)} (${appliedDiscountPct}%)`;
        } else {
            discountRow.style.display = 'none';
        }
    }

    document.getElementById('cart-tax').textContent = formatCurrency(taxAmount);
    document.getElementById('cart-shipping').textContent = shipping === 0 ? 'FREE' : formatCurrency(shipping);
    document.getElementById('cart-grand-total').textContent = formatCurrency(grandTotal);

    // Shipping progress bar
    const shippingMsg = document.getElementById('shipping-threshold-msg');
    if (shippingMsg) {
        if (subtotal >= 999) {
            shippingMsg.innerHTML = `<span style="color:var(--accent); font-weight:700;"><i class="fas fa-truck"></i> You unlocked FREE Shipping!</span>`;
        } else {
            const needed = 999 - subtotal;
            shippingMsg.innerHTML = `<span style="color:var(--text-secondary);"><i class="fas fa-truck"></i> Add <strong>${formatCurrency(needed)}</strong> more for <strong>FREE Shipping</strong></span>`;
        }
    }
}

function initCouponHandler() {
    const applyBtn = document.getElementById('apply-coupon-btn');
    const couponInput = document.getElementById('coupon-code-input');

    if (applyBtn && couponInput) {
        applyBtn.addEventListener('click', () => {
            const code = couponInput.value.trim().toUpperCase();
            if (code === 'NYBASKET20') {
                appliedDiscountPct = 20;
                showToast('20% Promo code applied!', 'success');
            } else if (code === 'WELCOME10') {
                appliedDiscountPct = 10;
                showToast('10% Welcome discount applied!', 'success');
            } else if (code === '') {
                showToast('Please enter a promo code.', 'warning');
                return;
            } else {
                appliedDiscountPct = 0;
                showToast('Invalid promo coupon code.', 'error');
            }
            renderCartPage();
        });
    }
}
