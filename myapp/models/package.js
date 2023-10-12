const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
  active_delivery_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Delivery",
    default: null,
  },
  description: {
    type: String,
  },
  weight: {
    type: Number,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  depth: {
    type: Number,
    required: true,
  },
  from_name: {
    type: String,
  },
  from_address: {
    type: String,
  },
  from_location: {
    type: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  to_name: {
    type: String,
  },
  to_address: {
    type: String,
  },
  to_location: {
    type: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
}, {
  timestamps: true,
});

const Package = mongoose.model("Package", PackageSchema);

module.exports = Package;
