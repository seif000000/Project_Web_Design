from flask import Flask, request, jsonify, send_from_directory, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS 
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from functools import wraps
import os
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bookstore.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['SECRET_KEY'] = 'your-secret-key-change-this-in-production'
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_PATH'] = '/'

# Create upload directories
os.makedirs('uploads/images', exist_ok=True)
os.makedirs('uploads/pdfs', exist_ok=True)

db = SQLAlchemy(app)

# FIXED: Configure CORS properly for credentials
# Allow specific origins instead of wildcard
ALLOWED_ORIGINS = [
    'http://localhost:5502',
    'http://127.0.0.1:5502',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:5504',
    'http://127.0.0.1:5504',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
]

CORS(app, 
     supports_credentials=True,
     resources={
         r"/api/*": {
             "origins": ALLOWED_ORIGINS,
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
             "expose_headers": ["Content-Type", "Set-Cookie"],
             "supports_credentials": True
         }
     })

# FIXED: Update after_request to handle origin properly
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    # Only allow CORS if origin is in allowed list
    if origin in ALLOWED_ORIGINS:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,X-Requested-With'
        response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
    return response

# Database Models
class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    users = db.relationship('User', backref='role', lazy=True)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)
    orders = db.relationship('Order', backref='user', lazy=True)

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    books = db.relationship('Book', backref='category', lazy=True)

class Book(db.Model):
    __tablename__ = 'books'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)
    image_url = db.Column(db.String(500))
    pdf_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    order_items = db.relationship('OrderItem', backref='book', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'description': self.description,
            'price': float(self.price) if self.price else 0.0,
            'category_id': self.category_id,
            'category_name': self.category.name if self.category else None,
            'image_url': self.image_url,
            'pdf_url': self.pdf_url,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(50), default='pending')
    total_price = db.Column(db.Numeric(10, 2))
    shipping_address = db.Column(db.Text)
    payment_status = db.Column(db.String(50), default='unpaid')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    items = db.relationship('OrderItem', backref='order', lazy=True)

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    price = db.Column(db.Numeric(10, 2), nullable=False)

# Initialize database
with app.app_context():
    db.create_all()
    
    if not Role.query.first():
        admin_role = Role(name='admin')
        user_role = Role(name='user')
        db.session.add(admin_role)
        db.session.add(user_role)
        db.session.commit()
    
    if not Category.query.first():
        categories = [
            Category(name='Novels & Stories', description='الروايات والقصص'),
            Category(name='Fantasy & Sci-Fi', description='الخيال والعلوم الغامضة'),
            Category(name='Movies & Art', description='السينما والفن')
        ]
        for cat in categories:
            db.session.add(cat)
        db.session.commit()

# Helper function to save uploaded files
def save_file(file, folder):
    if file and file.filename:
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
        filename = timestamp + filename
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], folder, filename)
        file.save(filepath)
        return f'uploads/{folder}/{filename}'
    return None

# Authentication decorators
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'success': False, 'message': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'success': False, 'message': 'Authentication required'}), 401
        user = User.query.get(session['user_id'])
        if not user or user.role.name != 'admin':
            return jsonify({'success': False, 'message': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

# API Routes - Authentication
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        
        if not username or not email or not password:
            return jsonify({'success': False, 'message': 'All fields are required'}), 400
        
        if len(password) < 8:
            return jsonify({'success': False, 'message': 'Password must be at least 8 characters'}), 400
        
        if User.query.filter_by(username=username).first():
            return jsonify({'success': False, 'message': 'Username already exists'}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({'success': False, 'message': 'Email already exists'}), 400
        
        user_role = Role.query.filter_by(name='user').first()
        if not user_role:
            return jsonify({'success': False, 'message': 'User role not found'}), 500
        
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, email=email, password=hashed_password, role_id=user_role.id)
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'User registered successfully. Please login.',
            'user': {
                'id': new_user.id,
                'username': new_user.username,
                'email': new_user.email,
                'role': new_user.role.name
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error registering user: {str(e)}'}), 400

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        
        if not email or not password:
            return jsonify({'success': False, 'message': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=email).first()
        
        if not user or not check_password_hash(user.password, password):
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
        
        session['user_id'] = user.id
        session['username'] = user.username
        session['role'] = user.role.name
        session.permanent = True
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role.name
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error logging in: {str(e)}'}), 400

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True, 'message': 'Logout successful'})

@app.route('/api/me', methods=['GET', 'OPTIONS'])
def get_current_user():
    if request.method == 'OPTIONS':
        return jsonify({})
    
    if 'user_id' not in session:
        return jsonify({'success': False, 'authenticated': False}), 401
    
    user = User.query.get(session['user_id'])
    if not user:
        session.clear()
        return jsonify({'success': False, 'authenticated': False}), 401
    
    return jsonify({
        'success': True,
        'authenticated': True,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role.name
        }
    })

# API Routes - Books
@app.route('/api/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    return jsonify([book.to_dict() for book in books])

@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = Book.query.get_or_404(book_id)
    return jsonify(book.to_dict())

@app.route('/api/books', methods=['POST'])
@admin_required
def create_book():
    try:
        data = request.form
        
        image_file = request.files.get('cover')
        pdf_file = request.files.get('pdf')
        
        image_url = save_file(image_file, 'images') if image_file else None
        pdf_url = save_file(pdf_file, 'pdfs') if pdf_file else None
        
        category_name = data.get('category', '').strip()
        category = None
        if category_name:
            category = Category.query.filter_by(name=category_name).first()
            if not category:
                category = Category(name=category_name, description='')
                db.session.add(category)
                db.session.commit()
        
        book = Book(
            title=data.get('title', '').strip(),
            author=data.get('author', '').strip(),
            description=data.get('description', '').strip(),
            price=float(data.get('price', 0)),
            category_id=category.id if category else None,
            image_url=image_url,
            pdf_url=pdf_url
        )
        
        db.session.add(book)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Book created successfully', 'book': book.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error creating book: {str(e)}'}), 400

@app.route('/api/books/<int:book_id>', methods=['PUT'])
@admin_required
def update_book(book_id):
    try:
        book = Book.query.get_or_404(book_id)
        data = request.form
        
        if 'title' in data:
            book.title = data['title'].strip()
        if 'author' in data:
            book.author = data['author'].strip()
        if 'description' in data:
            book.description = data['description'].strip()
        if 'price' in data:
            book.price = float(data['price'])
        
        if 'category' in data:
            category_name = data['category'].strip()
            if category_name:
                category = Category.query.filter_by(name=category_name).first()
                if not category:
                    category = Category(name=category_name, description='')
                    db.session.add(category)
                    db.session.commit()
                book.category_id = category.id
        
        if 'cover' in request.files:
            image_file = request.files['cover']
            if image_file and image_file.filename:
                if book.image_url and os.path.exists(book.image_url):
                    os.remove(book.image_url)
                book.image_url = save_file(image_file, 'images')
        
        if 'pdf' in request.files:
            pdf_file = request.files['pdf']
            if pdf_file and pdf_file.filename:
                if book.pdf_url and os.path.exists(book.pdf_url):
                    os.remove(book.pdf_url)
                book.pdf_url = save_file(pdf_file, 'pdfs')
        
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Book updated successfully', 'book': book.to_dict()})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error updating book: {str(e)}'}), 400

@app.route('/api/books/<int:book_id>', methods=['DELETE'])
@admin_required
def delete_book(book_id):
    try:
        book = Book.query.get_or_404(book_id)
        
        if book.image_url and os.path.exists(book.image_url):
            os.remove(book.image_url)
        if book.pdf_url and os.path.exists(book.pdf_url):
            os.remove(book.pdf_url)
        
        db.session.delete(book)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Book deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error deleting book: {str(e)}'}), 400

@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([{'id': cat.id, 'name': cat.name, 'description': cat.description} for cat in categories])

# API Routes - Orders
@app.route('/api/orders', methods=['POST'])
@login_required
def create_order():
    try:
        data = request.get_json()
        
        user_id = session['user_id']
        items = data.get('items', [])
        shipping_address = data.get('shipping_address', '').strip()
        total_price = data.get('total_price', 0)
        
        if not items or len(items) == 0:
            return jsonify({'success': False, 'message': 'Order must contain at least one item'}), 400
        
        new_order = Order(
            user_id=user_id,
            status='pending',
            total_price=float(total_price),
            shipping_address=shipping_address,
            payment_status='unpaid'
        )
        
        db.session.add(new_order)
        db.session.flush()
        
        for item in items:
            order_item = OrderItem(
                order_id=new_order.id,
                book_id=item['book_id'],
                quantity=item.get('quantity', 1),
                price=float(item.get('price', 0))
            )
            db.session.add(order_item)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Order created successfully',
            'order': {
                'id': new_order.id,
                'user_id': new_order.user_id,
                'status': new_order.status,
                'total_price': float(new_order.total_price),
                'items_count': len(items)
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error creating order: {str(e)}'}), 400

@app.route('/api/orders', methods=['GET'])
@login_required
def get_user_orders():
    try:
        user_id = session['user_id']
        user = User.query.get(user_id)
        
        if user.role.name == 'admin':
            orders = Order.query.all()
        else:
            orders = Order.query.filter_by(user_id=user_id).all()
        
        orders_list = []
        for order in orders:
            order_dict = {
                'id': order.id,
                'user_id': order.user_id,
                'username': order.user.username if order.user else 'Unknown',
                'status': order.status,
                'total_price': float(order.total_price) if order.total_price else 0,
                'shipping_address': order.shipping_address,
                'payment_status': order.payment_status,
                'created_at': order.created_at.isoformat() if order.created_at else None,
                'items': []
            }
            
            for item in order.items:
                order_dict['items'].append({
                    'id': item.id,
                    'book_id': item.book_id,
                    'book_title': item.book.title if item.book else 'Unknown',
                    'quantity': item.quantity,
                    'price': float(item.price) if item.price else 0
                })
            
            orders_list.append(order_dict)
        
        return jsonify(orders_list)
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error fetching orders: {str(e)}'}), 400

@app.route('/api/orders/<int:order_id>', methods=['GET'])
@login_required
def get_order(order_id):
    try:
        order = Order.query.get_or_404(order_id)
        user_id = session['user_id']
        user = User.query.get(user_id)
        
        if user.role.name != 'admin' and order.user_id != user_id:
            return jsonify({'success': False, 'message': 'Access denied'}), 403
        
        order_dict = {
            'id': order.id,
            'user_id': order.user_id,
            'username': order.user.username if order.user else 'Unknown',
            'status': order.status,
            'total_price': float(order.total_price) if order.total_price else 0,
            'shipping_address': order.shipping_address,
            'payment_status': order.payment_status,
            'created_at': order.created_at.isoformat() if order.created_at else None,
            'items': []
        }
        
        for item in order.items:
            order_dict['items'].append({
                'id': item.id,
                'book_id': item.book_id,
                'book_title': item.book.title if item.book else 'Unknown',
                'book_author': item.book.author if item.book else 'Unknown',
                'quantity': item.quantity,
                'price': float(item.price) if item.price else 0
            })
        
        return jsonify(order_dict)
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error fetching order: {str(e)}'}), 400

@app.route('/api/orders/<int:order_id>/status', methods=['PUT'])
@admin_required
def update_order_status(order_id):
    try:
        order = Order.query.get_or_404(order_id)
        data = request.get_json()
        
        new_status = data.get('status', '').strip()
        if new_status:
            order.status = new_status
        
        payment_status = data.get('payment_status', '').strip()
        if payment_status:
            order.payment_status = payment_status
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Order status updated successfully',
            'order': {'id': order.id, 'status': order.status, 'payment_status': order.payment_status}
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error updating order: {str(e)}'}), 400

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)