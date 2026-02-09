const pool = require("../config/db");

/* Create order from cart */
exports.createOrder = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;

    console.log("✓ Creating order for user:", req.user.id);

    // Get cart items
    const cartResult = await pool.query(
      `SELECT c.*, p.price
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [req.user.id]
    );

    if (cartResult.rows.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate total
    let totalAmount = 0;
    cartResult.rows.forEach(item => {
      const itemPrice = item.price * (item.quantity || 1);
      const itemDiscount = (item.discount || 0) * (item.quantity || 1);
      totalAmount += itemPrice - itemDiscount;
    });

    console.log("✓ Total amount:", totalAmount);

    // Create order
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, total_amount, payment_status, status)
       VALUES ($1, $2, 'pending', 'pending')
       RETURNING id`,
      [req.user.id, totalAmount]
    );

    const orderId = orderResult.rows[0].id;
    console.log("✓ Order created with ID:", orderId);

    // Create order items
    for (const item of cartResult.rows) {
      const itemPrice = item.price * (item.quantity || 1);
      const itemDiscount = (item.discount || 0) * (item.quantity || 1);
      
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, discount)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.product_id, item.quantity || 1, itemPrice, itemDiscount]
      );
    }

    console.log("✓ Order items created");

    // Clear cart
    await pool.query(`DELETE FROM cart WHERE user_id = $1`, [req.user.id]);

    console.log("✓ Cart cleared");
    res.json({
      orderId,
      totalAmount,
      paymentRequired: true
    });

  } catch (err) {
    console.error("✗ Error creating order:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* Process payment (demo - using Razorpay) */
exports.processPayment = async (req, res) => {
  try {
    const { orderId, paymentId, paymentType, paymentMethod, customerInfo } = req.body;

    console.log("✓ Processing payment for order:", orderId, "Type:", paymentType);

    // Validate customer info
    if (!customerInfo || !customerInfo.email || !customerInfo.phone || !customerInfo.address || !customerInfo.location) {
      return res.status(400).json({ error: "Customer information required" });
    }

    let paymentStatus = "pending";
    let orderStatus = "pending";

    if (paymentType === "online") {
      // Online payment: Mark as completed immediately (demo/Razorpay/Stripe)
      paymentStatus = "completed";
      orderStatus = "confirmed";
    } else if (paymentType === "offline") {
      // Offline payment: Awaiting payment on delivery
      paymentStatus = "pending";
      orderStatus = "confirmed"; // Order confirmed but payment pending
    }

    // Update order with customer info and payment details
    const customerInfoJson = JSON.stringify(customerInfo);
    
    await pool.query(
      `UPDATE orders 
       SET payment_status = $1, 
           status = $2, 
           payment_id = $3,
           payment_type = $4,
           payment_method = $5,
           customer_info = $6,
           updated_at = NOW()
       WHERE id = $7 AND user_id = $8`,
      [paymentStatus, orderStatus, paymentId, paymentType, paymentMethod, customerInfoJson, orderId, req.user.id]
    );

    console.log("✓ Payment processed successfully");
    res.json({
      message: paymentType === "offline" ? "Order confirmed! Payment due on delivery" : "Payment successful",
      orderId,
      paymentStatus,
      orderStatus
    });

  } catch (err) {
    console.error("✗ Error processing payment:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* Get user orders */
exports.getUserOrders = async (req, res) => {
  try {
    console.log("✓ Getting orders for user:", req.user.id);

    const result = await pool.query(
      `SELECT o.*, json_agg(json_build_object(
        'product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price,
        'title', p.title
      )) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    console.log("✓ Retrieved", result.rows.length, "orders");
    res.json(result.rows);

  } catch (err) {
    console.error("✗ Error getting orders:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* Get order details */
exports.getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("✓ Getting order details:", id);

    const orderResult = await pool.query(
      `SELECT * FROM orders WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const itemsResult = await pool.query(
      `SELECT oi.*, p.title, p.product_type, da.asset_url, da.preview_url, da.asset_type
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       LEFT JOIN digital_assets da ON da.product_id = p.id
       WHERE oi.order_id = $1`,
      [id]
    );

    console.log("✓ Order details retrieved");
    res.json({
      order: orderResult.rows[0],
      items: itemsResult.rows
    });

  } catch (err) {
    console.error("✗ Error getting order detail:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* Get artist orders (for order management) */
exports.getArtistOrders = async (req, res) => {
  try {
    console.log("✓ Getting orders for artist:", req.user.id);

    // Get all orders that contain products from this artist
    // First get the order IDs ordered by created_at
    const orderIdsResult = await pool.query(
      `SELECT DISTINCT o.id, o.created_at
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE p.artist_id = $1
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    console.log("✓ Found", orderIdsResult.rows.length, "orders for artist");

    // For each order, get its details
    const orders = [];
    for (const row of orderIdsResult.rows) {
      const orderResult = await pool.query(
        `SELECT o.id, o.user_id, o.total_amount, o.payment_status, o.status, 
                o.payment_type, o.created_at, o.updated_at
         FROM orders o
         WHERE o.id = $1`,
        [row.id]
      );

      const itemsResult = await pool.query(
        `SELECT oi.product_id, oi.quantity, oi.price, p.title, p.artist_id
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = $1`,
        [row.id]
      );

      if (orderResult.rows.length > 0) {
        const order = orderResult.rows[0];
        order.items = itemsResult.rows;
        orders.push(order);
      }
    }

    console.log("✓ Retrieved", orders.length, "complete orders for artist");
    res.json(orders);

  } catch (err) {
    console.error("✗ Error getting artist orders:", err.message, err);
    res.status(500).json({ error: err.message });
  }
};

/* Update order status (artist only) */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // confirmed, processing, dispatched, received

    console.log("✓ Updating order status:", id, "to:", status);

    const validStatuses = ["confirmed", "processing", "dispatched", "received"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Verify this artist has products in this order
    const verifyResult = await pool.query(
      `SELECT COUNT(*) as count FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1 AND p.artist_id = $2`,
      [id, req.user.id]
    );

    if (verifyResult.rows[0].count === 0) {
      return res.status(403).json({ error: "Not authorized to update this order" });
    }

    // Update status
    await pool.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2`,
      [status, id]
    );

    console.log("✓ Order status updated");
    res.json({ message: "Order status updated", status });

  } catch (err) {
    console.error("✗ Error updating order status:", err.message);
    res.status(500).json({ error: err.message });
  }
};
