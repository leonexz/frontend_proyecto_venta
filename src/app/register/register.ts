import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
username = '';
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    this.http.post('http://localhost:3000/api/register', { username: this.username, email: this.email, password: this.password })
      .subscribe({
        next: (res: any) => {
          alert('Usuario registrado. Ahora inicia sesión.');
          this.router.navigate(['/']);
        },
        error: (err) => {
          alert('Error en registro: ' + (err.error?.error || 'Desconocido'));
        }
      });
  }
}
