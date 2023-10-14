import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class SessionLoginService {
  private apiUrl = 'http://localhost:3000/users';
  isLoggedIn: boolean = false;

  constructor(private http: HttpClient) { }

  login(formData: { email: string, password: string }): Observable<any> {

    return this.http.post(`${this.apiUrl}/login`, formData);
  }
  logout(): void {
    this.isLoggedIn = false;
  }

  getUserIsAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwt_decode(token);
        return decodedToken.isAdmin;
      } catch (error) {
        console.error('Erreur lors du décodage du token :', error);
      }
    }
    return false;
  }

  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwt_decode(token);
        return decodedToken.role;
      } catch (error) {
        console.error('Erreur lors du décodage du token :', error);
      }
    }
    return null;
  }

  getUserEmail(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwt_decode(token);
        console.log(decodedToken.email);

        return decodedToken.email;
      } catch (error) {
        console.error('Erreur lors du décodage du token :', error);
      }
    }
    return null;
  }


}
