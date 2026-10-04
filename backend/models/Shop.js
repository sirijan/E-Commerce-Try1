const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
      trim: true,
    },

    ownerName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: String,

    state: String,

    pincode: String,

    latitude: Number,

    longitude: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Shop", shopSchema);