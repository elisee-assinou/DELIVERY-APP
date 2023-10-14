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

    const usernamePattern = /^[a-zA-Z0-9]+$/;
    if (!usernamePattern.test(this.formData.username)) {
      this.error = 'Username can only contain letters and numbers.';
      return;
    }
    if (!this.formData.username || !this.formData.email || !this.formData.password || !this.formData.role) {
      this.error = 'All fields are required.';
      return;
    }

    this.registrationService.register(this.formData).subscribe(
      (response: any) => {
        if (response) {
          console.log("Registration successful");
          this.router.navigate(['/login']);
        }
      },
      (error) => {
        this.error = error.error.error;
        console.log(error.status);

        console.error("Registration error:", error.error.error);
      }
    );
  }

  isEmailValid(): boolean {
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(this.formData.email);
  }
}
