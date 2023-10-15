import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'https://votre-api.com'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  // Opérations sur les packages

  getAllPackages(): Observable<any[]> {
    const url = `${this.apiUrl}/packages`;
    return this.http.get<any[]>(url);
  }

  getPackageById(packageId: string): Observable<any> {
    const url = `${this.apiUrl}/packages/${packageId}`;
    return this.http.get<any>(url);
  }

  createPackage(package_one: any): Observable<any> {
    const url = `${this.apiUrl}/packages`;
    return this.http.post<any>(url, package_one);
  }

  updatePackage(packageId: string, package_one: any): Observable<any> {
    const url = `${this.apiUrl}/packages/${packageId}`;
    return this.http.put<any>(url, package_one);
  }

  deletePackage(packageId: string): Observable<any> {
    const url = `${this.apiUrl}/packages/${packageId}`;
    return this.http.delete<any>(url);
  }

  // Opérations sur les livraisons

  getAllDeliveries(): Observable<any[]> {
    const url = `${this.apiUrl}/deliveries`;
    return this.http.get<any[]>(url);
  }

  getDeliveryById(deliveryId: string): Observable<any> {
    const url = `${this.apiUrl}/deliveries/${deliveryId}`;
    return this.http.get<any>(url);
  }

  createDelivery(delivery: any): Observable<any> {
    const url = `${this.apiUrl}/deliveries`;
    return this.http.post<any>(url, delivery);
  }

  updateDelivery(deliveryId: string, delivery: any): Observable<any> {
    const url = `${this.apiUrl}/deliveries/${deliveryId}`;
    return this.http.put<any>(url, delivery);
  }

  deleteDelivery(deliveryId: string): Observable<any> {
    const url = `${this.apiUrl}/deliveries/${deliveryId}`;
    return this.http.delete<any>(url);
  }

  // D'autres méthodes au besoin
}
