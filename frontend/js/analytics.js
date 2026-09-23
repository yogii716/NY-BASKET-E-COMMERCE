/**
 * NyBasket – Deep-Dive Analytics Suite Controller
 */

let weeklyChart = null;
let paymentMethodsChart = null;
let returnReasonsChart = null;
let returnsCategoryChart = null;

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    loadAllAnalyticsData();
});

function initTabs() {
    const tabBtns = document.querySelectorAll('.ny-tab-btn');
    const tabPanes = document.querySelectorAll('.ny-tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const activePane = document.getElementById(target);
            if (activePane) activePane.classList.add('active');
        });
    });
}

async function loadAllAnalyticsData() {
    try {
        const [salesRes, prodRes, retRes, invRes, insightsRes] = await Promise.all([
            API.get('/api/analytics/sales'),
            API.get('/api/analytics/products'),
            API.get('/api/analytics/returns'),
            API.get('/api/analytics/inventory'),
            API.get('/api/analytics/insights')
        ]);

        if (salesRes.success) renderSalesTab(salesRes.data);
        if (prodRes.success) renderProductsTab(prodRes.data);
        if (retRes.success) renderReturnsTab(retRes.data);
        if (invRes.success) renderInventoryTab(invRes.data);
        if (insightsRes.success) renderInsightsTab(insightsRes.data);
    } catch (e) {
        console.error('Failed to load deep-dive analytics:', e);
    }
}

function isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
}

function renderSalesTab(sales) {
    const isDark = isDarkMode();
    const textCol = isDark ? '#cbd5e1' : '#475569';
    const gridCol = isDark ? '#1e293b' : '#e2e8f0';

    // 1. Weekly Sales Chart
    const ctxWeekly = document.getElementById('chart-weekly-sales');
    if (ctxWeekly && sales.weekly) {
        if (weeklyChart) weeklyChart.destroy();
        weeklyChart = new Chart(ctxWeekly, {
            type: 'bar',
            data: {
                labels: sales.weekly.map(w => w.week),
                datasets: [
                    {
                        label: 'Revenue (₹)',
                        data: sales.weekly.map(w => w.revenue),
                        backgroundColor: '#4f46e5',
                        borderRadius: 4
                    },
                    {
                        label: 'Profit (₹)',
                        data: sales.weekly.map(w => w.profit),
                        backgroundColor: '#10b981',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: textCol } },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`
                        }
                    }
                },
                scales: {
                    x: { ticks: { color: textCol }, grid: { display: false } },
                    y: {
                        ticks: { color: textCol, callback: (v) => `₹${(v/1000).toFixed(0)}k` },
                        grid: { color: gridCol }
                    }
                }
            }
        });
    }

    // 2. Payment Method Share Chart
    const ctxPay = document.getElementById('chart-payment-methods');
    if (ctxPay && sales.payment_methods) {
        if (paymentMethodsChart) paymentMethodsChart.destroy();
        paymentMethodsChart = new Chart(ctxPay, {
            type: 'doughnut',
            data: {
                labels: sales.payment_methods.map(p => `${p.method} (${p.share_pct}%)`),
                datasets: [{
                    data: sales.payment_methods.map(p => p.revenue),
                    backgroundColor: ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'],
                    borderWidth: 2,
                    borderColor: isDark ? '#131c2e' : '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { color: textCol } },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.raw)}`
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }
}

function renderProductsTab(prodData) {
    // 1. Most Profitable
    const tbodyProfitable = document.getElementById('table-top-profitable-tbody');
    if (tbodyProfitable && prodData.top_profitable) {
        tbodyProfitable.innerHTML = prodData.top_profitable.map((p, i) => `
            <tr>
                <td style="font-weight:700; color:var(--accent);">#${i + 1}</td>
                <td>
                    <div style="font-weight:600; color:var(--text-primary);">${p.name}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${p.category}</div>
                </td>
                <td>${formatCurrency(p.price)}</td>
                <td style="color:var(--accent); font-weight:700;">${formatCurrency(p.profit)}</td>
                <td><span class="badge-stock-in">${p.margin_pct}% Margin</span></td>
            </tr>
        `).join('');
    }

    // 2. High Sales Low Profit Alert
    const tbodyLowMargin = document.getElementById('table-high-sales-low-profit-tbody');
    if (tbodyLowMargin && prodData.high_sales_low_profit) {
        tbodyLowMargin.innerHTML = prodData.high_sales_low_profit.map(p => `
            <tr>
                <td><strong>${p.name}</strong></td>
                <td>${p.category}</td>
                <td>${p.units_sold} units sold</td>
                <td style="font-weight:700;">${formatCurrency(p.revenue)}</td>
                <td><span class="badge-stock-low">${p.margin_pct}% Margin</span></td>
                <td><span style="font-size:0.8rem; color:var(--warning); font-weight:600;"><i class="fas fa-exclamation-triangle"></i> Renegotiate Cost</span></td>
            </tr>
        `).join('') || `<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No low profit anomaly detected.</td></tr>`;
    }

    // 3. Low Stock Alert
    const tbodyLowStock = document.getElementById('table-low-stock-tbody');
    if (tbodyLowStock && prodData.low_stock_products) {
        tbodyLowStock.innerHTML = prodData.low_stock_products.map(p => `
            <tr>
                <td><strong>${p.name}</strong></td>
                <td>${p.category}</td>
                <td style="font-weight:700; color:${p.stock === 0 ? 'var(--danger)' : 'var(--warning)'};">${p.stock} units</td>
                <td><span class="${p.stock > 0 ? 'badge-stock-low' : 'badge-stock-out'}">${p.stock_status}</span></td>
                <td>
                    <button class="ny-btn ny-btn-primary ny-btn-sm" onclick="showToast('Restock purchase order simulated for ${p.name}', 'success')">
                        <i class="fas fa-truck-loading"></i> Reorder
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function renderReturnsTab(retData) {
    const isDark = isDarkMode();
    const textCol = isDark ? '#cbd5e1' : '#475569';

    document.getElementById('ret-kpi-total-orders').textContent = retData.total_orders;
    document.getElementById('ret-kpi-completed').textContent = retData.completed_orders;
    document.getElementById('ret-kpi-returned').textContent = retData.returned_orders;
    document.getElementById('ret-kpi-cancelled').textContent = retData.cancelled_orders;
    document.getElementById('ret-kpi-return-rate').textContent = `${retData.return_rate}%`;
    document.getElementById('ret-kpi-cancellation-rate').textContent = `${retData.cancellation_rate}%`;

    // Return Reasons Chart
    const ctxReasons = document.getElementById('chart-return-reasons');
    if (ctxReasons && retData.returns_by_reason) {
        if (returnReasonsChart) returnReasonsChart.destroy();
        returnReasonsChart = new Chart(ctxReasons, {
            type: 'bar',
            data: {
                labels: retData.returns_by_reason.map(r => r.reason),
                datasets: [{
                    label: 'Return Count',
                    data: retData.returns_by_reason.map(r => r.count),
                    backgroundColor: '#f59e0b',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: textCol } },
                    y: { ticks: { color: textCol } }
                }
            }
        });
    }

    // Returns by Category Chart
    const ctxRetCat = document.getElementById('chart-returns-category');
    if (ctxRetCat && retData.returns_by_category) {
        if (returnsCategoryChart) returnsCategoryChart.destroy();
        returnsCategoryChart = new Chart(ctxRetCat, {
            type: 'doughnut',
            data: {
                labels: retData.returns_by_category.map(c => c.category),
                datasets: [{
                    data: retData.returns_by_category.map(c => c.count),
                    backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#0ea5e9']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: textCol } }
                }
            }
        });
    }
}

function renderInventoryTab(invData) {
    document.getElementById('inv-total-units').textContent = invData.total_units.toLocaleString();
    document.getElementById('inv-cost-val').textContent = formatCurrency(invData.total_valuation_cost);
    document.getElementById('inv-retail-val').textContent = formatCurrency(invData.total_valuation_retail);
    document.getElementById('inv-in-stock').textContent = invData.in_stock_count;
    document.getElementById('inv-low-stock').textContent = invData.low_stock_count;
    document.getElementById('inv-out-of-stock').textContent = invData.out_of_stock_count;

    const tbody = document.getElementById('inventory-table-tbody');
    if (!tbody) return;

    tbody.innerHTML = invData.items.map(item => `
        <tr>
            <td><strong>${item.name}</strong></td>
            <td>${item.category}</td>
            <td style="font-weight:700;">${item.stock}</td>
            <td>${formatCurrency(item.cost)}</td>
            <td>${formatCurrency(item.price)}</td>
            <td>${item.units_sold}</td>
            <td style="font-weight:700;">${formatCurrency(item.revenue_generated)}</td>
            <td><span class="${item.stock > 10 ? 'badge-stock-in' : (item.stock > 0 ? 'badge-stock-low' : 'badge-stock-out')}">${item.stock_status}</span></td>
            <td>
                ${item.restock_recommended 
                    ? '<span class="badge-at-risk"><i class="fas fa-exclamation-circle"></i> High Demand Restock</span>' 
                    : '<span style="color:var(--text-muted); font-size:0.8rem;">Adequate</span>'}
            </td>
        </tr>
    `).join('');
}

function renderInsightsTab(insights) {
    const ceoList = document.getElementById('deep-ceo-insights');
    const cmoList = document.getElementById('deep-cmo-insights');

    if (ceoList && insights.ceo_insights) {
        ceoList.innerHTML = insights.ceo_insights.map(item => `
            <div class="ny-insight-item ${item.type}">
                <div class="ny-insight-question"><i class="fas fa-briefcase"></i> ${item.question}</div>
                <div class="ny-insight-answer">${item.answer}</div>
                <div class="ny-insight-tag">${item.metric}</div>
            </div>
        `).join('');
    }

    if (cmoList && insights.cmo_insights) {
        cmoList.innerHTML = insights.cmo_insights.map(item => `
            <div class="ny-insight-item ${item.type}">
                <div class="ny-insight-question"><i class="fas fa-bullseye"></i> ${item.question}</div>
                <div class="ny-insight-answer">${item.answer}</div>
                <div class="ny-insight-tag" style="background:var(--accent-light); color:var(--accent);">${item.action}</div>
            </div>
        `).join('');
    }
}
