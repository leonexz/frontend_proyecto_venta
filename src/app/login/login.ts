import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = ''; // almacena el input del usuario
  password = ''; // almacena el input de la contraseña

  constructor(private http: HttpClient, private router: Router) { }

  onLogin() {
    // Envía usuario y contraseña al backend para autenticar
    this.http.post('http://localhost:3000/api/login', { username: this.username, password: this.password })
      .subscribe({
        next: (res: any) => {
          // Si login es correcto, guardamos token y rol en localStorage
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);  // Guarda el rol
          // Redirige a la selección de grupo
          this.router.navigate(['/select-group']);
        },
        error: (err) => {
          // Si el backend devuelve 403, significa que no está registrado aún
          if (err.status === 403) {
            this.router.navigate(['/register']);
            alert(err.error.error);  // Muestra "Usuario registrado. Espere..."
          } else {
            alert('Error en login: ' + (err.error?.error || 'Desconocido'));
          }
        }
      });
  }
}
