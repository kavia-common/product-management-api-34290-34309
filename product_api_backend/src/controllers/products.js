const productService = require('../services/products');

// Validate request body for product fields
function validateProductPayload(body, { partial = false } = {}) {
  const errors = [];

  if (!partial || body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim().length === 0) {
      errors.push('name must be a non-empty string');
    }
  }

  if (!partial || body.price !== undefined) {
    if (typeof body.price !== 'number' || Number.isNaN(body.price) || body.price < 0) {
      errors.push('price must be a number >= 0');
    }
  }

  if (!partial || body.quantity !== undefined) {
    if (
      typeof body.quantity !== 'number' ||
      !Number.isInteger(body.quantity) ||
      body.quantity < 0
    ) {
      errors.push('quantity must be an integer >= 0');
    }
  }

  return errors;
}

class ProductsController {
  // PUBLIC_INTERFACE
  list(req, res) {
    /** List all products. */
    const items = productService.listProducts();
    return res.status(200).json({ data: items });
  }

  // PUBLIC_INTERFACE
  create(req, res) {
    /** Create a new product. */
    const errors = validateProductPayload(req.body);
    if (errors.length) {
      return res.status(400).json({ error: 'Invalid payload', details: errors });
    }

    const { name, price, quantity } = req.body;
    const created = productService.createProduct({ name: name.trim(), price, quantity });
    return res.status(201).json({ data: created });
  }

  // PUBLIC_INTERFACE
  getById(req, res) {
    /** Get a product by id. */
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid id parameter' });
    }
    const found = productService.getProductById(id);
    if (!found) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json({ data: found });
  }

  // PUBLIC_INTERFACE
  update(req, res) {
    /** Replace an existing product by id. */
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid id parameter' });
    }

    const errors = validateProductPayload(req.body);
    if (errors.length) {
      return res.status(400).json({ error: 'Invalid payload', details: errors });
    }

    const { name, price, quantity } = req.body;
    const updated = productService.updateProduct(id, { name: name.trim(), price, quantity });
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json({ data: updated });
  }

  // PUBLIC_INTERFACE
  delete(req, res) {
    /** Delete a product by id. */
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid id parameter' });
    }

    const deleted = productService.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(204).send();
  }
}

module.exports = new ProductsController();
