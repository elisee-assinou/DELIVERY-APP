export class Delivery {
  _id?: string; // L'identifiant MongoDB
  package_id: string; // Référence à l'ID du package associé
  driver_id?: string; // Référence à l'ID de l'utilisateur (conducteur) associé
  pickup_time: Date;
  start_time?: Date;
  end_time?: Date;
  location: { lat: number; lng: number };
  status: 'open' | 'picked-up' | 'in-transit' | 'delivered' | 'failed';
 

  constructor(
    package_id: string,
    pickup_time: Date,
    location: { lat: number; lng: number },
    status: 'open' | 'picked-up' | 'in-transit' | 'delivered' | 'failed' = 'open'
  ) {
    this.package_id = package_id;
    this.pickup_time = pickup_time;
    this.location = location;
    this.status = status;
  }
}
