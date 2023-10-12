import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'http://localhost:3000/users'; // URL de l'API

  constructor(private http: HttpClient) {}

  register(formData: { username: string, email: string, password: string, role: string }): Observable<any> {
    // Envoie une requête POST à l'API pour l'inscription de l'utilisateur
    return this.http.post(`${this.apiUrl}/register`, formData);
  }
}
