const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Material = require("../models/Material");

const auth = require("../middleware/auth");

// ==========================================
// DISTANCE CALCULATION
// ==========================================

function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const R = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}

// ==========================================
// PLACE ORDER
// ==========================================

router.post("/", auth("user"), async (req, res) => {
  const {
    items,
    deliveryAddress,
  } = req.body;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // Combine duplicate products
    const itemMap = new Map();

    for (const item of items) {
      const existing =
        itemMap.get(item.material);

      if (existing) {
        existing.quantity += Number(
          item.quantity
        );
      } else {
        itemMap.set(item.material, {
          material: item.material,
          quantity: Number(item.quantity),
        });
      }
    }

    const finalItems = [];

    let totalAmount = 0;

    for (const item of itemMap.values()) {
      const product = await Material.findById(
        item.material
      ).populate("shop");

      if (!product) {
        return res.status(404).json({
          message: "One of the products no longer exists",
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `${product.title} has only ${product.quantity} item(s) available`,
        });
      }

      // IMPORTANT:
      // Decrease quantity in MongoDB
      const updatedProduct =
        await Material.findOneAndUpdate(
          {
            _id: product._id,
            quantity: {
              $gte: item.quantity,
            },
          },
          {
            $inc: {
              quantity: -item.quantity,
            },
          },
          {
            new: true,
          }
        );

      if (!updatedProduct) {
        return res.status(400).json({
          message: `Not enough stock for ${product.title}`,
        });
      }

      totalAmount +=
        product.price * item.quantity;

      finalItems.push({
        material: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        shop: product.shop._id,
      });
    }

    // ======================================
    // DELIVERY ESTIMATION
    // ======================================

    const shopIds = [
      ...new Set(
        finalItems.map((item) =>
          item.shop.toString()
        )
      ),
    ];

    const delivery = [];

    for (const shopId of shopIds) {
      const shopProducts = finalItems.filter(
        (item) =>
          item.shop.toString() === shopId
      );

      const shop = await require(
        "../models/Shop"
      ).findById(shopId);

      let distanceKm = 0;
      let estimatedMinutes = 60;

      if (
        shop &&
        shop.latitude &&
        shop.longitude &&
        deliveryAddress.latitude &&
        deliveryAddress.longitude
      ) {
        distanceKm = calculateDistance(
          shop.latitude,
          shop.longitude,
          deliveryAddress.latitude,
          deliveryAddress.longitude
        );

        // Simple project-level estimate
        estimatedMinutes =
          Math.max(
            30,
            Math.round(distanceKm * 8)
          );
      }

      delivery.push({
        shop: shopId,
        distanceKm:
          Number(distanceKm.toFixed(2)),
        estimatedMinutes,
      });
    }

    // ======================================
    // CREATE ORDER
    // ======================================

    const order = await Order.create({
      user: req.user.id,

      items: finalItems,

      totalAmount,

      deliveryAddress,

      delivery,

      status: "Pending",
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to place order",
      error: error.message,
    });
  }
});

// ==========================================
// USER ORDERS
// ==========================================

router.get("/my", auth("user"), async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("items.material")
      .populate("items.shop", "shopName")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch orders",
    });
  }
});

module.exports = router;