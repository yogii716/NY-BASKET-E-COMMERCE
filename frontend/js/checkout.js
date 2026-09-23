/**
 * NyBasket – Checkout & Order Processing Controller
 */

let selectedPaymentMethod = 'UPI';

document.addEventListener('DOMContentLoaded', () => {
    const cart = getCart();
    if (!cart || cart.length === 0) {
        showToast('Your cart is empty. Redirecting to shop...', 'warning');
        setTimeout(() => window.location.href = 'products.html', 1500);
        return;
    }

    renderCheckoutSummary(cart);
    initPaymentSelectors();
    initPreFillUser();
    initCheckoutForm();
});

function initPreFillUser() {
    const userJson = localStorage.getItem('nybasket_user');
    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            const nameInput = document.getElementById('cust-name');
            const emailInput = document.getElementById('cust-email');
            if (nameInput) nameInput.value = user.name || '';
            if (emailInput) emailInput.value = user.email || '';
        } catch (e) {}
    }
}

function renderCheckoutSummary(cart) {
    const summaryContainer = document.getElementById('checkout-items-preview');
    if (!summaryContainer) return;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18;
    const shipping = subtotal > 999 ? 0 : 99;
    const grandTotal = subtotal + tax + shipping;

    summaryContainer.innerHTML = cart.map(item => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; font-size:0.9rem;">
            <div style="display:flex; align-items:center; gap:0.6rem;">
                <img src="${item.image_url}" alt="${item.name}" style="width:36px; height:36px; border-radius:4px; object-fit:cover;">
                <div>
                    <div style="font-weight:600; color:var(--text-primary);">${item.name}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">Qty: ${item.quantity} × ${formatCurrency(item.price)}</div>
                </div>
            </div>
            <div style="font-weight:700;">${formatCurrency(item.price * item.quantity)}</div>
        </div>
    `).join('');

    document.getElementById('checkout-subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('checkout-tax').textContent = formatCurrency(tax);
    document.getElementById('checkout-shipping').textContent = shipping === 0 ? 'FREE' : formatCurrency(shipping);
    document.getElementById('checkout-grand-total').textContent = formatCurrency(grandTotal);
}

function initPaymentSelectors() {
    const paymentCards = document.querySelectorAll('.ny-payment-card');
    paymentCards.forEach(card => {
        card.addEventListener('click', () => {
            paymentCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedPaymentMethod = card.getAttribute('data-method') || 'Demo Payment';
        });
    });
}

function initCheckoutForm() {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('cust-name').value.trim();
        const email = document.getElementById('cust-email').value.trim();
        const phone = document.getElementById('cust-phone').value.trim();
        const address = document.getElementById('cust-address').value.trim();
        const city = document.getElementById('cust-city').value.trim();
        const state = document.getElementById('cust-state').value.trim();
        const pincode = document.getElementById('cust-pincode').value.trim();

        if (!name || !email || !address || !city || !state || !pincode) {
            showToast('Please fill in all required shipping fields.', 'warning');
            return;
        }

        const cart = getCart();
        const orderPayload = {
            customer: {
                name: name,
                email: email,
                phone: phone,
                city: city,
                state: state,
                region: getRegionFromState(state)
            },
            items: cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            })),
            payment_method: selectedPaymentMethod
        };

        const submitBtn = document.getElementById('place-order-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing Order...`;
        }

        try {
            const res = await API.post('/api/orders', orderPayload);
            if (res.success && res.order) {
                // Clear Cart
                saveCart([]);

                // Show Success Receipt Modal
                showOrderSuccessModal(res.order, res.items);
            } else {
                throw new Error(res.error || 'Order placement failed');
            }
        } catch (error) {
            showToast(error.message || 'Failed to place order. Try again.', 'error');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i class="fas fa-lock"></i> Place Order Now`;
            }
        }
    });
}

function getRegionFromState(state) {
    const north = ['Delhi', 'Uttar Pradesh', 'Punjab', 'Haryana', 'Rajasthan', 'Chandigarh'];
    const south = ['Karnataka', 'Tamil Nadu', 'Telangana', 'Kerala', 'Andhra Pradesh'];
    const east = ['West Bengal', 'Odisha', 'Bihar', 'Assam'];
    const west = ['Maharashtra', 'Gujarat', 'Goa'];

    const stateLower = state.toLowerCase();
    if (north.some(s => stateLower.includes(s.toLowerCase()))) return 'North';
    if (south.some(s => stateLower.includes(s.toLowerCase()))) return 'South';
    if (east.some(s => stateLower.includes(s.toLowerCase()))) return 'East';
    if (west.some(s => stateLower.includes(s.toLowerCase()))) return 'West';
    return 'Central';
}

function showOrderSuccessModal(order, items) {
    const modal = document.getElementById('order-success-modal');
    if (!modal) {
        alert(`Order #${order.id} placed successfully!`);
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('modal-order-id').textContent = `#NYB-${String(order.id).padStart(5, '0')}`;
    document.getElementById('modal-order-date').textContent = order.order_date;
    document.getElementById('modal-order-total').textContent = formatCurrency(order.total_amount);
    document.getElementById('modal-order-payment').textContent = order.payment_method;
    document.getElementById('modal-order-status').textContent = order.status;
    document.getElementById('modal-customer-name').textContent = order.customer_name;
    document.getElementById('modal-customer-email').textContent = order.customer_email;

    modal.style.display = 'flex';
}
