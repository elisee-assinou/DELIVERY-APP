export class Package {
  _id?: string; // L'identifiant MongoDB
  active_delivery_id?: string; // Référence à l'ID de la livraison active (optionnel)
  description?: string;
  weight: number;
  width: number;
  height: number;
  depth: number;
  from_name?: string;
  from_address?: string;
  from_location?: { lat: number; lng: number };
  to_name?: string;
  to_address?: string;
  to_location?: { lat: number; lng: number };

  constructor(
    weight: number,
    width: number,
    height: number,
    depth: number,
    from_location: { lat: number; lng: number },
    to_location: { lat: number; lng: number },
    active_delivery_id?: string,
    description?: string,
    from_name?: string,
    from_address?: string,
    to_name?: string,
    to_address?: string
  ) {
    this.active_delivery_id = active_delivery_id;
    this.description = description;
    this.weight = weight;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.from_name = from_name;
    this.from_address = from_address;
    this.from_location = from_location;
    this.to_name = to_name;
    this.to_address = to_address;
    this.to_location = to_location;
  }
}
