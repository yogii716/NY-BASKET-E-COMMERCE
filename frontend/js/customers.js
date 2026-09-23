/**
 * NyBasket – Customer Analytics & Segmentation Controller
 */

let allCustomersData = [];
let customerSegmentChart = null;

document.addEventListener('DOMContentLoaded', () => {
    loadCustomersAnalytics();
    initCustomerFilters();
});

async function loadCustomersAnalytics() {
    try {
        const res = await API.get('/api/analytics/customers');
        if (!res.success) return;

        allCustomersData = res.data.customers;
        renderCustomerKPIs(res.data.summary);
        renderSegmentChart(res.data.segment_distribution);
        renderTopRankings(res.data);
        renderCustomersTable(allCustomersData);
    } catch (e) {
        console.error('Failed to load customer analytics:', e);
    }
}

function renderCustomerKPIs(summary) {
    document.getElementById('cust-kpi-total').textContent = summary.total_customers;
    document.getElementById('cust-kpi-new').textContent = summary.new_customers;
    document.getElementById('cust-kpi-regular').textContent = summary.regular_customers;
    document.getElementById('cust-kpi-vip').textContent = summary.vip_customers;
    document.getElementById('cust-kpi-at-risk').textContent = summary.at_risk_customers;
    document.getElementById('cust-kpi-repeat-rate').textContent = `${summary.repeat_customer_rate}%`;
    document.getElementById('cust-kpi-avg-rev').textContent = formatCurrency(summary.avg_revenue_per_customer);
    document.getElementById('cust-kpi-avg-orders').textContent = summary.avg_orders_per_customer;
}

function renderSegmentChart(dist) {
    const ctx = document.getElementById('chart-customer-segments');
    if (!ctx) return;

    if (customerSegmentChart) customerSegmentChart.destroy();

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    customerSegmentChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['VIP Customers', 'Regular Customers', 'New Customers', 'At Risk (90+ Days)'],
            datasets: [{
                data: [dist['VIP Customer'] || 0, dist['Regular Customer'] || 0, dist['New Customer'] || 0, dist['At Risk'] || 0],
                backgroundColor: ['#d97706', '#4f46e5', '#10b981', '#ef4444'],
                borderWidth: 2,
                borderColor: isDark ? '#131c2e' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: isDark ? '#cbd5e1' : '#475569', font: { family: 'Plus Jakarta Sans' } }
                }
            }
        }
    });
}

function renderTopRankings(data) {
    const listRevenue = document.getElementById('top-customers-revenue-list');
    const listProfit = document.getElementById('top-customers-profit-list');
    const listOrders = document.getElementById('top-customers-orders-list');

    if (listRevenue && data.top_by_revenue) {
        listRevenue.innerHTML = data.top_by_revenue.slice(0, 5).map((c, i) => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0; border-bottom:1px solid var(--border-color);">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                    <span style="font-weight:700; color:var(--primary);">#${i + 1}</span>
                    <div>
                        <strong style="color:var(--text-primary); cursor:pointer;" onclick="showCustomerModal(${c.id})">${c.name}</strong>
                        <div style="font-size:0.75rem; color:var(--text-muted);">${c.city} • ${c.customer_type}</div>
                    </div>
                </div>
                <div style="font-weight:700; color:var(--primary);">${formatCurrency(c.total_revenue)}</div>
            </div>
        `).join('');
    }

    if (listProfit && data.top_by_profit) {
        listProfit.innerHTML = data.top_by_profit.slice(0, 5).map((c, i) => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0; border-bottom:1px solid var(--border-color);">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                    <span style="font-weight:700; color:var(--accent);">#${i + 1}</span>
                    <div>
                        <strong style="color:var(--text-primary); cursor:pointer;" onclick="showCustomerModal(${c.id})">${c.name}</strong>
                        <div style="font-size:0.75rem; color:var(--text-muted);">${c.city}</div>
                    </div>
                </div>
                <div style="font-weight:700; color:var(--accent);">${formatCurrency(c.total_profit)}</div>
            </div>
        `).join('');
    }

    if (listOrders && data.top_by_orders) {
        listOrders.innerHTML = data.top_by_orders.slice(0, 5).map((c, i) => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0; border-bottom:1px solid var(--border-color);">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                    <span style="font-weight:700; color:var(--info);">#${i + 1}</span>
                    <div>
                        <strong style="color:var(--text-primary); cursor:pointer;" onclick="showCustomerModal(${c.id})">${c.name}</strong>
                        <div style="font-size:0.75rem; color:var(--text-muted);">${c.city}</div>
                    </div>
                </div>
                <div style="font-weight:700;">${c.orders_count} orders</div>
            </div>
        `).join('');
    }
}

function renderCustomersTable(customers) {
    const tbody = document.getElementById('customers-table-tbody');
    if (!tbody) return;

    if (customers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:2rem; color:var(--text-muted);">No customers found matching filter.</td></tr>`;
        return;
    }

    tbody.innerHTML = customers.map(c => {
        let badgeClass = 'badge-regular';
        if (c.customer_type === 'VIP Customer') badgeClass = 'badge-vip';
        if (c.customer_type === 'New Customer') badgeClass = 'badge-new';
        if (c.customer_type === 'At Risk') badgeClass = 'badge-at-risk';

        return `
            <tr>
                <td style="font-weight:600; color:var(--text-muted);">#CUST-${String(c.id).padStart(4, '0')}</td>
                <td>
                    <div style="font-weight:700; color:var(--text-primary); cursor:pointer;" onclick="showCustomerModal(${c.id})">
                        ${c.name}
                    </div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${c.email}</div>
                </td>
                <td>${c.city}, ${c.state} <span style="font-size:0.75rem; color:var(--text-muted);">(${c.region})</span></td>
                <td><strong>${c.orders_count}</strong></td>
                <td style="font-weight:700;">${formatCurrency(c.total_revenue)}</td>
                <td style="color:var(--accent); font-weight:700;">${formatCurrency(c.total_profit)}</td>
                <td><span class="badge-segment ${badgeClass}">${c.customer_type}</span></td>
                <td style="font-size:0.85rem; color:var(--text-secondary);">${c.last_purchase}</td>
            </tr>
        `;
    }).join('');
}

function initCustomerFilters() {
    const searchInput = document.getElementById('customers-search-input');
    const segmentFilter = document.getElementById('customers-segment-select');

    function applyFilter() {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const seg = segmentFilter ? segmentFilter.value : 'all';

        let filtered = allCustomersData.filter(c => {
            const matchesQuery = !query || c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query) || c.city.toLowerCase().includes(query);
            const matchesSeg = seg === 'all' || c.customer_type === seg;
            return matchesQuery && matchesSeg;
        });

        renderCustomersTable(filtered);
    }

    if (searchInput) searchInput.addEventListener('input', applyFilter);
    if (segmentFilter) segmentFilter.addEventListener('change', applyFilter);
}

async function showCustomerModal(customerId) {
    const modal = document.getElementById('customer-modal');
    if (!modal) return;

    try {
        const res = await API.get(`/api/customers/${customerId}`);
        if (!res.success || !res.customer) return;

        const c = res.customer;
        const orders = res.orders || [];

        document.getElementById('modal-cust-name').textContent = c.name;
        document.getElementById('modal-cust-email').textContent = c.email;
        document.getElementById('modal-cust-phone').textContent = c.phone || 'N/A';
        document.getElementById('modal-cust-location').textContent = `${c.city}, ${c.state} (${c.region} Region)`;
        document.getElementById('modal-cust-segment').textContent = c.customer_type;

        const ordersList = document.getElementById('modal-cust-orders-list');
        if (ordersList) {
            ordersList.innerHTML = orders.map(o => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem; background:var(--bg-surface-secondary); border-radius:6px; margin-bottom:0.5rem; font-size:0.85rem;">
                    <div>
                        <strong>Order #${o.id}</strong> • <span style="color:var(--text-muted);">${o.order_date}</span>
                        <div style="color:var(--text-secondary); font-size:0.75rem;">Payment: ${o.payment_method} | Status: ${o.status}</div>
                    </div>
                    <div style="font-weight:700; color:var(--primary); font-size:0.95rem;">${formatCurrency(o.total_amount)}</div>
                </div>
            `).join('') || '<div style="color:var(--text-muted); padding:1rem; text-align:center;">No orders yet.</div>';
        }

        modal.style.display = 'flex';
    } catch (e) {
        console.error(e);
    }
}
