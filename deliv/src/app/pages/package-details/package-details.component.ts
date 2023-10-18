import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';
import { PackageService } from '../../services/package-service/package-service.service';
import { WebsocketService } from '../../services/websocket-service/websocket.service';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.css']
})
export class PackageDetailsComponent implements OnInit {
  packageForm: FormGroup;
  packageId: string | undefined;
  websocketSubscription: Subscription | undefined;
  deliveryMarker: L.Marker | undefined;
  destinationMarker: L.Marker | undefined;
  map: L.Map | undefined;
  packageDetails: any;

  constructor(
    private packageService: PackageService,
    private webSocketService: WebsocketService,
    private formBuilder: FormBuilder
  ) {
    this.packageForm = this.formBuilder.group({
      packageId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.map = L.map('map');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);

    this.websocketSubscription = this.webSocketService.onMessage().subscribe(async (message: any) => {
      console.log('edjan');

      if (message.type === 'incoming' && message.event === 'location_changed') {
        const location = message.location;
        this.updateDeliveryMarkerPosition(location);
      }
    });
    
    this.map.setView([0, 0], 1);
  }

  loadPackageDetails(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    this.packageId = this.packageForm.value.packageId;
    if (this.packageId) {
      this.packageService.getPackageDetails(this.packageId).subscribe((packageDetails: any) => {
        this.packageDetails = packageDetails;
        const destination = packageDetails.package_one.to_location;

        if (this.isValidCoordinates(destination.lat, destination.lng)) {
          if (this.destinationMarker) {
            this.destinationMarker.setLatLng([destination.lat, destination.lng]);
          } else {
            this.destinationMarker = L.marker([destination.lat, destination.lng]).addTo(this.map as L.Map);
          }

          if (this.deliveryMarker) {
            const location = packageDetails.delivery.location;
            this.deliveryMarker.setLatLng([location.lat, location.lng]);
          } else {
            const location = packageDetails.delivery.location;
            this.deliveryMarker = L.marker([location.lat, location.lng], {
              icon: L.icon({
                iconUrl: '/assets/marker-delivery.png',
                iconSize: [30, 30]
              })
            }).addTo(this.map as L.Map);
          }

          this.map?.setView([destination.lat, destination.lng], 15);
        }
      });
    }
  }

  updateDeliveryMarkerPosition(location: any) {
    if (this.deliveryMarker) {
      this.deliveryMarker.setLatLng([location.lat, location.lng]);
      console.log("La nouvelle position du livreur a été mise à jour");
    }
  }

  isValidCoordinates(lat: number, lng: number): boolean {
    return (lat >= -90 && lat <= 90) && (lng >= -180 && lng <= 180);
  }
}
