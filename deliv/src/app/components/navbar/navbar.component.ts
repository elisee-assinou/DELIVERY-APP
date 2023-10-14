import { Component } from '@angular/core';
import { SessionLoginService } from '../../services/session_login/session-login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private sessionLoginService: SessionLoginService,
    private router: Router) {}

  get isLoggedIn(): boolean {
    return this.sessionLoginService.isLoggedIn;
  }
  get isAdmin(): boolean {
    return this.sessionLoginService.getUserIsAdmin();
  }
  get email() {
    return this.sessionLoginService.getUserEmail();
  }
  get userRole(){
    return this.sessionLoginService.getUserRole();
  }
  logout(event: Event): void {

    event.preventDefault();
    this.sessionLoginService.logout();
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
