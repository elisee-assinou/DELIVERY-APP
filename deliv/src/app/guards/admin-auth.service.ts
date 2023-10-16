// admin.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private isAdmin = false; // Par défaut, aucun utilisateur n'est administrateur.

  constructor() {}

  // Méthode pour vérifier si un utilisateur est un administrateur.
  isAdminUser(): boolean {
    return this.isAdmin;
  }

  // Méthode pour définir le statut d'administrateur d'un utilisateur.
  setAdminStatus(isAdmin: boolean): void {
    this.isAdmin = isAdmin;
  }
}
