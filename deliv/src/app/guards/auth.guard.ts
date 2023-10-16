import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionLoginService } from '../services/session_login/session-login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private sessionLoginService: SessionLoginService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.sessionLoginService.isLoggedIn) {
      return true; 
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
