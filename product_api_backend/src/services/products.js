const fs = require('fs');
const path = require('path');

// Simple file-based store with in-memory cache.
// Data file will be created in the project data folder.
const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'products.json');

// Ensure data directory exists
function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {
    // If creation fails, we'll fallback to memory only.
    // Log but do not crash.
    console.warn('Could not ensure data directory:', e.message);
  }
}

// Load products from file; fallback to empty array if not present or invalid
function loadFromFile() {
  try {
    ensureDataDir();
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load products from file, using memory only:', e.message);
  }
  return [];
}

// Persist products to file (best-effort)
function saveToFile(products) {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Failed to persist products to file (continuing with memory):', e.message);
  }
}

// In-memory cache
let products = loadFromFile();
// Auto-increment id based on highest existing id
let nextId = products.reduce((max, p) => (p.id > max ? p.id : max), 0) + 1;

// PUBLIC_INTERFACE
function listProducts() {
  /** Returns all products. */
  return products;
}

// PUBLIC_INTERFACE
function createProduct({ name, price, quantity }) {
  /** Creates a new product and returns it. */
  const product = {
    id: nextId++,
    name,
    price,
    quantity,
  };
  products.push(product);
  saveToFile(products);
  return product;
}

// PUBLIC_INTERFACE
function getProductById(id) {
  /** Returns a product by id or undefined if not found. */
  return products.find((p) => p.id === id);
}

// PUBLIC_INTERFACE
function updateProduct(id, { name, price, quantity }) {
  /** Updates a product by id. Returns updated product or undefined if not found. */
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  const updated = { ...products[index], name, price, quantity };
  products[index] = updated;
  saveToFile(products);
  return updated;
}

// PUBLIC_INTERFACE
function deleteProduct(id) {
  /** Deletes a product by id. Returns true if deleted, false otherwise. */
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  saveToFile(products);
  return true;
}

/**
 * Computes total inventory balance as sum of (price * quantity) across all products.
 * Ensures numeric validation and treats invalid or missing numeric fields as 0.
 * Returns a finite number (0 when no products).
 */
// PUBLIC_INTERFACE
function getTotalBalance() {
  /** Returns the total value of inventory as a number. */
  // Defensive: coerce values and ignore invalids by treating them as 0
  return products.reduce((acc, p) => {
    const price = typeof p.price === 'number' && Number.isFinite(p.price) && p.price >= 0 ? p.price : 0;
    const quantity = typeof p.quantity === 'number' && Number.isInteger(p.quantity) && p.quantity >= 0 ? p.quantity : 0;
    const productTotal = price * quantity;
    // Guard against non-finite results
    if (!Number.isFinite(productTotal)) return acc;
    return acc + productTotal;
  }, 0);
}

module.exports = {
  listProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getTotalBalance,
};
