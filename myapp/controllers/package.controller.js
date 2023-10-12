const Package = require("../models/package");

class PackageController {
  async createPackage(req, res) {
    const {
      active_delivery_id,
      description,
      weight,
      width,
      height,
      depth,
      from_name,
      from_address,
      from_location,
      to_name,
      to_address,
      to_location,
    } = req.body;

    const newPackage = new Package({
      active_delivery_id,
      description,
      weight,
      width,
      height,
      depth,
      from_name,
      from_address,
      from_location,
      to_name,
      to_address,
      to_location,
    });

    try {
      await newPackage.save();
      res.status(201).json({ message: "Package created successfully" });
    } catch (err) {
      res.status(400).json({ message: "Failed to create package", error: err.message });
    }
  }

  async updatePackage(req, res) {
    const { package_id } = req.params;
    const {
      active_delivery_id,
      description,
      weight,
      width,
      height,
      depth,
      from_name,
      from_address,
      from_location,
      to_name,
      to_address,
      to_location,
    } = req.body;

    try {
      const package_one = await Package.findById(package_id);

      if (!package_one) {
        return res.status(404).json({ message: "Package not found" });
      }

      package_one.active_delivery_id = active_delivery_id;
      package_one.description = description;
      package_one.weight = weight;
      package_one.width = width;
      package_one.height = height;
      package_one.depth = depth;
      package_one.from_name = from_name;
      package_one.from_address = from_address;
      package_one.from_location = from_location;
      package_one.to_name = to_name;
      package_one.to_address = to_address;
      package_one.to_location = to_location;

      await package_one.save();

      res.status(200).json({ message: "Package updated successfully" });
    } catch (err) {
      res.status(400).json({ message: "Failed to update package", error: err.message });
    }
  }
  
  async deletePackage(req, res) {
    const { package_id } = req.params;
  
    try {

      const result = await Package.findOneAndRemove({ _id: package_id });
  
      if (!result) {
        return res.status(404).json({ message: "Package not found" });
      }
  
      res.status(200).json({ message: "Package deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete package", error: error.message });
    }
  }
  

  async getAllPackages(req, res) {
    try {
      const packages = await Package.find();
      res.status(200).json(packages);
    } catch (err) {
      res.status(400).json({ message: "Failed to fetch packages", error: err.message });
    }
  }

  async getPackageById(req, res) {
    const { package_id } = req.params;

    try {
      const package_one = await Package.findById(package_id);

      if (!package_one) {
        return res.status(404).json({ message: "Package not found" });
      }

      res.status(200).json(package_one);
    } catch (err) {
      res.status(400).json({ message: "Failed to fetch package", error: err.message });
    }
  }
}

module.exports = PackageController;
