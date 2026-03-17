import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  users: any[] = [];
  allGroups: any[] = [];
  userGroups: { [userId: number]: any[] } = {};
  isAdmin = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      this.isAdmin = true;
      this.loadUsers();
      this.loadGroups();
    } else {
      this.router.navigate(['/']);
    }
  }

  loadUsers() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get(`${environment.apiUrl}/users`, { headers }).subscribe((res: any) => {
      this.users = res;
      this.users.forEach(user => this.loadUserGroups(user.id));
    });
  }

  loadGroups() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get(`${environment.apiUrl}/all-groups`, { headers }).subscribe((res: any) => {
      this.allGroups = res;
    });
  }
  loadUserGroups(userId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get(`${environment.apiUrl}/users/${userId}/groups`, { headers }).subscribe((res: any) => {
      this.userGroups[userId] = res;
    });
  }
  getUserGroups(userId: number): any[] {
    const user = this.users.find(u => u.id === userId);
    return user ? user.groups || [] : [];
  }

  assignGroup(userId: number, event: any) {
    const groupId = event.target.value;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.put(`${environment.apiUrl}/users/${userId}/group`, { groupId }, { headers }).subscribe({
      next: () => {
        alert('Grupo asignado');
        this.loadUsers();
        event.target.value = '';
      },
      error: (err) => {
        alert('Error: ' + (err.error?.error || 'No se pudo asignar el grupo'));
        event.target.value = '';
      }
    });
  }

  revokeGroup(userId: number, groupId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.delete(`${environment.apiUrl}/users/${userId}/group/${groupId}`, { headers }).subscribe(() => {
      alert('Grupo revocado');
      this.loadUserGroups(userId);
    });
  }

  isGroupAssigned(userId: number, groupId: number): boolean {
    return this.userGroups[userId]?.some(g => g.id === groupId) || false;
  }

  changePassword(userId: number) {
    const newPassword = prompt('Nueva contraseña:');
    if (newPassword) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      this.http.put(`${environment.apiUrl}/users/${userId}/password`, { newPassword }, { headers }).subscribe(() => {
        alert('Contraseña cambiada');
      });
    }
  }

  deleteUser(userId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.delete(`${environment.apiUrl}/users/${userId}`, { headers }).subscribe(() => {
      alert('Usuario eliminado');
      this.loadUsers();
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/register']);
  }
}
