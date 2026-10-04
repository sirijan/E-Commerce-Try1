const express = require("express");
const router = express.Router();

const Material = require("../models/Material");
const auth = require("../middleware/auth");

// ==========================================
// GET ALL PRODUCTS
// ==========================================

router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;

    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    const materials = await Material.find(filter)
      .populate("shop", "shopName city address")
      .sort({ createdAt: -1 });

    res.json(materials);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch products",
      error: error.message,
    });
  }
});

// ==========================================
// GET SHOP OWNER PRODUCTS
// ==========================================

router.get("/mine", auth("shop"), async (req, res) => {
  try {
    const materials = await Material.find({
      shop: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(materials);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch shop products",
    });
  }
});

// ==========================================
// GET SINGLE PRODUCT
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate("shop", "shopName city address latitude longitude");

    if (!material) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(material);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch product",
    });
  }
});

// ==========================================
// ADD PRODUCT
// SHOP OWNER ONLY
// ==========================================

router.post("/", auth("shop"), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      image,
      quantity,
    } = req.body;

    const material = await Material.create({
      title,
      description,
      price,
      category,
      image,
      quantity,
      shop: req.user.id,
    });

    res.status(201).json({
      message: "Product added successfully",
      material,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to add product",
      error: error.message,
    });
  }
});

// ==========================================
// UPDATE PRODUCT
// ==========================================

router.put("/:id", auth("shop"), async (req, res) => {
  try {
    const material = await Material.findOneAndUpdate(
      {
        _id: req.params.id,
        shop: req.user.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!material) {
      return res.status(404).json({
        message: "Product not found or not owned by you",
      });
    }

    res.json({
      message: "Product updated successfully",
      material,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to update product",
    });
  }
});

// ==========================================
// DELETE PRODUCT
// ==========================================

router.delete("/:id", auth("shop"), async (req, res) => {
  try {
    const material = await Material.findOneAndDelete({
      _id: req.params.id,
      shop: req.user.id,
    });

    if (!material) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete product",
    });
  }
});

module.exports = router;