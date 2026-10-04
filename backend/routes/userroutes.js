const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Shop = require("../models/Shop");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ===============================
// USER REGISTRATION
// ===============================

router.post("/register/user", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: "user",
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
});

// ===============================
// SHOP REGISTRATION
// ===============================

router.post("/register/shop", async (req, res) => {
  try {
    const {
      shopName,
      ownerName,
      email,
      password,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
    } = req.body;

    const existingShop = await Shop.findOne({ email });

    if (existingShop) {
      return res.status(400).json({
        message: "Shop email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const shop = await Shop.create({
      shopName,
      ownerName,
      email,
      password: hashedPassword,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
    });

    res.status(201).json({
      message: "Shop registered successfully",
      shop: {
        id: shop._id,
        shopName: shop.shopName,
        email: shop.email,
        role: "shop",
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering shop",
      error: error.message,
    });
  }
});

// ===============================
// LOGIN
// ===============================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
      role,
    } = req.body;

    let account;

    if (role === "shop") {
      account = await Shop.findOne({ email });
    } else {
      account = await User.findOne({ email });
    }

    if (!account) {
      return res.status(400).json({
        message: "Account not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      account.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: account._id,
        role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: account._id,
        name: account.name || account.ownerName,
        shopName: account.shopName || null,
        email: account.email,
        role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login error",
      error: error.message,
    });
  }
});

module.exports = router;