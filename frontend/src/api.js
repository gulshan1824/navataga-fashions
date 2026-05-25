const BASE_URL = import.meta.env.VITE_API_URL || null;

const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/' +
  '1n_WmpoRnb_YihafcAzVDR4lJOct2hN7LlFxIPuxS4WM' +
  '/export?format=csv&gid=0';

// ── image proxy ───────────────────────────────────────────────────────────────

export const proxyImage = (url) => {
  if (!url) return null;
  if (BASE_URL) return `${BASE_URL}/proxy-image?url=${encodeURIComponent(url)}`;
  return url; // static mode: try direct URL
};

// ── response helper ───────────────────────────────────────────────────────────

const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw error;
  }
  if (res.status === 204) return null;
  return res.json();
};

// ── CSV fallback (no backend) ─────────────────────────────────────────────────

function parseCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (ch === ',' && !inQuotes) {
      result.push(cur); cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function normaliseImageUrl(raw) {
  if (!raw) return null;
  raw = raw.trim();
  let m = raw.match(/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/);
  if (m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w600`;
  m = raw.match(/drive\.google\.com\/open\?id=([A-Za-z0-9_-]+)/);
  if (m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w600`;
  m = raw.match(/[?&]id=([A-Za-z0-9_-]+)/);
  if (m && raw.includes('drive.google.com')) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w600`;
  if (raw.startsWith('http')) return raw;
  return null;
}

async function fetchFromSheet(search = '', category = '') {
  const res = await fetch(SHEET_CSV_URL);
  if (!res.ok) throw new Error('Could not load catalogue');
  const text = await res.text();
  const lines = text.split('\n').filter(Boolean);
  const headers = parseCSVLine(lines[0]);

  let id = 0;
  const products = lines.slice(1).map(line => {
    const vals = parseCSVLine(line);
    const row = {};
    headers.forEach((h, i) => { row[h.trim()] = (vals[i] || '').trim(); });

    const article_id = row['Article_ID'] || '';
    if (!article_id) return null;

    const rawPrice = (row['Price'] || '0').replace(/,/g, '');
    return {
      id: ++id,
      article_id,
      name: toTitleCase(row['Name'] || ''),
      colour: row['Colour'] ? toTitleCase(row['Colour']) : null,
      design_pattern: row['Design Pattern'] || null,
      category: row['Category'] ? toTitleCase(row['Category']) : null,
      price: parseFloat(rawPrice) || 0,
      available: (row['Available'] || '').toLowerCase() === 'yes',
      image_url: normaliseImageUrl(row['Photo']),
      synced_at: null,
    };
  }).filter(Boolean);

  const s = search.toLowerCase();
  const c = category.toLowerCase();
  return products.filter(p => {
    const matchCat = !c || c === 'all' || (p.category || '').toLowerCase() === c;
    const matchSearch = !s || [p.name, p.colour, p.design_pattern, p.category]
      .some(v => v && v.toLowerCase().includes(s));
    return matchCat && matchSearch;
  });
}

// ── API functions ─────────────────────────────────────────────────────────────

export const getProducts = async (search = '', category = '') => {
  if (!BASE_URL) return fetchFromSheet(search, category);
  let url = `${BASE_URL}/products?`;
  if (search) url += `search=${encodeURIComponent(search)}&`;
  if (category && category !== 'All') url += `category=${encodeURIComponent(category)}`;
  const res = await fetch(url);
  return handleResponse(res);
};

export const getProduct = async (id) => {
  if (!BASE_URL) {
    const all = await fetchFromSheet();
    const p = all.find(x => String(x.id) === String(id));
    if (!p) throw { message: 'Not found' };
    return p;
  }
  const res = await fetch(`${BASE_URL}/products/${id}`);
  return handleResponse(res);
};

export const getCategories = async () => {
  if (!BASE_URL) {
    const all = await fetchFromSheet();
    const cats = [...new Set(all.map(p => p.category).filter(Boolean))];
    return cats.sort();
  }
  const res = await fetch(`${BASE_URL}/categories`);
  return handleResponse(res);
};

export const createProduct = async (data) => {
  if (!BASE_URL) throw new Error('Admin features require the backend API.');
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const updateProduct = async (id, data) => {
  if (!BASE_URL) throw new Error('Admin features require the backend API.');
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const deleteProduct = async (id) => {
  if (!BASE_URL) throw new Error('Admin features require the backend API.');
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
};

export const syncSheet = async () => {
  if (!BASE_URL) throw new Error('Sync requires the backend API.');
  const res = await fetch(`${BASE_URL}/sync-sheet`, { method: 'POST' });
  return handleResponse(res);
};
