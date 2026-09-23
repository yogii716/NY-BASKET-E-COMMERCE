"""
NyBasket E-Commerce & Analytics Platform
Database Models using SQLAlchemy ORM
"""

from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, DateTime, ForeignKey, Text
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class User(Base):
    """User authentication and profile model."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="customer")  # 'admin' or 'customer'
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None
        }


class Product(Base):
    """Product catalog model with pricing, inventory and metrics."""
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False, index=True)
    category = Column(String(80), nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)        # Selling price (₹)
    cost = Column(Float, nullable=False)         # Cost price (₹)
    stock = Column(Integer, default=50)          # Current inventory count
    rating = Column(Float, default=4.5)          # Average rating (1.0 to 5.0)
    review_count = Column(Integer, default=0)    # Number of customer reviews
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    order_items = relationship("OrderItem", back_populates="product", cascade="all, delete-orphan")
    returns = relationship("Return", back_populates="product")

    def to_dict(self):
        # Calculate profit margin percentage
        margin_pct = round(((self.price - self.cost) / self.price * 100), 1) if self.price > 0 else 0.0
        stock_status = "In Stock" if self.stock > 10 else ("Low Stock" if self.stock > 0 else "Out of Stock")

        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "price": round(self.price, 2),
            "cost": round(self.cost, 2),
            "margin_pct": margin_pct,
            "stock": self.stock,
            "stock_status": stock_status,
            "rating": round(self.rating, 1),
            "review_count": self.review_count,
            "image_url": self.image_url,
            "created_at": self.created_at.strftime("%Y-%m-%d") if self.created_at else None
        }


class Customer(Base):
    """Customer profile and demographic data."""
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=True)
    city = Column(String(80), nullable=False)
    state = Column(String(80), nullable=False)
    region = Column(String(50), nullable=False, default="North")  # North, South, East, West, Central
    customer_type = Column(String(50), default="New Customer")    # New, Returning / Regular, VIP Customer, At Risk
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    orders = relationship("Order", back_populates="customer", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "city": self.city,
            "state": self.state,
            "region": self.region,
            "customer_type": self.customer_type,
            "created_at": self.created_at.strftime("%Y-%m-%d") if self.created_at else None
        }


class Order(Base):
    """Order transaction records."""
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
    order_date = Column(DateTime, default=datetime.utcnow, index=True)
    total_amount = Column(Float, nullable=False, default=0.0)
    total_cost = Column(Float, nullable=False, default=0.0)
    total_profit = Column(Float, nullable=False, default=0.0)
    payment_method = Column(String(50), default="UPI")  # UPI, Credit Card, Debit Card, Cash on Delivery, Demo Payment
    status = Column(String(50), default="Completed")    # Completed, Processing, Shipped, Cancelled, Returned
    shipping_city = Column(String(80), nullable=True)
    shipping_state = Column(String(80), nullable=True)
    region = Column(String(50), default="North")

    # Relationships
    customer = relationship("Customer", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    returns = relationship("Return", back_populates="order", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "customer_name": self.customer.name if self.customer else "Guest",
            "customer_email": self.customer.email if self.customer else "",
            "order_date": self.order_date.strftime("%Y-%m-%d %H:%M:%S") if self.order_date else None,
            "total_amount": round(self.total_amount, 2),
            "total_cost": round(self.total_cost, 2),
            "total_profit": round(self.total_profit, 2),
            "payment_method": self.payment_method,
            "status": self.status,
            "shipping_city": self.shipping_city,
            "shipping_state": self.shipping_state,
            "region": self.region,
            "items_count": len(self.items) if self.items else 0
        }


class OrderItem(Base):
    """Line items inside an order."""
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Float, nullable=False)
    unit_cost = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    profit = Column(Float, nullable=False)

    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "product_name": self.product.name if self.product else "Unknown",
            "category": self.product.category if self.product else "General",
            "quantity": self.quantity,
            "unit_price": round(self.unit_price, 2),
            "unit_cost": round(self.unit_cost, 2),
            "total_price": round(self.total_price, 2),
            "profit": round(self.profit, 2)
        }


class Return(Base):
    """Customer returns and refund tracking."""
    __tablename__ = "returns"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    reason = Column(String(200), nullable=False)  # Defective Item, Wrong Size, Changed Mind, Delayed Delivery, Quality Issue
    return_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50), default="Approved")  # Approved, Refunded, Rejected

    # Relationships
    order = relationship("Order", back_populates="returns")
    product = relationship("Product", back_populates="returns")

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "product_name": self.product.name if self.product else "Unknown",
            "category": self.product.category if self.product else "General",
            "reason": self.reason,
            "return_date": self.return_date.strftime("%Y-%m-%d") if self.return_date else None,
            "status": self.status
        }
