import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

interface UserFile {
  id: number;
  file_name: string;
  file_path: string;
  uploaded_at: string;
}

@Component({
  selector: 'app-group-b',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-b.html',
  styleUrl: './group-b.css',
})
export class GroupB implements OnInit {
  activeTab = 'home';
  selectedFile: File | null = null;
  errorMessage = '';
  successMessage = '';
  uploadedFiles: UserFile[] = [];
  loadingFiles = false;
  deletingFileId: number | null = null;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordError = '';
  passwordSuccess = '';
  changingPassword = false;
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.loadUserFiles();
  }

  setTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'messages') {
      this.loadUserFiles();
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/register']);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  loadUserFiles() {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    this.loadingFiles = true;
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<UserFile[]>(`${environment.apiUrl}/api/user-files`, { headers })
      .subscribe({
        next: (files) => {
          this.uploadedFiles = files;
          this.loadingFiles = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'No se pudo cargar el archivo subido';
          this.loadingFiles = false;
        }
      });
  }

  uploadPdf() {
    if (!this.selectedFile) {
      this.errorMessage = 'Selecciona un archivo PDF';
      return;
    }

    if (this.uploadedFiles.length > 0) {
      this.errorMessage = 'Ya tienes un archivo subido. Retiralo antes de cargar uno nuevo';
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Debes iniciar sesión';
      return;
    }

    const formData = new FormData();
    formData.append('pdfFile', this.selectedFile);

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.post(`${environment.apiUrl}/api/subir-pdf`, formData, { headers })
      .subscribe({
        next: (res: any) => {
          this.successMessage = res.message || 'Archivo subido';
          this.errorMessage = '';
          this.selectedFile = null;
          this.loadUserFiles();
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'Error al subir el archivo';
          this.successMessage = '';
        }
      });
  }

  removeFile(fileId: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Debes iniciar sesión';
      return;
    }

    const confirmed = window.confirm('¿Deseas retirar el archivo subido?');
    if (!confirmed) {
      return;
    }

    this.deletingFileId = fileId;
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.delete(`${environment.apiUrl}/api/user-files/${fileId}`, { headers })
      .subscribe({
        next: (res: any) => {
          this.successMessage = res.message || 'Archivo retirado';
          this.errorMessage = '';
          this.deletingFileId = null;
          this.loadUserFiles();
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'No se pudo retirar el archivo';
          this.successMessage = '';
          this.deletingFileId = null;
        }
      });
  }
  changePassword() {
    this.passwordError = '';
    this.passwordSuccess = '';

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordError = 'Completa todos los campos';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'La confirmación no coincide';
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.passwordError = 'Sesión no válida';
      return;
    }

    this.changingPassword = true;
    this.http.put('http://localhost:3000/api/change-password',
      {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).subscribe({
      next: (res: any) => {
        this.passwordSuccess = res.message || 'Contraseña actualizada';
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.changingPassword = false;
      },
      error: (err) => {
        this.passwordError = err.error?.error || 'No se pudo actualizar la contraseña';
        this.changingPassword = false;
      }
    });
  }

}
