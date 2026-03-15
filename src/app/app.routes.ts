import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { GroupSelection } from './group-selection/group-selection';
import { Admin } from './admin/admin';
import { GroupA } from './group-a/group-a';
import { GroupB } from './group-b/group-b';
import { GroupC } from './group-c/group-c';

export const routes: Routes = [
  // Cuando la URL está vacía, redirige a /register
  { path: '', redirectTo: 'register', pathMatch: 'full' },

  // Ruta de registro y login
  { path: 'register', component: Register },
  { path: 'login', component: Login },

  // Después del login, se elige grupo
  { path: 'select-group', component: GroupSelection },

  // Rutas para cada grupo
  { path: 'group-a', component: GroupA },
  { path: 'group-b', component: GroupB },
  { path: 'group-c', component: GroupC },

  // Ruta de la pantalla de administración (solo para admin)
  { path: 'admin', component: Admin }
];


