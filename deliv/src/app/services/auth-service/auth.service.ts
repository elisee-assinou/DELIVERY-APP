import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  getAuthToken(): string | null {
    return localStorage.getItem('auth_token'); // Récupère le token depuis le local storage
  }
}
