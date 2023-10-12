const Delivery = require("../models/delivery");
const Package = require("../models/package"); 

class DeliveryControllerV2 {
  async createDelivery(req, res) {
 

    const {
    
      package_id,
      pickup_time,
      start_time,
      end_time,
      location,
      status,
    } = req.body;

    // Vérifier que le colis existe
    const package_one = await Package.findById(package_id);

    if (!package_one) {
      return res.status(404).json({ message: "Package not found" });
    }

    const newDelivery = new Delivery({

      package_id,
      pickup_time,
      start_time,
      end_time,
      location,
      status,
    });

    await newDelivery.save();

    res.status(201).json({ message: "Delivery created successfully" });
  }

  async updateDelivery(req, res) {
    const { delivery_id } = req.params;
    const {
      pickup_time,
      start_time,
      end_time,
      location,
      status,
    } = req.body;

    const delivery = await Delivery.findById(delivery_id);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    delivery.pickup_time = pickup_time;
    delivery.start_time = start_time;
    delivery.end_time = end_time;
    delivery.location = location;
    delivery.status = status;

    await delivery.save();

    res.status(200).json({ message: "Delivery updated successfully" });
  }

  async deleteDelivery(req, res) {
    const { delivery_id } = req.params;
  
    try {
      const deletedDelivery = await Delivery.findOneAndRemove({ _id: delivery_id });
  
      if (!deletedDelivery) {
        return res.status(404).json({ message: "Delivery not found" });
      }
  
      res.status(200).json({ message: "Delivery deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete delivery", error: error.message });
    }
  }
  

  async getAllDeliveries(req, res) {
    const deliveries = await Delivery.find();

    res.status(200).json(deliveries);
  }

  async getDeliveryById(req, res) {
    const { delivery_id } = req.params;

    const delivery = await Delivery.findById(delivery_id);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.status(200).json(delivery);
  }
}

module.exports = DeliveryControllerV2;
