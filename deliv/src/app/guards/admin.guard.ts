import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminService } from '../guards/admin-auth.service'; // Correctly import AdminService

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private adminService: AdminService, private router: Router) {}

  canActivate(): boolean {
    if (this.adminService.isAdminUser()) {
      // User is an admin, allow access to the route.
      return true;
    } else {
      // User is not an admin, redirect them to an error page or another appropriate page.
      this.router.navigate(['/not-authorized']);
      return false;
    }
  }
}
