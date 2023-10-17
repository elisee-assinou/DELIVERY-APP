import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DeliveryService } from '../../services/delivery-service/delivery.service';
import { PackageService } from '../../services/package-service/package-service.service';
import { WebsocketService } from '../../services/websocket-service/websocket.service';

import * as L from 'leaflet';

@Component({
  selector: 'app-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.css']
})
export class DeliveryDetailsComponent implements OnInit {
  deliveryIdInput: string = '';

  @ViewChild('map', { static: true }) mapElement!: ElementRef;
  private map!: L.Map;
  private destinationMarker: L.Marker | null = null;
  private currentLocationMarker: L.Marker | null = null;

  deliveryDetails: any = null;
  packageDetails: any = null;

  constructor(
    private deliveryService: DeliveryService,
    private packageService: PackageService,
    private webSocketService: WebsocketService
  ) { }


  currentStatus: string = '';


  ngOnInit() {
    //envoi de la position toutes les 20 secondes
    setInterval(() => {
      this.updateMarkerPosition();
    }, 20000);
  }

  // Méthode `loadDeliveryDetails()`
  loadDeliveryDetails(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    this.deliveryService.getDeliveryById(this.deliveryIdInput).subscribe(delivery => {
      this.deliveryDetails = delivery;
      this.currentStatus=this.deliveryDetails.status;
      if (this.deliveryDetails && this.deliveryDetails.package_id) {
        this.packageService.getPackageDetails(this.deliveryDetails.package_id).subscribe(packageDetails => {
          this.packageDetails = packageDetails.package_one;

          // Mettre à jour la carte
          this.setupMap(this.packageDetails);
        });
      }
    });
  }

  setupMap(destination: any) {
    if (!this.map) {
      this.map = L.map('map').setView([9.3077, 2.3158], 7);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      console.log(destination);

      if (destination && destination.to_location &&
        this.isValidCoordinates(destination.to_location.lat, destination.to_location.lng)) {
        console.log(destination.to_location.lat);
        console.log(destination.to_location.lng);

        const destinationM = L.marker([destination.to_location.lat, destination.to_location.lng]);

        // Ajoutez le marqueur à la carte
        destinationM.addTo(this.map);
      }

      // Mettre à jour la position du marqueur actuelle
      this.updateMarkerPosition();
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }


  updateMarkerPosition() {
    this.getCurrentLocation().then(({ lat, lng }) => {
      // Vérifier si la position actuelle est valide
      if (!this.isValidCoordinates(lat, lng)) {
        console.error('La position actuelle n\'est pas valide.');
        return;
      }

      // Vérifier si le marqueur de la position actuelle est visible sur la carte
      if (!this.map.getBounds().contains([lat, lng])) {
        // Mettre à jour le zoom de la carte pour que le marqueur de la position actuelle soit visible


        this.map.setView([lat, lng], 15);
      }

      // Mettre à jour la position du marqueur de la position actuelle
      if (!this.currentLocationMarker) {
        this.currentLocationMarker = L.marker([lat, lng]).addTo(this.map);
      } else {
        this.currentLocationMarker.setLatLng([lat, lng]);
        console.log(lat, lng);

      }

      // Envoyer la position mise à jour au serveur WebSocket
      const positionUpdate = {
        event: 'location_changed',
        //delivery_id: this.deliveryIdInput,
        delivery_id: this.deliveryIdInput,
        location: {
          lat: lat,
          lng: lng,
        },
      };
      this.webSocketService.send(JSON.stringify(positionUpdate));
    });
  }


  async getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            resolve({ lat, lng });
          },
          (error) => {
            console.error('Erreur de géolocalisation :', error);
            reject(error);
          }
        );
      } else {
        console.error('La géolocalisation n\'est pas prise en charge par ce navigateur.');
        reject('La géolocalisation n\'est pas prise en charge par ce navigateur.');
      }
    });
  }

  isValidCoordinates(lat: number, lon: number): boolean {
    return (lat >= -90 && lat <= 90) && (lon >= -180 && lon <= 180);
  }

  changeStatus(newStatus: string) {

    if (
      (this.currentStatus === 'open' && newStatus === 'picked-up') ||
      (this.currentStatus === 'picked-up' && newStatus === 'in-transit') ||
      (this.currentStatus === 'in-transit' && newStatus === 'delivered') ||
      (this.currentStatus === 'in-transit' && newStatus === 'failed')
    ) {

      this.currentStatus = newStatus;
      //envoi du message websocket
      this.sendStatusUpdate(newStatus);
    }
  }

  sendStatusUpdate(newStatus: string) {

    const deliveryStatusUpdate = {
      event: 'status_changed',
      delivery_id: this.deliveryIdInput,
      status: newStatus,
    };

    this.webSocketService.send(JSON.stringify(deliveryStatusUpdate));
  }

}
