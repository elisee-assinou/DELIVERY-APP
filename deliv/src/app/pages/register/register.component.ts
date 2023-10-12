// register.component.ts

import { Component } from '@angular/core';
import { RegistrationService } from '../../services/register/registration.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formData: { username: string, email: string, password: string, role: string } = { username: '', email: '', password: '', role: 'client' };
  error: string = '';

  constructor(
    private registrationService: RegistrationService,
    private router: Router
  ) {}

  register() {
    if (!this.formData.username || !this.formData.email || !this.formData.password || !this.formData.role) {
      this.error = 'All fields are required.';
      return;
    }

    this.registrationService.register(this.formData).subscribe(
      (response: any) => {
        if (response.success) {
          console.log("Registration successful");
          // Vous pouvez rediriger l'utilisateur vers la page d'accueil ou une autre page après l'inscription.
          this.router.navigate(['/home']);
        } else {
          this.error = response.message || "Registration failed";
          console.error("Registration error:", this.error);
        }
      },
      (error) => {
        this.error = error.error.error;
        console.error("Registration error:", error.error.error);
      }
    );
  }

  isEmailValid(): boolean {
    // Vous pouvez inclure ici votre validation d'e-mail.
    // Par exemple, en utilisant une expression régulière comme vous l'avez fait précédemment.
    return true;
  }
}
