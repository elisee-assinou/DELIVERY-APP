import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { ActivatedRoute } from '@angular/router';
import { PackageService } from '../../services/package-service/package-service.service';
import { WebsocketService } from '../../services/websocket-service/websocket.service';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.css']
})
export class PackageDetailsComponent implements OnInit {
  packageForm: FormGroup;
  packageDetails: any = null;
  packageNotFound: string = '';

  @ViewChild('map', { static: true }) mapElement!: ElementRef;
  private map!: L.Map;
  private marker!: L.Marker;

  constructor(
    private route: ActivatedRoute,
    private packageService: PackageService,
    private webSocket: WebsocketService,
    private formBuilder: FormBuilder
  ) {
    this.packageForm = this.formBuilder.group({
      packageId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const idParam = params['id'];

      if (idParam) {
        this.packageForm.get('packageId')?.setValue(idParam);
        this.searchPackageDetails();
      }
    });
  }

  searchPackageDetails() {
    this.packageNotFound = ''; // Utilisez une chaîne vide pour effacer les messages d'erreur précédents

    if (this.packageForm.invalid) {
      return;
    }

    const packageId = this.packageForm.get('packageId')?.value as string;

    this.packageService.getPackageDetails(packageId).subscribe(
      details => {
        this.packageDetails = details;

        if (this.packageDetails && this.packageDetails.delivery) {
          const packageLocation = this.packageDetails.location;
          const deliveryLocation = this.packageDetails.delivery.location;

          this.setupMap(packageLocation, deliveryLocation);

          //this.webSocket.listen().subscribe(message => {
            //if (message.event === 'location_changed' && message.delivery_id === this.packageDetails.delivery.id) {
              //this.updateMarkerPosition(message.location);
            //}
          //});
        }
      },
      error => {
        this.packageNotFound = error.message;
        this.packageDetails = null; // Réinitialisez packageDetails en cas d'erreur
        this.destroyMap();
      }
    );
  }

  private setupMap(packageLocation: any, deliveryLocation: any) {
    this.map = L.map(this.mapElement.nativeElement).setView([packageLocation.lat, packageLocation.lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);

    this.marker = L.marker([deliveryLocation.lat, deliveryLocation.lon]).addTo(this.map);
  }

  private updateMarkerPosition(newLocation: any) {
    this.marker.setLatLng([newLocation.lat, newLocation.lon]);
  }

  private destroyMap() {
    if (this.map) {
      this.map.remove();
    }
  }

  ngOnDestroy() {
    this.destroyMap();
  }
}
