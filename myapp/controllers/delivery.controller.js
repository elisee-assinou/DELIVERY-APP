const Delivery = require("../models/delivery");
const Package = require("../models/package");
const User = require("../models/user");
const wss = require("../websocketServer");


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
    const { pickup_time, location, status } = req.body;
  
    try {
      const delivery = await Delivery.findById(delivery_id);
  
      if (!delivery) {
        return res.status(404).json({ message: 'Delivery not found' });
      }
  
      if (pickup_time) {
        delivery.pickup_time = pickup_time;
      }
  
      if (location) {
        delivery.location = location;
  
        const packageId = delivery.package_id;
        if (packageId) {
          const package_one = await Package.findById(packageId);
  
          if (package_one) {
            package_one.from_location = location;
            await package_one.save();
          }
        }
  
        // Notification aux clients WebSocket connectés pour la mise à jour de la localisation
        const locationUpdate = {
          event: 'location_changed',
          delivery_id: delivery_id,
          location: location,
        };
  
        // Envoyer la mise à jour de localisation à tous les clients WebSocket connectés
       wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(locationUpdate));
          }
        })
      }
  
      if (status) {
        delivery.status = status;
  
        // Notification aux clients WebSocket connectés pour la mise à jour du statut
        const statusUpdate = {
          event: 'status_changed',
          delivery_id: delivery_id,
          status: status,
        };
  
        // Envoyer la mise à jour du statut à tous les clients WebSocket connectés
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(statusUpdate));
          }
        })
      }
  
      await delivery.save();
  
      res.status(200).json({ message: 'Delivery updated successfully' });
    } catch (err) {
      return res.status(400).json({ message: 'Failed to update delivery', error: err.message });
    }
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
  async assignDeliveryToDriver(req, res) {
    const { delivery_id } = req.params;
    const {driver_id} = req.body;

    try {

      const delivery = await Delivery.findById(delivery_id);
      if (!delivery) {
        return res.status(404).json({ message: "Delivery not found" });
      }

      const driver = await User.findById(driver_id);

      if (!driver || driver.role !== "livreur") {
        return res.status(400).json({ message: "Invalid driver or driver not found" });
      }
      if (delivery.status !== "open"){
        return res.status(400).json({ message: "This delivery is picked-up yet" });
      }

      delivery.driver_id = driver_id;
      delivery.status = 'picked-up';

      await delivery.save();

      if (delivery.package_id) {
        const package_one = await Package.findById(delivery.package_id);
        if (package_one) {
          package_one.active_delivery_id = delivery_id;
          await package_one.save();
        }
      }

      res.status(200).json({ message: "Delivery assigned to driver successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to assign delivery to driver", error: error.message });
    }
  }


}

module.exports = DeliveryControllerV2;
