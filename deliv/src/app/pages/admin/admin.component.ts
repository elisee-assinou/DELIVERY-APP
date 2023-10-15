import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  // Les formulaires pour la création de package et de livraison
  packageForm: FormGroup;
  deliveryForm: FormGroup;

  // Listes des packages et des livraisons
  packages: any[] = [];
  deliveries: any[] = [];

  // Variables pour afficher/masquer les formulaires
  showPackageForm = false;
  showDeliveryForm = false;

  constructor(private formBuilder: FormBuilder, private adminService: AdminService) {
    this.packageForm = this.formBuilder.group({
      // Définissez les champs du formulaire de création de package ici
      description: ['', Validators.required],
      weight: [0, Validators.required],
      width: [0, Validators.required],
      height: [0, Validators.required],
      depth: [0, Validators.required],
      from_name: [''],
      from_address: [''],
      from_location: this.formBuilder.group({
        lat: [0, Validators.required],
        lng: [0, Validators.required]
      }),
      to_name: [''],
      to_address: [''],
      to_location: this.formBuilder.group({
        lat: [0, Validators.required],
        lng: [0, Validators.required]
      })
    });

    this.deliveryForm = this.formBuilder.group({
      // Définissez les champs du formulaire de création de livraison ici
      package_id: ['', Validators.required],
      pickup_time: ['', Validators.required],
      location: this.formBuilder.group({
        lat: [0, Validators.required],
        lng: [0, Validators.required]
      }),
      status: ['open', Validators.required]
    });
  }

  ngOnInit(): void {
    // Chargez la liste des packages et des livraisons depuis le service
    this.getPackages();
    this.getDeliveries();
  }

  // Fonction pour charger la liste des packages
  getPackages() {
    this.adminService.getAllPackages().subscribe((packages: any) => {
      this.packages = packages;
    });
  }

  // Fonction pour charger la liste des livraisons
  getDeliveries() {
    this.adminService.getAllDeliveries().subscribe((deliveries: any) => {
      this.deliveries = deliveries;
    });
  }

  // Fonction pour créer un nouveau package
  createPackage() {
    if (this.packageForm.valid) {
      const newPackage = this.packageForm.value;
      this.adminService.createPackage(newPackage).subscribe(() => {
        // Réinitialisez le formulaire et rechargez la liste des packages
        this.packageForm.reset();
        this.getPackages();
      });
    }
  }

  // Fonction pour créer une nouvelle livraison
  createDelivery() {
    if (this.deliveryForm.valid) {
      const newDelivery = this.deliveryForm.value;
      this.adminService.createDelivery(newDelivery).subscribe(() => {
        // Réinitialisez le formulaire et rechargez la liste des livraisons
        this.deliveryForm.reset();
        this.getDeliveries();
      });
    }
  }

  // Afficher le formulaire de création de package
  showPackageFormPanel() {
    this.showPackageForm = true;
    this.showDeliveryForm = false; // Masquer le formulaire de livraison
  }

  // Fonction pour afficher le formulaire de création de livraison
  showDeliveryFormPanel() {
    this.showDeliveryForm = true;
    this.showPackageForm = false;
  }
}
