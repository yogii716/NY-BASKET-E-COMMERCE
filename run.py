"""
NyBasket – E-Commerce Sales & Customer Analytics Platform
Root Application Launcher
"""

import sys
import os

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from backend.database import init_db
from backend.seed_data import seed_database
from backend.app import app

if __name__ == "__main__":
    print("=" * 60)
    print(">> Starting NyBasket - E-Commerce & Analytics Platform")
    print("=" * 60)
    
    # 1. Initialize SQLite Database & seed with realistic data if needed
    init_db()
    seed_database()
    
    print("\n* NyBasket Web Application is live at:")
    print("   -> http://127.0.0.1:5000/")
    print("   -> http://localhost:5000/")
    print("\n* Key Pages Available:")
    print("   - Storefront Home:     http://127.0.0.1:5000/index.html")
    print("   - Product Catalog:     http://127.0.0.1:5000/products.html")
    print("   - Shopping Cart:       http://127.0.0.1:5000/cart.html")
    print("   - Executive Dashboard: http://127.0.0.1:5000/dashboard.html")
    print("   - Customer Analytics:  http://127.0.0.1:5000/customers.html")
    print("   - Deep-Dive Analytics: http://127.0.0.1:5000/analytics.html")
    print("=" * 60 + "\n")
    
    # 2. Run Flask App
    app.run(host="127.0.0.1", port=5000, debug=True)
