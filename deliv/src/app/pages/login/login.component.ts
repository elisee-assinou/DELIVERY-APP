import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formData = {
    email: '',
    password: '',
    role: ''
  };

  error: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  login() {
    this.http.post('/api/login', this.formData).subscribe(
      (response) => {
        // Login successful
        // TODO: Store the user's data in local storage or session storage
        // TODO: Redirect the user to the appropriate page
      },
      (error) => {
        // Login failed
        this.error = error.message;
      }
    );
  }
}
