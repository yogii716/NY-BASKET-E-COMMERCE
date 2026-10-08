/**
 * NyBasket – Executive Analytics Dashboard Controller
 * Powered by Chart.js & JavaScript REST Analytics Engine
 */

let monthlySalesChart = null;
let categoryRevenueChart = null;
let regionalSalesChart = null;
let paymentMethodChart = null;

document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();

    // Listen to theme switch to re-render charts with appropriate contrast
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            setTimeout(loadDashboardData, 100);
        });
    }
});

async function loadDashboardData() {
    try {
        const [summaryRes, salesRes, catRes, prodRes, regRes, insightsRes] = await Promise.all([
            API.get('/api/analytics/summary'),
            API.get('/api/analytics/sales'),
            API.get('/api/analytics/categories'),
            API.get('/api/analytics/products'),
            API.get('/api/analytics/regions'),
            API.get('/api/analytics/insights')
        ]);

        if (summaryRes.success) renderKPICards(summaryRes.data);
        if (salesRes.success) renderSalesCharts(salesRes.data);
        if (catRes.success) renderCategoryChart(catRes.data);
        if (regRes.success) renderRegionalChart(regRes.data);
        if (prodRes.success) renderTopProductsTable(prodRes.data.top_best_sellers);
        if (insightsRes.success) renderAutomatedInsights(insightsRes.data);
    } catch (e) {
        console.error('Failed to load dashboard data:', e);
    }
}

function renderKPICards(data) {
    document.getElementById('kpi-revenue').textContent = formatCurrency(data.total_revenue);
    document.getElementById('kpi-revenue-trend').innerHTML = `<i class="fas fa-arrow-up"></i> +${data.revenue_growth_pct}%`;

    document.getElementById('kpi-orders').textContent = data.total_orders.toLocaleString();
    document.getElementById('kpi-orders-trend').innerHTML = `<i class="fas fa-arrow-up"></i> +${data.orders_growth_pct}%`;

    document.getElementById('kpi-customers').textContent = data.total_customers.toLocaleString();
    document.getElementById('kpi-customers-sub').textContent = `${data.repeat_customer_rate}% Repeat Buyers`;

    document.getElementById('kpi-products').textContent = data.total_products.toLocaleString();

    document.getElementById('kpi-aov').textContent = formatCurrency(data.average_order_value);
    document.getElementById('kpi-aov-trend').innerHTML = `<i class="fas fa-arrow-up"></i> +${data.aov_growth_pct}%`;

    document.getElementById('kpi-profit').textContent = formatCurrency(data.total_profit);
    document.getElementById('kpi-profit-sub').textContent = `${data.profit_margin_pct}% Margin`;
}

function isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
}

function getChartThemeColors() {
    const dark = isDarkMode();
    return {
        textColor: dark ? '#cbd5e1' : '#475569',
        gridColor: dark ? '#1e293b' : '#e2e8f0',
        cardBg: dark ? '#131c2e' : '#ffffff'
    };
}

function renderSalesCharts(data) {
    const theme = getChartThemeColors();
    const ctxMonthly = document.getElementById('chart-monthly-sales');
    if (!ctxMonthly) return;

    if (monthlySalesChart) monthlySalesChart.destroy();

    const labels = data.monthly.map(m => m.month);
    const revenues = data.monthly.map(m => m.revenue);
    const profits = data.monthly.map(m => m.profit);

    monthlySalesChart = new Chart(ctxMonthly, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Gross Revenue (₹)',
                    data: revenues,
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.15)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4f46e5',
                    pointRadius: 4
                },
                {
                    label: 'Net Profit (₹)',
                    data: profits,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    borderWidth: 2.5,
                    borderDash: [4, 4],
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#10b981',
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: theme.textColor, font: { family: 'Plus Jakarta Sans', weight: '600' } }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: theme.textColor },
                    grid: { color: theme.gridColor }
                },
                y: {
                    ticks: {
                        color: theme.textColor,
                        callback: (val) => `₹${(val / 1000).toFixed(0)}k`
                    },
                    grid: { color: theme.gridColor }
                }
            }
        }
    });
}

function renderCategoryChart(categories) {
    const theme = getChartThemeColors();
    const ctxCat = document.getElementById('chart-category-revenue');
    if (!ctxCat) return;

    if (categoryRevenueChart) categoryRevenueChart.destroy();

    const labels = categories.map(c => c.category);
    const data = categories.map(c => c.revenue);
    const colors = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

    categoryRevenueChart = new Chart(ctxCat, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: theme.cardBg
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: theme.textColor, font: { family: 'Plus Jakarta Sans' } }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.raw)}`
                    }
                }
            },
            cutout: '68%'
        }
    });
}

function renderRegionalChart(data) {
    const theme = getChartThemeColors();
    const ctxReg = document.getElementById('chart-regional-sales');
    if (!ctxReg) return;

    if (regionalSalesChart) regionalSalesChart.destroy();

    const labels = data.regional_breakdown.map(r => `${r.region} (${r.share_pct}%)`);
    const revenues = data.regional_breakdown.map(r => r.revenue);

    regionalSalesChart = new Chart(ctxReg, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue (₹)',
                data: revenues,
                backgroundColor: '#0ea5e9',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `Revenue: ${formatCurrency(ctx.raw)}`
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: theme.textColor },
                    grid: { display: false }
                },
                y: {
                    ticks: {
                        color: theme.textColor,
                        callback: (val) => `₹${(val / 1000).toFixed(0)}k`
                    },
                    grid: { color: theme.gridColor }
                }
            }
        }
    });
}

function renderTopProductsTable(products) {
    const tbody = document.getElementById('dashboard-top-products-tbody');
    if (!tbody) return;

    tbody.innerHTML = products.map((p, idx) => `
        <tr>
            <td style="font-weight:700; color:var(--primary);">#${idx + 1}</td>
            <td>
                <div style="display:flex; align-items:center; gap:0.75rem;">
                    <img src="${p.image_url}" alt="${p.name}" style="width:36px; height:36px; border-radius:6px; object-fit:cover;">
                    <div>
                        <a href="product-details.html?id=${p.id}" style="font-weight:600; color:var(--text-primary);">${p.name}</a>
                        <div style="font-size:0.75rem; color:var(--text-muted);">${p.category}</div>
                    </div>
                </div>
            </td>
            <td><strong>${p.units_sold}</strong> units</td>
            <td style="font-weight:700;">${formatCurrency(p.revenue)}</td>
            <td style="color:var(--accent); font-weight:700;">${formatCurrency(p.profit)}</td>
            <td>
                <span class="${p.margin_pct >= 50 ? 'badge-stock-in' : 'badge-stock-low'}">
                    ${p.margin_pct}% Margin
                </span>
            </td>
        </tr>
    `).join('');
}

function renderAutomatedInsights(insights) {
    const ceoContainer = document.getElementById('ceo-insights-list');
    const cmoContainer = document.getElementById('cmo-insights-list');

    if (ceoContainer && insights.ceo_insights) {
        ceoContainer.innerHTML = insights.ceo_insights.map(item => `
            <div class="ny-insight-item ${item.type}">
                <div class="ny-insight-question">
                    <i class="fas fa-chart-line"></i> ${item.question}
                </div>
                <div class="ny-insight-answer">${item.answer}</div>
                <div class="ny-insight-tag">${item.metric}</div>
            </div>
        `).join('');
    }

    if (cmoContainer && insights.cmo_insights) {
        cmoContainer.innerHTML = insights.cmo_insights.map(item => `
            <div class="ny-insight-item ${item.type}">
                <div class="ny-insight-question">
                    <i class="fas fa-bullhorn"></i> ${item.question}
                </div>
                <div class="ny-insight-answer">${item.answer}</div>
                <div class="ny-insight-tag" style="background:var(--accent-light); color:var(--accent);">${item.action}</div>
            </div>
        `).join('');
    }
}
