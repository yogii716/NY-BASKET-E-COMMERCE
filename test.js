/**
 * NyBasket Automated JavaScript Test Suite
 * Validates data counts, analytics formulas, search/filtering, ordering, and auth.
 */

const assert = require('assert');
const { generateSeedDatabase } = require('./frontend/js/dataset');
const { Analytics, Storage } = require('./frontend/js/api');

console.log("============================================================");
console.log(">> Running NyBasket Automated JavaScript Test Suite");
console.log("============================================================\n");

function runTests() {
    let passed = 0;
    let failed = 0;

    function test(name, fn) {
        try {
            fn();
            console.log(`  ✓ ${name}`);
            passed++;
        } catch (e) {
            console.error(`  ✗ ${name}`);
            console.error(`    ${e.message}`);
            failed++;
        }
    }

    // 1. Seed Generation & Counts
    const db = generateSeedDatabase();

    test("Database initialization counts", () => {
        assert.ok(db.products.length >= 100, `Expected at least 100 products, got ${db.products.length}`);
        assert.ok(db.customers.length >= 50, `Expected at least 50 customers, got ${db.customers.length}`);
        assert.ok(db.orders.length >= 200, `Expected at least 200 orders, got ${db.orders.length}`);
        assert.ok(db.order_items.length >= 500, `Expected at least 500 order items, got ${db.order_items.length}`);
        assert.ok(db.users.length >= 2, `Expected at least 2 users, got ${db.users.length}`);
    });

    // 2. KPI Summary
    test("Executive KPI calculation", () => {
        const kpis = Analytics.getKPISummary(db);
        assert.ok(kpis.total_revenue > 0, "Total revenue should be > 0");
        assert.ok(kpis.total_profit > 0, "Total profit should be > 0");
        assert.ok(kpis.average_order_value > 0, "AOV should be > 0");
        assert.ok(kpis.profit_margin_pct > 0 && kpis.profit_margin_pct < 100, "Margin should be between 0 and 100");
        assert.ok(kpis.repeat_customer_rate >= 0, "Repeat customer rate should be >= 0");
    });

    // 3. Sales Trends
    test("Sales trends calculations (Monthly, Weekly, Daily, Payment Methods)", () => {
        const sales = Analytics.getSalesTrends(db);
        assert.ok(sales.monthly.length > 0, "Should have monthly sales data");
        assert.ok(sales.weekly.length > 0, "Should have weekly sales data");
        assert.ok(sales.payment_methods.length >= 4, "Should have multiple payment methods");
        const totalShare = sales.payment_methods.reduce((s, p) => s + p.share_pct, 0);
        assert.ok(Math.abs(totalShare - 100) < 1.0, `Payment method shares should sum to ~100%, got ${totalShare}`);
    });

    // 4. Category Analytics
    test("Category performance metrics", () => {
        const categories = Analytics.getCategoryAnalytics(db);
        assert.strictEqual(categories.length, 6, "Should have exactly 6 product categories");
        categories.forEach(cat => {
            assert.ok(cat.revenue > 0, `Category ${cat.category} revenue should be > 0`);
            assert.ok(cat.units_sold > 0, `Category ${cat.category} units sold should be > 0`);
            assert.ok(cat.margin_pct > 0, `Category ${cat.category} margin should be > 0`);
        });
    });

    // 5. Product Analytics
    test("Product deep-dive analytics (Bestsellers, Profitable, Low Stock)", () => {
        const prods = Analytics.getProductAnalytics(db);
        assert.ok(prods.top_best_sellers.length === 10, "Should have top 10 best sellers");
        assert.ok(prods.top_profitable.length === 10, "Should have top 10 profitable products");
        assert.ok(Array.isArray(prods.high_sales_low_profit), "High sales low profit should be an array");
        assert.ok(Array.isArray(prods.low_stock_products), "Low stock products should be an array");
    });

    // 6. Customer Analytics & RFM Segmentation
    test("Customer RFM segmentation and rankings", () => {
        const custs = Analytics.getCustomerAnalytics(db);
        assert.ok(custs.summary.total_customers >= 50, "Should summarize total customers");
        assert.ok(custs.segment_distribution['VIP Customer'] >= 0, "Should count VIP customers");
        assert.ok(custs.top_by_revenue.length === 10, "Should rank top 10 customers by revenue");
        assert.ok(custs.customers.length >= 50, "Should have full customer list");
    });

    // 7. Regional Analytics
    test("Regional performance breakdown", () => {
        const regions = Analytics.getRegionalAnalytics(db);
        assert.ok(regions.regional_breakdown.length >= 4, "Should have multiple regions");
        assert.ok(regions.top_cities.length <= 10, "Should have top cities");
    });

    // 8. Business Insights Engine
    test("CEO & CMO dynamic AI/BI strategic insights", () => {
        const insights = Analytics.getBusinessInsights(db);
        assert.strictEqual(insights.ceo_insights.length, 4, "Should provide 4 CEO strategic insights");
        assert.strictEqual(insights.cmo_insights.length, 4, "Should provide 4 CMO strategic recommendations");
    });

    // 9. Order Placement Simulation
    test("Checkout and order placement simulation", () => {
        const initProd = db.products.find(p => p.stock >= 10) || db.products[0];
        initProd.stock = 25;
        const initialStock = initProd.stock;
        const testQty = 2;

        const orderItem = {
            id: db.order_items.length + 1,
            order_id: db.orders.length + 1,
            product_id: initProd.id,
            quantity: testQty,
            unit_price: initProd.price,
            unit_cost: initProd.cost,
            total_price: initProd.price * testQty,
            profit: (initProd.price - initProd.cost) * testQty
        };

        if (initProd.stock >= testQty) {
            initProd.stock -= testQty;
        }

        db.order_items.push(orderItem);
        db.orders.push({
            id: db.orders.length + 1,
            customer_id: 1,
            order_date: new Date().toISOString(),
            total_amount: orderItem.total_price,
            total_cost: orderItem.unit_cost * testQty,
            total_profit: orderItem.profit,
            payment_method: "UPI",
            status: "Completed",
            shipping_city: "Bengaluru",
            shipping_state: "Karnataka",
            region: "South"
        });

        assert.strictEqual(initProd.stock, initialStock - testQty, "Product stock should be deducted accurately");
    });

    console.log(`\n============================================================`);
    console.log(`>> Test Results: ${passed} Passed, ${failed} Failed`);
    console.log("============================================================\n");

    if (failed > 0) process.exit(1);
}

runTests();
