const pool = require("../config/db");

/* Get user's cart */
exports.getCart = async (req, res) => {
  try {
    console.log("✓ Getting cart for user:", req.user.id);

    const result = await pool.query(
      `SELECT c.*, p.title, p.price, p.product_type, p.discount,
              COALESCE(
                (SELECT media_url FROM product_media WHERE product_id = p.id LIMIT 1),
                (SELECT vm.media_url FROM variant_media vm JOIN product_variants pv ON vm.variant_id = pv.id WHERE pv.product_id = p.id LIMIT 1),
                (SELECT preview_url FROM digital_assets WHERE product_id = p.id LIMIT 1)
              ) as image
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC`,
      [req.user.id]
    );

    // Calculate totals
    let subtotal = 0;
    let totalDiscount = 0;

    result.rows.forEach(item => {
      const itemPrice = item.price * (item.quantity || 1);
      const itemDiscount = (item.discount || 0) * (item.quantity || 1);
      subtotal += itemPrice;
      totalDiscount += itemDiscount;
    });

    const total = subtotal - totalDiscount;

    console.log("✓ Cart retrieved with", result.rows.length, "items");
    res.json({
      items: result.rows,
      subtotal,
      totalDiscount,
      total
    });

  } catch (err) {
    console.error("✗ Error getting cart:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* Add to cart */
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, variantId = null } = req.body;

    console.log("✓ Adding to cart - Product:", productId, "Quantity:", quantity);

    // Check if item already in cart
    const existingResult = await pool.query(
      `SELECT id FROM cart WHERE user_id = $1 AND product_id = $2 AND variant_id IS NOT DISTINCT FROM $3`,
      [req.user.id, productId, variantId]
    );

    if (existingResult.rows.length > 0) {
      // Update quantity
      await pool.query(
        `UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3`,
        [quantity, req.user.id, productId]
      );
      console.log("✓ Updated existing cart item");
    } else {
      // Add new item
      await pool.query(
        `INSERT INTO cart (user_id, product_id, variant_id, quantity)
         VALUES ($1, $2, $3, $4)`,
        [req.user.id, productId, variantId, quantity]
      );
      console.log("✓ Added new item to cart");
    }

    res.json({ message: "Added to cart" });

  } catch (err) {
    console.error("✗ Error adding to cart:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* Remove from cart */
exports.removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;

    console.log("✓ Removing from cart - Item:", cartItemId);

    await pool.query(
      `DELETE FROM cart WHERE id = $1 AND user_id = $2`,
      [cartItemId, req.user.id]
    );

    console.log("✓ Item removed from cart");
    res.json({ message: "Removed from cart" });

  } catch (err) {
    console.error("✗ Error removing from cart:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* Update cart item quantity */
exports.updateCartQuantity = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    console.log("✓ Updating cart quantity - Item:", cartItemId, "Qty:", quantity);

    if (quantity <= 0) {
      await pool.query(`DELETE FROM cart WHERE id = $1`, [cartItemId]);
    } else {
      await pool.query(
        `UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3`,
        [quantity, cartItemId, req.user.id]
      );
    }

    console.log("✓ Cart updated");
    res.json({ message: "Cart updated" });

  } catch (err) {
    console.error("✗ Error updating cart:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* Clear cart */
exports.clearCart = async (req, res) => {
  try {
    console.log("✓ Clearing cart for user:", req.user.id);

    await pool.query(`DELETE FROM cart WHERE user_id = $1`, [req.user.id]);

    console.log("✓ Cart cleared");
    res.json({ message: "Cart cleared" });

  } catch (err) {
    console.error("✗ Error clearing cart:", err.message);
    res.status(500).json({ error: err.message });
  }
};
