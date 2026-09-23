"""
NyBasket – E-Commerce Sales & Customer Analytics Platform
Main Flask Application & REST API Gateway
"""

import os
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
from sqlalchemy import or_, desc, asc

from .database import engine, init_db, SessionLocal
from .models import User, Product, Customer, Order, OrderItem, Return
from .auth import hash_password, authenticate_user, create_user
from .analytics import (
    get_kpi_summary,
    get_sales_trends,
    get_category_analytics,
    get_product_analytics,
    get_customer_analytics,
    get_return_and_cancellation_analytics,
    get_inventory_analytics,
    get_regional_analytics,
    get_business_insights
)

# Base Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

app = Flask(
    __name__,
    static_folder=FRONTEND_DIR,
    static_url_path=""
)
CORS(app)


# -------------------------------------------------------------
# Frontend Static Page Routes
# -------------------------------------------------------------
@app.route("/")
def index_page():
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.route("/<path:path>")
def serve_frontend_page(path):
    # If path directly exists in frontend dir (like css/style.css, js/app.js)
    full_path = os.path.join(FRONTEND_DIR, path)
    if os.path.isfile(full_path):
        return send_from_directory(FRONTEND_DIR, path)
    
    # If path is a page name without .html extension (e.g. /products -> products.html)
    html_candidate = f"{path}.html"
    if os.path.isfile(os.path.join(FRONTEND_DIR, html_candidate)):
        return send_from_directory(FRONTEND_DIR, html_candidate)
        
    return send_from_directory(FRONTEND_DIR, "index.html")


# -------------------------------------------------------------
# Authentication Endpoints
# -------------------------------------------------------------
@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    confirm_password = data.get("confirm_password")

    if not name or not email or not password:
        return jsonify({"success": False, "error": "Name, email, and password are required."}), 400

    if confirm_password and password != confirm_password:
        return jsonify({"success": False, "error": "Passwords do not match."}), 400

    db = SessionLocal()
    try:
        user, err = create_user(db, name, email, password, role="customer")
        if err:
            return jsonify({"success": False, "error": err}), 400
        return jsonify({
            "success": True,
            "message": "Account created successfully!",
            "user": user.to_dict()
        }), 201
    finally:
        db.close()


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "error": "Email and password are required."}), 400

    db = SessionLocal()
    try:
        user, err = authenticate_user(db, email, password)
        if err:
            return jsonify({"success": False, "error": err}), 401
        return jsonify({
            "success": True,
            "message": f"Welcome back, {user.name}!",
            "user": user.to_dict()
        }), 200
    finally:
        db.close()


# -------------------------------------------------------------
# Product Endpoints
# -------------------------------------------------------------
@app.route("/api/products", methods=["GET"])
def get_products():
    db = SessionLocal()
    try:
        query = db.query(Product)

        # Category filter
        category = request.args.get("category")
        if category and category.lower() != "all":
            query = query.filter(Product.category.ilike(category))

        # Search filter
        search = request.args.get("search")
        if search:
            search_pattern = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    Product.name.ilike(search_pattern),
                    Product.description.ilike(search_pattern),
                    Product.category.ilike(search_pattern)
                )
            )

        # Price range filter
        min_price = request.args.get("min_price", type=float)
        max_price = request.args.get("max_price", type=float)
        if min_price is not None:
            query = query.filter(Product.price >= min_price)
        if max_price is not None:
            query = query.filter(Product.price <= max_price)

        # Rating filter
        min_rating = request.args.get("rating", type=float)
        if min_rating is not None:
            query = query.filter(Product.rating >= min_rating)

        # Stock status filter
        stock_filter = request.args.get("stock")
        if stock_filter == "in_stock":
            query = query.filter(Product.stock > 0)

        # Sorting
        sort_by = request.args.get("sort_by", "featured")
        if sort_by == "price_asc":
            query = query.order_by(asc(Product.price))
        elif sort_by == "price_desc":
            query = query.order_by(desc(Product.price))
        elif sort_by == "rating":
            query = query.order_by(desc(Product.rating))
        elif sort_by == "popularity":
            query = query.order_by(desc(Product.review_count))
        elif sort_by == "newest":
            query = query.order_by(desc(Product.created_at))
        else:
            query = query.order_by(desc(Product.rating), desc(Product.review_count))

        # Total count before pagination
        total_count = query.count()

        # Pagination
        page = request.args.get("page", 1, type=int)
        limit = request.args.get("limit", 24, type=int)
        offset = (page - 1) * limit
        products = query.offset(offset).limit(limit).all()

        return jsonify({
            "success": True,
            "total": total_count,
            "page": page,
            "limit": limit,
            "products": [p.to_dict() for p in products]
        })
    finally:
        db.close()


@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product_details(product_id):
    db = SessionLocal()
    try:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            return jsonify({"success": False, "error": "Product not found."}), 404

        # Related products in same category
        related = (
            db.query(Product)
            .filter(Product.category == product.category, Product.id != product.id)
            .limit(4)
            .all()
        )

        return jsonify({
            "success": True,
            "product": product.to_dict(),
            "related_products": [r.to_dict() for r in related]
        })
    finally:
        db.close()


@app.route("/api/products", methods=["POST"])
def create_new_product():
    data = request.get_json() or {}
    name = data.get("name")
    category = data.get("category")
    price = data.get("price")
    cost = data.get("cost")
    stock = data.get("stock", 20)
    description = data.get("description", "")
    image_url = data.get("image_url", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600")

    if not name or not category or price is None or cost is None:
        return jsonify({"success": False, "error": "Name, category, price, and cost are required."}), 400

    db = SessionLocal()
    try:
        product = Product(
            name=name.strip(),
            category=category.strip(),
            description=description.strip(),
            price=float(price),
            cost=float(cost),
            stock=int(stock),
            rating=4.5,
            review_count=1,
            image_url=image_url
        )
        db.add(product)
        db.commit()
        db.refresh(product)
        return jsonify({"success": True, "product": product.to_dict()}), 201
    finally:
        db.close()


# -------------------------------------------------------------
# Customer Endpoints
# -------------------------------------------------------------
@app.route("/api/customers", methods=["GET"])
def get_customers():
    db = SessionLocal()
    try:
        query = db.query(Customer)
        search = request.args.get("search")
        if search:
            pattern = f"%{search.strip()}%"
            query = query.filter(or_(Customer.name.ilike(pattern), Customer.email.ilike(pattern), Customer.city.ilike(pattern)))

        segment = request.args.get("segment")
        if segment and segment.lower() != "all":
            query = query.filter(Customer.customer_type == segment)

        customers = query.all()
        return jsonify({
            "success": True,
            "total": len(customers),
            "customers": [c.to_dict() for c in customers]
        })
    finally:
        db.close()


@app.route("/api/customers/<int:customer_id>", methods=["GET"])
def get_customer_details(customer_id):
    db = SessionLocal()
    try:
        customer = db.query(Customer).filter(Customer.id == customer_id).first()
        if not customer:
            return jsonify({"success": False, "error": "Customer not found."}), 404

        orders = db.query(Order).filter(Order.customer_id == customer.id).order_by(desc(Order.order_date)).all()

        return jsonify({
            "success": True,
            "customer": customer.to_dict(),
            "orders": [o.to_dict() for o in orders]
        })
    finally:
        db.close()


@app.route("/api/customers", methods=["POST"])
def create_new_customer():
    data = request.get_json() or {}
    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone", "")
    city = data.get("city", "Mumbai")
    state = data.get("state", "Maharashtra")
    region = data.get("region", "West")

    if not name or not email:
        return jsonify({"success": False, "error": "Name and email are required."}), 400

    db = SessionLocal()
    try:
        existing = db.query(Customer).filter_by(email=email.strip().lower()).first()
        if existing:
            return jsonify({"success": True, "customer": existing.to_dict()}), 200

        customer = Customer(
            name=name.strip(),
            email=email.strip().lower(),
            phone=phone.strip(),
            city=city.strip(),
            state=state.strip(),
            region=region.strip(),
            customer_type="New Customer"
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)
        return jsonify({"success": True, "customer": customer.to_dict()}), 201
    finally:
        db.close()


# -------------------------------------------------------------
# Order Management Endpoints
# -------------------------------------------------------------
@app.route("/api/orders", methods=["GET"])
def get_orders():
    db = SessionLocal()
    try:
        limit = request.args.get("limit", 50, type=int)
        orders = db.query(Order).order_by(desc(Order.order_date)).limit(limit).all()
        return jsonify({
            "success": True,
            "orders": [o.to_dict() for o in orders]
        })
    finally:
        db.close()


@app.route("/api/orders/<int:order_id>", methods=["GET"])
def get_order_details(order_id):
    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return jsonify({"success": False, "error": "Order not found."}), 404

        items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
        return jsonify({
            "success": True,
            "order": order.to_dict(),
            "items": [item.to_dict() for item in items]
        })
    finally:
        db.close()


@app.route("/api/orders", methods=["POST"])
def place_order():
    """
    Checkout & Order creation endpoint.
    Handles customer creation/matching, stock deduction, profit calculation, and order persistence.
    """
    data = request.get_json() or {}
    items_data = data.get("items", [])
    customer_info = data.get("customer", {})
    payment_method = data.get("payment_method", "Demo Payment")

    if not items_data:
        return jsonify({"success": False, "error": "Order must contain at least one item."}), 400

    cust_name = customer_info.get("name", "Guest Customer")
    cust_email = customer_info.get("email", "guest@nybasket.com").strip().lower()
    cust_phone = customer_info.get("phone", "")
    cust_city = customer_info.get("city", "Mumbai")
    cust_state = customer_info.get("state", "Maharashtra")
    cust_region = customer_info.get("region", "West")

    db = SessionLocal()
    try:
        # Find or create customer
        customer = db.query(Customer).filter_by(email=cust_email).first()
        if not customer:
            customer = Customer(
                name=cust_name,
                email=cust_email,
                phone=cust_phone,
                city=cust_city,
                state=cust_state,
                region=cust_region,
                customer_type="New Customer"
            )
            db.add(customer)
            db.flush()

        order_total_amount = 0.0
        order_total_cost = 0.0
        order_total_profit = 0.0

        new_order = Order(
            customer_id=customer.id,
            order_date=datetime.utcnow(),
            total_amount=0.0,
            total_cost=0.0,
            total_profit=0.0,
            payment_method=payment_method,
            status="Completed",
            shipping_city=cust_city,
            shipping_state=cust_state,
            region=cust_region
        )
        db.add(new_order)
        db.flush()

        order_items_created = []
        for item in items_data:
            p_id = item.get("product_id") or item.get("id")
            qty = max(1, int(item.get("quantity", 1)))
            product = db.query(Product).filter(Product.id == p_id).first()
            if not product:
                continue

            unit_price = product.price
            unit_cost = product.cost
            item_total = unit_price * qty
            item_cost = unit_cost * qty
            item_profit = item_total - item_cost

            # Deduct stock if available
            if product.stock >= qty:
                product.stock -= qty
            else:
                product.stock = 0

            order_item = OrderItem(
                order_id=new_order.id,
                product_id=product.id,
                quantity=qty,
                unit_price=unit_price,
                unit_cost=unit_cost,
                total_price=item_total,
                profit=item_profit
            )
            db.add(order_item)
            order_items_created.append(order_item)

            order_total_amount += item_total
            order_total_cost += item_cost
            order_total_profit += item_profit

        # Final order update
        new_order.total_amount = round(order_total_amount, 2)
        new_order.total_cost = round(order_total_cost, 2)
        new_order.total_profit = round(order_total_profit, 2)

        # Update customer type based on order count
        past_orders_count = db.query(Order).filter(Order.customer_id == customer.id).count()
        if past_orders_count >= 5:
            customer.customer_type = "VIP Customer"
        elif past_orders_count >= 2:
            customer.customer_type = "Regular Customer"
        else:
            customer.customer_type = "New Customer"

        db.commit()

        return jsonify({
            "success": True,
            "message": "Order placed successfully!",
            "order": new_order.to_dict(),
            "items": [item.to_dict() for item in order_items_created]
        }), 201
    except Exception as e:
        db.rollback()
        return jsonify({"success": False, "error": f"Failed to process order: {str(e)}"}), 500
    finally:
        db.close()


# -------------------------------------------------------------
# Analytics & BI Endpoints
# -------------------------------------------------------------
@app.route("/api/analytics/summary", methods=["GET"])
def analytics_summary():
    data = get_kpi_summary()
    return jsonify({"success": True, "data": data})

@app.route("/api/analytics/sales", methods=["GET"])
def analytics_sales():
    data = get_sales_trends()
    return jsonify({"success": True, "data": data})

@app.route("/api/analytics/categories", methods=["GET"])
def analytics_categories():
    data = get_category_analytics()
    return jsonify({"success": True, "data": data})

@app.route("/api/analytics/products", methods=["GET"])
def analytics_products():
    data = get_product_analytics()
    return jsonify({"success": True, "data": data})

@app.route("/api/analytics/customers", methods=["GET"])
def analytics_customers():
    data = get_customer_analytics()
    return jsonify({"success": True, "data": data})

@app.route("/api/analytics/returns", methods=["GET"])
def analytics_returns():
    data = get_return_and_cancellation_analytics()
    return jsonify({"success": True, "data": data})

@app.route("/api/analytics/inventory", methods=["GET"])
def analytics_inventory():
    data = get_inventory_analytics()
    return jsonify({"success": True, "data": data})

@app.route("/api/analytics/regions", methods=["GET"])
def analytics_regions():
    data = get_regional_analytics()
    return jsonify({"success": True, "data": data})

@app.route("/api/analytics/insights", methods=["GET"])
def analytics_insights():
    data = get_business_insights()
    return jsonify({"success": True, "data": data})


# -------------------------------------------------------------
# Global Error Handlers
# -------------------------------------------------------------
@app.errorhandler(404)
def not_found_error(error):
    if request.path.startswith("/api/"):
        return jsonify({"success": False, "error": "Requested API resource was not found."}), 404
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.errorhandler(500)
def internal_error(error):
    if request.path.startswith("/api/"):
        return jsonify({"success": False, "error": "Internal server error occurred."}), 500
    return jsonify({"success": False, "error": "An unexpected server error occurred."}), 500


if __name__ == "__main__":
    init_db()
    app.run(host="127.0.0.1", port=5000, debug=True)
