// delivery.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = 'http://localhost:3000/api/deliveries';

  constructor(private http: HttpClient) {}

  getDeliveryById(deliveryId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${deliveryId}`);
  }

}
