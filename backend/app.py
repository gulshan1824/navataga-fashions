import csv
import io
import os
import urllib.request
from datetime import datetime
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(BASE_DIR, "store.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

SHEET_CSV_URL = (
    "https://docs.google.com/spreadsheets/d/"
    "1n_WmpoRnb_YihafcAzVDR4lJOct2hN7LlFxIPuxS4WM"
    "/export?format=csv&gid=0"
)

db = SQLAlchemy(app)
CORS(app, origins=["http://localhost:5173"])


class Product(db.Model):
    """Columns map 1-to-1 with the Google Sheet."""
    id = db.Column(db.Integer, primary_key=True)
    article_id = db.Column(db.String(50), nullable=True, index=True)
    name = db.Column(db.String(200), nullable=False)          # Sheet: Name
    colour = db.Column(db.String(100), nullable=True)         # Sheet: Colour
    design_pattern = db.Column(db.String(300), nullable=True) # Sheet: Design Pattern
    price = db.Column(db.Float, nullable=False)               # Sheet: Price
    available = db.Column(db.Boolean, default=True)           # Sheet: Available
    category = db.Column(db.String(100), nullable=True)       # Sheet: Category
    image_url = db.Column(db.String(500), nullable=True)      # Sheet: Photo
    synced_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "article_id": self.article_id,
            "name": self.name,
            "colour": self.colour,
            "design_pattern": self.design_pattern,
            "price": self.price,
            "available": self.available,
            "category": self.category,
            "image_url": self.image_url,
            "synced_at": self.synced_at.isoformat() if self.synced_at else None,
        }


import re as _re

def _normalise_image_url(raw: str) -> str | None:
    """
    Accept any of these Photo column formats and return a usable image URL:
      - Plain https:// URL             → returned as-is
      - Google Drive view link         → converted to direct download URL
        https://drive.google.com/file/d/<ID>/view?...
      - Google Drive open link
        https://drive.google.com/open?id=<ID>
      - Google Photos share link       → returned as-is (browser can load it)
    """
    raw = raw.strip()
    if not raw:
        return None

    # Google Drive /file/d/<ID>/...
    m = _re.search(r'drive\.google\.com/file/d/([A-Za-z0-9_-]+)', raw)
    if m:
        return f"https://drive.google.com/uc?export=view&id={m.group(1)}"

    # Google Drive open?id=<ID>
    m = _re.search(r'drive\.google\.com/open\?id=([A-Za-z0-9_-]+)', raw)
    if m:
        return f"https://drive.google.com/uc?export=view&id={m.group(1)}"

    # Any other http/https URL — use directly
    if raw.startswith('http'):
        return raw

    return None


def _parse_row(row: dict) -> dict | None:
    """Map one CSV row to a Product dict. Returns None for blank rows."""
    article_id = str(row.get('Article_ID', '')).strip()
    if not article_id:
        return None

    raw_name = str(row.get('Name', '')).strip().title()
    raw_colour = str(row.get('Colour', '')).strip().title()
    design_pattern = str(row.get('Design Pattern', '')).strip()
    category = str(row.get('Category', '')).strip().title()

    try:
        price = float(str(row.get('Price', 0)).replace(',', '').strip() or 0)
    except ValueError:
        price = 0.0

    available = str(row.get('Available', '')).strip().lower() == 'yes'

    photo = str(row.get('Photo', '')).strip()
    image_url = _normalise_image_url(photo) if photo else None

    return {
        "article_id": article_id,
        "name": raw_name,
        "colour": raw_colour or None,
        "design_pattern": design_pattern or None,
        "price": price,
        "available": available,
        "category": category or None,
        "image_url": image_url,
    }


def _do_sync() -> dict:
    """Fetch sheet CSV and upsert into DB. Returns result summary."""
    req = urllib.request.Request(SHEET_CSV_URL, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as resp:
        raw = resp.read().decode('utf-8')

    reader = csv.DictReader(io.StringIO(raw))
    rows = [r for r in (_parse_row(row) for row in reader) if r is not None]

    added, updated = 0, 0
    now = datetime.utcnow()
    for data in rows:
        existing = Product.query.filter_by(article_id=data['article_id']).first()
        if existing:
            for k, v in data.items():
                setattr(existing, k, v)
            existing.synced_at = now
            updated += 1
        else:
            db.session.add(Product(**data, synced_at=now))
            added += 1

    db.session.commit()
    return {"added": added, "updated": updated, "total": len(rows)}


with app.app_context():
    db.create_all()
    # Auto-sync from sheet on startup if catalog is empty
    if Product.query.count() == 0:
        try:
            result = _do_sync()
            print(f"[startup] Auto-synced from sheet: {result}")
        except Exception as e:
            print(f"[startup] Sheet sync failed (catalog empty): {e}")


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route('/api/products', methods=['GET'])
def get_products():
    search = request.args.get('search', '').strip()
    category = request.args.get('category', '').strip()

    query = Product.query
    if category:
        query = query.filter(Product.category.ilike(category))
    if search:
        query = query.filter(or_(
            Product.name.ilike(f'%{search}%'),
            Product.colour.ilike(f'%{search}%'),
            Product.design_pattern.ilike(f'%{search}%'),
            Product.category.ilike(f'%{search}%'),
        ))

    products = query.order_by(Product.article_id.asc()).all()
    return jsonify([p.to_dict() for p in products])


@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    return jsonify(db.get_or_404(Product, product_id).to_dict())


@app.route('/api/products', methods=['POST'])
def create_product():
    data = request.json
    p = Product(
        article_id=data.get('article_id'),
        name=data['name'],
        colour=data.get('colour'),
        design_pattern=data.get('design_pattern'),
        price=float(data.get('price', 0)),
        available=data.get('available', True),
        category=data.get('category'),
        image_url=data.get('image_url'),
    )
    db.session.add(p)
    db.session.commit()
    return jsonify(p.to_dict()), 201


@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    p = db.get_or_404(Product, product_id)
    data = request.json
    for field in ('article_id', 'name', 'colour', 'design_pattern',
                  'available', 'category', 'image_url'):
        if field in data:
            setattr(p, field, data[field])
    if 'price' in data:
        p.price = float(data['price'])
    db.session.commit()
    return jsonify(p.to_dict())


@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    p = db.get_or_404(Product, product_id)
    db.session.delete(p)
    db.session.commit()
    return '', 204


@app.route('/api/categories', methods=['GET'])
def get_categories():
    rows = db.session.query(Product.category).distinct().all()
    return jsonify([r[0] for r in rows if r[0]])


@app.route('/api/sync-sheet', methods=['POST'])
def sync_sheet():
    try:
        result = _do_sync()
        msg = f"Sync complete — {result['added']} added, {result['updated']} updated ({result['total']} total)"
        return jsonify({"message": msg, **result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 502


@app.route('/api/proxy-image')
def proxy_image():
    """Fetch an external image server-side and stream it to the browser.
    Needed for Google Drive URLs which block direct <img> embedding."""
    url = request.args.get('url', '').strip()
    if not url or not url.startswith('https://'):
        return '', 400
    try:
        req = urllib.request.Request(
            url,
            headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*',
            }
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = resp.read()
            content_type = resp.headers.get('Content-Type', 'image/jpeg').split(';')[0]
        if 'text/html' in content_type:
            # Google returned a login/error page — file is not publicly shared
            return jsonify({'error': 'Image not publicly accessible on Google Drive'}), 404
        return Response(data, content_type=content_type)
    except Exception as e:
        return jsonify({'error': str(e)}), 502


if __name__ == '__main__':
    app.run(debug=True, port=5001)
