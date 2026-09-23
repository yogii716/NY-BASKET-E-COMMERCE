"""
NyBasket Comprehensive Automated Test Suite
Validates all backend models, database queries, REST API endpoints, and static routes.
"""

import sys
import os
import unittest
import json

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from backend.database import init_db, SessionLocal
from backend.seed_data import seed_database
from backend.app import app
from backend.models import User, Product, Customer, Order, OrderItem, Return

class TestNyBasketPlatform(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        seed_database()
        cls.client = app.test_client()

    def test_database_counts(self):
        db = SessionLocal()
        try:
            prod_count = db.query(Product).count()
            cust_count = db.query(Customer).count()
            order_count = db.query(Order).count()
            item_count = db.query(OrderItem).count()

            print(f"\n[DB Verification] Products: {prod_count}, Customers: {cust_count}, Orders: {order_count}, Items: {item_count}")
            self.assertGreaterEqual(prod_count, 100, "Should have at least 100 products")
            self.assertGreaterEqual(cust_count, 50, "Should have at least 50 customers")
            self.assertGreaterEqual(order_count, 200, "Should have at least 200 orders")
            self.assertGreaterEqual(item_count, 500, "Should have at least 500 order items")
        finally:
            db.close()

    def test_api_products(self):
        res = self.client.get('/api/products?limit=10')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertEqual(len(data['products']), 10)

    def test_api_product_details(self):
        res = self.client.get('/api/products/1')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertIn('product', data)
        self.assertIn('related_products', data)

    def test_api_analytics_summary(self):
        res = self.client.get('/api/analytics/summary')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertGreater(data['data']['total_revenue'], 0)
        self.assertGreater(data['data']['total_profit'], 0)
        print(f"[Analytics KPI] Revenue: INR {data['data']['total_revenue']:,.2f}, Profit: INR {data['data']['total_profit']:,.2f}")

    def test_api_analytics_sales(self):
        res = self.client.get('/api/analytics/sales')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertGreater(len(data['data']['monthly']), 0)
        self.assertGreater(len(data['data']['payment_methods']), 0)

    def test_api_analytics_categories(self):
        res = self.client.get('/api/analytics/categories')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertEqual(len(data['data']), 6)

    def test_api_analytics_customers(self):
        res = self.client.get('/api/analytics/customers')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertIn('summary', data['data'])
        self.assertIn('segment_distribution', data['data'])

    def test_api_analytics_insights(self):
        res = self.client.get('/api/analytics/insights')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertGreaterEqual(len(data['data']['ceo_insights']), 4)
        self.assertGreaterEqual(len(data['data']['cmo_insights']), 4)

    def test_api_auth_login(self):
        res = self.client.post('/api/auth/login', json={
            'email': 'admin@nybasket.com',
            'password': 'admin123'
        })
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertEqual(data['user']['role'], 'admin')

    def test_api_place_order(self):
        order_payload = {
            'customer': {
                'name': 'Test Buyer',
                'email': 'testbuyer@example.com',
                'phone': '+91 99999 88888',
                'city': 'Bengaluru',
                'state': 'Karnataka',
                'region': 'South'
            },
            'items': [
                {'product_id': 1, 'quantity': 2},
                {'product_id': 2, 'quantity': 1}
            ],
            'payment_method': 'UPI'
        }
        res = self.client.post('/api/orders', json=order_payload)
        self.assertEqual(res.status_code, 201)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertIn('order', data)
        self.assertGreater(data['order']['total_amount'], 0)
        print(f"[Order Test] Created Order #{data['order']['id']} with total INR {data['order']['total_amount']}")

    def test_static_pages_serve(self):
        pages = [
            'index.html',
            'products.html',
            'product-details.html',
            'cart.html',
            'checkout.html',
            'login.html',
            'register.html',
            'dashboard.html',
            'customers.html',
            'analytics.html'
        ]
        for page in pages:
            res = self.client.get(f'/{page}')
            self.assertEqual(res.status_code, 200, f"Page {page} should return 200 OK")
        print(f"[Static Pages] All {len(pages)} HTML pages served successfully with 200 OK.")

if __name__ == '__main__':
    unittest.main()
