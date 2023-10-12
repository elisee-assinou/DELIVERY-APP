import { Component } from '@angular/core';
import { SessionLoginService } from '../../services/session_login/session-login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formData: { email: string, password: string } = { email: '', password: '' };
  error: string = '';


  constructor(
    private sessionLoginService: SessionLoginService,
    private router: Router

  ) { }

  login() {
    
    if (!this.formData.email || !this.formData.password) {
      this.error = 'Les champs email et password ne doivent pas être vides.';
      return;
    }

    this.sessionLoginService.login(this.formData).subscribe(
      (response: any) => {

        if (response.user && response.token) {
          console.log("Connexion réussie");
          localStorage.setItem('token', response.token);
          this.router.navigate(['/not-found']);
        }
      },
      (error) => {
        this.error = error.error.error;
        console.error('Erreur de connexion :', error.error.error);
      }
    );
  }
  isEmailValid(): boolean {
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(this.formData.email);
  }

}
