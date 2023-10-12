import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionLoginService {
  private apiUrl = 'http://localhost:3000/users'; // URL de l'API

  constructor(private http: HttpClient) {}

  login(formData: { email: string, password: string }): Observable<any> {
    // Envoie une requête POST à l'API pour authentifier l'utilisateur
    return this.http.post(`${this.apiUrl}/login`, formData);
  }
}
