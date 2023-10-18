import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin/admin.service';
import { Delivery } from 'src/app/models/delivery.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  // Les formulaires pour la création de package et de livraison
  packageForm: FormGroup;
  deliveryForm: FormGroup;
  EditDeliveryForm: FormGroup;


  // Listes des packages et des livraisons
  packages: any[] = [];
  deliveries: any[] = [];
  displayedColumns: string[] = ['description', 'source', 'destination', 'weight', 'height', 'depth', 'actions'];
  deliveryColumns: string[] = ['status', 'package_id', 'start_time', 'end_time', 'driver_id', 'actions'];

  showPackageForm: boolean;
  showDeliveryForm: boolean;
  PackagesList:boolean;
  DeliveriesList:boolean;
  isEditing: boolean=false;
  editingDeliveryId: string | null = null;
  editingDelivery: any;
  currentId: any;



  constructor(private formBuilder: FormBuilder, private adminService: AdminService) {
    this.showPackageForm = false;
    this.showDeliveryForm = false;
    this.PackagesList=true;
    this.DeliveriesList=true;


    this.packageForm = this.formBuilder.group({
      description: ['', Validators.required],
      weight: [null, Validators.required],
      width: [null, Validators.required],
      height: [null, Validators.required],
      depth: [null, Validators.required],
      from_name: ['', Validators.required],
      from_address: ['', Validators.required],
      from_location: this.formBuilder.group({
        lat: [null, Validators.required],
        lng: [null, Validators.required],
      }),
      to_name: '',
      to_address: '',
      to_location: this.formBuilder.group({
        lat: [null, Validators.required],
        lng: [null, Validators.required],
      }),
    });

    this.deliveryForm = this.formBuilder.group({
      package_id: ['', Validators.required],
      pickup_time: ['', Validators.required],
      location: this.formBuilder.group({
        lat: [0, Validators.required],
        lng: [0, Validators.required],
      }),
      status: ['open', Validators.required],
    });

    this.EditDeliveryForm = this.formBuilder.group({
      package_id: ["", Validators.required],
      pickup_time: ["",Validators.required],
      location: this.formBuilder.group({
        lat: [0, Validators.required],
        lng: [0, Validators.required],
      }),
      status: ["", Validators.required],
    });


  }

  ngOnInit(): void {

    this.getPackages();
    this.getDeliveries();
  }


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

  createPackage() {
    if (this.packageForm.valid) {
      const newPackage = this.packageForm.value;
      this.adminService.createPackage(newPackage).subscribe(() => {
        alert(" succes " );
        // Réinitialisez le formulaire et rechargez la liste des packages
        this.packageForm.reset();
        this.getPackages();
      },
      (error) => {
        alert("Échec");
      });
    }
  }

  createDelivery() {
    if (this.deliveryForm.valid) {
      const newDelivery = this.deliveryForm.value;
      this.adminService.createDelivery(newDelivery).subscribe(() => {
        alert(" succes " );
        // Réinitialisation et  rechargement
        this.deliveryForm.reset();
        this.getDeliveries();
      },
      (error) => {
        alert("Échec");
      });
    }
  }

  showPackageFormPanel() {
    // console.log('Bouton "Créer un Package" cliqué');

    this.showPackageForm = true;
    this.showDeliveryForm = false;
    this.PackagesList=false;
    this.DeliveriesList=false;
  }


  showDeliveryFormPanel() {
    //console.log('Bouton "Créer un deliv" cliqué');
    this.showPackageForm = false;
    this.showDeliveryForm = true;
    this.PackagesList=false;
    this.DeliveriesList=false;
  }


  // Fonction pour éditer un package
  editPackage(packageId: string) {
    const updatedPackage = this.packageForm.value;
    this.adminService.updatePackage(packageId, updatedPackage).subscribe(() => {

      this.packageForm.reset();
      this.getPackages();
    });
  }

  // Fonction pour supprimer un package
  deletePackage(packageId: string) {
    this.adminService.deletePackage(packageId).subscribe(() => {
      this.getPackages();
    });
  }


    // Fonction pour supprimer une livraison
    deleteDelivery(deliveryId: string) {
      this.adminService.deleteDelivery(deliveryId).subscribe(() => {
        this.getDeliveries();
        alert("supprime avec succes " );
      },
      (error) => {
        alert("Échec de la suppression à jour de la livraison : " + error.message);
      }
      );
    }

  /*les fonctions que j'ai utilisee pour edition modification d'une livraison*/
  editDelivery(deliveryId: string) {
    console.log("le bouton a ete clique");
    this.editingDelivery=true;
    // Recherchons la livraison
    const delivery = this.deliveries.find((d) => d._id === deliveryId);

    if (delivery) {
      this.isEditing = true;

      this.currentId=delivery._id;
      // Préremplissement
      this.EditDeliveryForm.setValue({
        package_id: delivery.package_id,
        pickup_time: delivery.pickup_time,
        location: {
          lat: delivery.location.lat,
          lng: delivery.location.lng,
        },
        status: delivery.status,
      });
    }
  }


    saveEditing(deliveryId: string) {
      console.log(deliveryId);


      const delivery = this.deliveries.find((d) => d._id === deliveryId);
      console.log(delivery);


      if (delivery) {

        this.adminService.updateDelivery(deliveryId, this.EditDeliveryForm.value).subscribe(() => {
          alert("Modifications enregistrées avec succès");

          this.EditDeliveryForm.reset();

          delivery.isEditing = false;

          this.getDeliveries();
        },
        (error) => {
          alert("Échec de la mise à jour de la livraison : " + error.message);
        }
        );
      }else{
        alert("echec");
      }
    }

    cancelEditing(deliveryId: string) {
      
      const delivery = this.deliveries.find((d) => d._id === deliveryId);

      if (delivery) {
        // formulaire de modification reinitialise
        this.EditDeliveryForm.reset();
        delivery.isEditing = false;
      }
    }


}
