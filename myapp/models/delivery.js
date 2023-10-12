const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  package_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: true,
  },
  pickup_time: {
    type: Date,
    required: true,
  },
  start_time: {
    type: Date,
  },
  end_time: {
    type: Date,
  },
  location: {
    type: {
      lat: Number,
      lng: Number,
    },
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "picked-up", "in-transit", "delivered", "failed"],
    default: "open",
  },
}, {
  timestamps: true,
});

const Delivery = mongoose.model("Delivery", DeliverySchema);

module.exports = Delivery;
