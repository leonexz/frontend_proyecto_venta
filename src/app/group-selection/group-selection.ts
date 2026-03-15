import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-selection',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './group-selection.html',
  styleUrl: './group-selection.css',
})
export class GroupSelection {
  groups: any[] = [];           // Lista de grupos que trae el backend para este usuario
  selectedGroup = '';           // Grupo seleccionado en el dropdown
  isAdmin = false;              // Indica si el usuario es administrador

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    // Leo el rol guardado en localStorage (se guarda en login)
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';

    // Consigo el token y pido al backend los grupos
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get('http://localhost:3000/api/groups', { headers }).subscribe((res: any) => {
      this.groups = res;  // Guardamos los grupos devueltos por backend

      // Si hay grupos, preselecciono el primero para evitar valor vacío
      if (this.groups.length > 0) {
        this.selectedGroup = this.groups[0].name;
      }
    });
  }

  onSelect() {
    // Mapeo de nombre de grupo a ruta de navegación
    const routes: Record<string, string> = {
      'GRUPO A': '/group-a',
      'GRUPO B': '/group-b',
      'GRUPO C': '/group-c'
    };

    // Normalizo el valor para comparación exacta en mayúsculas
    const selected = (this.selectedGroup || '').trim().toUpperCase();
    const route = routes[selected];

    // Si no es ruta válida, alerto
    if (!route) {
      alert('Selecciona un grupo válido');
      return;
    }

    // Navego al grupo seleccionado
    this.router.navigate([route]);
  }

  logout() {
    // Cierro sesión y elimino credenciales locales
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/register']);
  }

  goToAdmin() {
    // Si es administrador, va a la página admin
    this.router.navigate(['/admin']);
  }
}
