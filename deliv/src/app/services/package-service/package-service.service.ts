// package-service.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private apiUrl = 'http://localhost/3000/api/packages';

  constructor(private http: HttpClient) {}

  getPackageDetails(packageId: string): Observable<any> {
    return this.http.get("http://localhost:3000/api/packages/"+packageId);
  }
}
