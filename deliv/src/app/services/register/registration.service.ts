import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  register(formData: { username: string, email: string, password: string, role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, formData);
  }
}
